'use strict';

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { google } = require('googleapis');
const analyzeEmailPhish = require('./phish-engine');

const app = express();

app.use(express.json());
app.use(express.static(__dirname, {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ─── OAuth helpers ─────────────────────────────────────────────────────────────

const GMAIL_SCOPE = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
];

function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function getGmailClient(tokens) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function requireAuth(req, res, next) {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'Not authenticated. Please connect your Gmail account.' });
  }
  next();
}

// ─── Auth routes ───────────────────────────────────────────────────────────────

app.get('/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).send('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
  }
  const oauth2Client = createOAuth2Client();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GMAIL_SCOPE,
    prompt: 'consent'
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth error from Google:', error);
    return res.redirect('/?gmail_error=' + encodeURIComponent(error));
  }
  if (!code) {
    return res.redirect('/?gmail_error=no_code');
  }

  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2Api.userinfo.get();

    req.session.tokens = tokens;
    req.session.userEmail = userInfo.email;
    req.session.userName = userInfo.name || userInfo.email;

    res.redirect('/?gmail=connected');
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    res.redirect('/?gmail_error=auth_failed');
  }
});

app.get('/api/auth/status', (req, res) => {
  if (req.session.tokens) {
    res.json({ loggedIn: true, email: req.session.userEmail, name: req.session.userName });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Session destroy error:', err);
  });
  res.json({ success: true });
});

// ─── Gmail — list messages ─────────────────────────────────────────────────────

app.get('/api/gmail/messages', requireAuth, async (req, res) => {
  try {
    const gmail = getGmailClient(req.session.tokens);

    const listRes = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 20,
      labelIds: ['INBOX']
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) return res.json({ messages: [] });

    const messageDetails = await Promise.all(
      messages.map(async ({ id, threadId }) => {
        try {
          const detail = await gmail.users.messages.get({
            userId: 'me',
            id,
            format: 'metadata',
            metadataHeaders: ['From', 'Subject', 'Date', 'Reply-To']
          });

          const headers = detail.data.payload?.headers || [];
          const h = name => headers.find(x => x.name.toLowerCase() === name.toLowerCase())?.value || '';

          return {
            id,
            threadId,
            from: h('From'),
            subject: h('Subject') || '(No subject)',
            date: h('Date'),
            replyTo: h('Reply-To'),
            snippet: detail.data.snippet || '',
            riskStatus: null
          };
        } catch {
          return null;
        }
      })
    );

    res.json({ messages: messageDetails.filter(Boolean) });
  } catch (err) {
    console.error('Gmail messages error:', err.message);
    if (err.code === 401) {
      req.session.destroy();
      return res.status(401).json({ error: 'Gmail session expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to fetch Gmail messages.' });
  }
});

// ─── Gmail — analyze a message ─────────────────────────────────────────────────

function parseMessageBody(payload) {
  let text = '';
  let html = '';

  function walk(part) {
    if (!part) return;
    if (part.mimeType === 'text/plain' && part.body?.data) {
      text += Buffer.from(part.body.data, 'base64url').toString('utf-8');
    } else if (part.mimeType === 'text/html' && part.body?.data) {
      html += Buffer.from(part.body.data, 'base64url').toString('utf-8');
    }
    (part.parts || []).forEach(walk);
  }
  walk(payload);

  if (!text && html) {
    text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
  }
  return text;
}

function extractAttachments(payload) {
  const attachments = [];
  function walk(part) {
    if (!part) return;
    if (part.filename && part.filename.length > 0) {
      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType || 'application/octet-stream',
        size: part.body?.size || 0
      });
    }
    (part.parts || []).forEach(walk);
  }
  walk(payload);
  return attachments;
}

function extractURLs(text) {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  return [...new Set(text.match(urlRegex) || [])];
}

app.post('/api/gmail/analyze', requireAuth, async (req, res) => {
  const { messageId } = req.body;
  if (!messageId) return res.status(400).json({ error: 'messageId is required.' });

  try {
    const gmail = getGmailClient(req.session.tokens);

    const detail = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });

    const payload = detail.data.payload || {};
    const headers = payload.headers || [];
    const h = name => headers.find(x => x.name.toLowerCase() === name.toLowerCase())?.value || '';

    const from          = h('From');
    const replyTo       = h('Reply-To');
    const subject       = h('Subject');
    const date          = h('Date');
    const authResults   = h('Authentication-Results');
    const receivedSpf   = h('Received-SPF');
    const returnPath    = h('Return-Path');
    const hasDkim       = headers.some(x => x.name.toLowerCase() === 'dkim-signature');

    const bodyText   = parseMessageBody(payload);
    const attachments = extractAttachments(payload);
    const urls        = extractURLs(bodyText);

    const analysis = analyzeEmailPhish({
      from,
      replyTo,
      subject,
      body: bodyText,
      attachments,
      urls,
      headers: { authResults, receivedSpf, hasDkim, returnPath }
    });

    // Return only analysis + minimal metadata; never store or return full body
    res.json({
      messageId,
      from,
      replyTo,
      subject,
      date,
      snippet: detail.data.snippet || '',
      attachments,
      urls: urls.slice(0, 30),
      analysis
    });
  } catch (err) {
    console.error('Analyze error:', err.message);
    if (err.code === 401) {
      req.session.destroy();
      return res.status(401).json({ error: 'Gmail session expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to analyze message.' });
  }
});

// ─── Gmail — AI analysis (explicit user action only) ──────────────────────────

app.post('/api/gmail/ai-analyze', requireAuth, async (req, res) => {
  const { messageId } = req.body;
  if (!messageId) return res.status(400).json({ error: 'messageId is required.' });

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return res.status(503).json({
      error: 'AI analysis is not configured. Add ANTHROPIC_API_KEY to your .env file.'
    });
  }

  try {
    const gmail = getGmailClient(req.session.tokens);

    const detail = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });

    const payload = detail.data.payload || {};
    const headers = payload.headers || [];
    const h = name => headers.find(x => x.name.toLowerCase() === name.toLowerCase())?.value || '';

    const from     = h('From');
    const replyTo  = h('Reply-To');
    const subject  = h('Subject');
    const bodyText = parseMessageBody(payload);
    const urls     = extractURLs(bodyText);
    const attachments = extractAttachments(payload);

    const prompt = `You are a cybersecurity expert specializing in phishing email detection. Analyze this email and respond ONLY with valid JSON.

FROM: ${from}
REPLY-TO: ${replyTo || '(same as From)'}
SUBJECT: ${subject}
BODY (first 2000 characters):
${bodyText.substring(0, 2000)}
URLS FOUND: ${urls.slice(0, 10).join(', ') || 'none'}
ATTACHMENTS: ${attachments.map(a => a.filename).join(', ') || 'none'}

Respond with this exact JSON schema and nothing else:
{
  "verdict": "SAFE" or "SUSPICIOUS" or "HIGH_RISK" or "MALICIOUS",
  "confidence": "high" or "medium" or "low",
  "riskScore": <integer 0-100>,
  "summary": "<one concise sentence describing the threat or lack thereof>",
  "indicators": ["<indicator 1>", "<indicator 2>"],
  "recommendedAction": "<specific action to take>",
  "complianceNotes": "<relevant compliance framework implications, or 'None' if safe>"
}`;

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!aiRes.ok) {
      const errData = await aiRes.json().catch(() => ({}));
      return res.status(502).json({ error: `Anthropic API error: ${errData.error?.message || aiRes.status}` });
    }

    const aiData = await aiRes.json();
    const rawText = (aiData.content?.[0]?.text || '').trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); }
        catch { return res.status(502).json({ error: 'AI returned an unparseable response. Please try again.' }); }
      } else {
        return res.status(502).json({ error: 'AI returned an unparseable response. Please try again.' });
      }
    }

    res.json({ aiAnalysis: parsed });
  } catch (err) {
    console.error('AI analyze error:', err.message);
    res.status(500).json({ error: 'AI analysis failed: ' + err.message });
  }
});

// ─── Start server ──────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nPhishGuard Pro  ·  http://localhost:${PORT}`);
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('\n⚠️  GOOGLE_CLIENT_ID not set — Gmail integration will not work.');
    console.log('   Copy .env.example to .env and fill in your Google OAuth credentials.\n');
  } else {
    console.log(`OAuth redirect URI: ${process.env.GOOGLE_REDIRECT_URI}`);
  }
});
