'use strict';

// ─── Detection data sets ──────────────────────────────────────────────────────

const HIGH_RISK_TLDS = new Set([
  '.tk','.ml','.ga','.cf','.gq','.pw','.top','.xyz','.online',
  '.click','.ru','.cn','.su','.tk','.work','.date','.review',
  '.stream','.download','.racing','.win','.loan','.trade'
]);

const URGENCY_PHRASES = [
  'act immediately','asap','24 hours','48 hours','expires today',
  'action required','final notice','account will be closed','verify now',
  'password expired','immediately','respond urgently','last chance',
  'do not ignore','time sensitive','urgent attention','expires soon',
  'limited time','within 24','act now'
];

const BEC_WORDS = [
  'wire transfer','ach payment','routing number','account number',
  'process payment','do not discuss','confidential request','board meeting',
  'executive','ceo','cfo','president','payroll','vendor payment',
  'urgent payment','bank transfer','swift transfer','international wire'
];

const CREDENTIAL_HARVESTING = [
  'enter your password','confirm your credentials','update your login',
  'verify your account','sign in to continue','your account has been',
  'click here to verify','confirm your email','update payment',
  'billing information required','re-enter','validate your account',
  'suspended account','locked account','unusual sign-in','unusual activity'
];

const INVOICE_FRAUD = [
  'invoice attached','payment due','outstanding invoice','overdue payment',
  'please process','remittance','purchase order','po number',
  'bank details have changed','new account details','updated payment',
  'updated banking','new wire instructions','payment instructions have changed'
];

const SHORTENED_DOMAINS = new Set([
  'bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','buff.ly',
  'short.link','rb.gy','cutt.ly','is.gd','tiny.cc','lnkd.in',
  'dlvr.it','ift.tt','youtu.be','fb.me','adf.ly','bc.vc'
]);

const ATTACHMENT_RISK_EXTS = /\.(exe|zip|js|vbs|docm|xlsm|ps1|bat|cmd|scr|jar|iso|img|dmg|msi|reg|hta|wsf|rar|7z|lnk|pif)$/i;

const IP_PATTERN = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

const SPOOFED_BRANDS = [
  { brand: 'PayPal',       patterns: [/paypa1|pay-pal|paypai|paypal-/i] },
  { brand: 'Microsoft',    patterns: [/micr0soft|microsof7|microsoft-(?!com)/i] },
  { brand: 'Apple',        patterns: [/app1e\.com|apple-[^.]+\.(?!com$)/i] },
  { brand: 'Google',       patterns: [/g00gle|googl3|google-[^.]+\.(?!com$)/i] },
  { brand: 'Amazon',       patterns: [/amaz0n|amazon-[^.]+\.(?!com$)/i] },
  { brand: 'Netflix',      patterns: [/netfl1x|netflix-[^.]+\.(?!com$)/i] },
  { brand: 'Bank of America', patterns: [/bankofamerica-/i] },
  { brand: 'Chase',        patterns: [/chase-[^.]+\./i] },
  { brand: 'IRS',          patterns: [/irs-[^.]+\.|irs\.(?!gov)/i] },
  { brand: 'DocuSign',     patterns: [/docusign-[^.]+\.(?!com$)/i] },
  { brand: 'DHL',          patterns: [/dhl-[^.]+\.(?!com$)/i] },
  { brand: 'FedEx',        patterns: [/fedex-[^.]+\.(?!com$)/i] },
  { brand: 'LinkedIn',     patterns: [/1inkedin|linkedln|linkedin-[^.]+\.(?!com$)/i] },
  { brand: 'Dropbox',      patterns: [/dr0pbox|dropbox-[^.]+\.(?!com$)/i] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractDomain(email) {
  if (!email) return '';
  const match = email.match(/<([^>]+)>/);
  const addr = match ? match[1] : email;
  const parts = addr.trim().split('@');
  return parts.length === 2 ? parts[1].toLowerCase().trim() : '';
}

function getTld(domain) {
  const parts = domain.split('.');
  return parts.length >= 2 ? '.' + parts[parts.length - 1] : '';
}

// ─── Main analysis function ──────────────────────────────────────────────────

/**
 * Analyzes an email for phishing indicators.
 *
 * @param {object} opts
 * @param {string} opts.from          - Sender email (raw header value)
 * @param {string} [opts.replyTo]     - Reply-To header value
 * @param {string} [opts.subject]     - Subject line
 * @param {string} [opts.body]        - Plain-text body
 * @param {Array}  [opts.attachments] - [{filename, mimeType, size}]
 * @param {Array}  [opts.urls]        - Extracted URLs from body
 * @param {object} [opts.headers]     - { authResults, receivedSpf, hasDkim, returnPath }
 * @returns {object} Analysis result
 */
function analyzeEmailPhish({ from = '', replyTo = '', subject = '', body = '', attachments = [], urls = [], headers = {} }) {
  const findings = [];
  let risk = 0;

  const senderDomain = extractDomain(from);
  const replyToDomain = extractDomain(replyTo);
  const returnPathDomain = headers.returnPath ? extractDomain(headers.returnPath) : '';
  const subLower = subject.toLowerCase();
  const bodyLower = body.toLowerCase();

  // ── 1. Suspicious sender domain (high-risk TLD) ────────────────────────────
  if (senderDomain) {
    const tld = getTld(senderDomain);
    if (HIGH_RISK_TLDS.has(tld)) {
      findings.push({
        severity: 'critical',
        category: 'Suspicious Sender Domain',
        text: `Sender domain "${senderDomain}" uses a high-risk free TLD (${tld}) — overwhelmingly associated with phishing campaigns. Legitimate organizations do not use these TLDs.`
      });
      risk += 35;
    }
  }

  // ── 2. Reply-To mismatch ───────────────────────────────────────────────────
  if (senderDomain && replyToDomain && senderDomain !== replyToDomain) {
    findings.push({
      severity: 'critical',
      category: 'Reply-To Mismatch',
      text: `Sender is "@${senderDomain}" but replies route to "@${replyToDomain}" — a classic phishing technique used to intercept responses containing credentials or sensitive data.`
    });
    risk += 30;
  }

  // ── 3. Return-Path mismatch ───────────────────────────────────────────────
  if (returnPathDomain && senderDomain && returnPathDomain !== senderDomain) {
    findings.push({
      severity: 'warning',
      category: 'Return-Path Mismatch',
      text: `Return-Path domain "@${returnPathDomain}" differs from sender "@${senderDomain}" — may indicate header spoofing or compromised mail infrastructure.`
    });
    risk += 15;
  }

  // ── 4. Spoofed brand names ────────────────────────────────────────────────
  const spoofedBrands = [];
  SPOOFED_BRANDS.forEach(({ brand, patterns }) => {
    const targets = [senderDomain, subLower, bodyLower.substring(0, 500)];
    if (patterns.some(p => targets.some(t => p.test(t)))) {
      spoofedBrands.push(brand);
    }
  });
  if (spoofedBrands.length > 0) {
    findings.push({
      severity: 'critical',
      category: 'Spoofed Brand Names',
      text: `Email appears to impersonate: ${spoofedBrands.join(', ')} — fraudulent brand impersonation designed to steal credentials or financial information.`
    });
    risk += 40;
  }

  // ── 5. Urgent language ────────────────────────────────────────────────────
  const urgFound = URGENCY_PHRASES.filter(k => bodyLower.includes(k) || subLower.includes(k));
  if (urgFound.length >= 2) {
    findings.push({
      severity: 'warning',
      category: 'Urgent Language',
      text: `Multiple urgency pressure tactics: "${urgFound.slice(0, 3).join('", "')}" — social engineering designed to prevent rational evaluation of the request.`
    });
    risk += 20;
  } else if (urgFound.length === 1) {
    findings.push({
      severity: 'info',
      category: 'Urgent Language',
      text: `Urgency language detected: "${urgFound[0]}" — verify through official channels before acting.`
    });
    risk += 8;
  }

  // ── 6. Credential harvesting language ────────────────────────────────────
  const credFound = CREDENTIAL_HARVESTING.filter(k => bodyLower.includes(k));
  if (credFound.length >= 2) {
    findings.push({
      severity: 'critical',
      category: 'Credential Harvesting Language',
      text: `Credential-targeting language: "${credFound.slice(0, 2).join('", "')}" — designed to trick recipients into submitting login credentials to attacker-controlled pages.`
    });
    risk += 35;
  } else if (credFound.length === 1) {
    findings.push({
      severity: 'warning',
      category: 'Credential Harvesting Language',
      text: `Credential reference: "${credFound[0]}" — verify sender authenticity before clicking any links or entering any credentials.`
    });
    risk += 15;
  }

  // ── 7. BEC / wire fraud indicators ───────────────────────────────────────
  const becFound = BEC_WORDS.filter(k => bodyLower.includes(k));
  if (becFound.length >= 2) {
    findings.push({
      severity: 'critical',
      category: 'BEC / Wire Fraud Indicators',
      text: `Business Email Compromise pattern: "${becFound.slice(0, 3).join('", "')}" — attackers impersonate executives to authorize fraudulent wire transfers or vendor payments. Average BEC loss: $125,000+.`
    });
    risk += 35;
  }

  // ── 8. Invoice fraud indicators ───────────────────────────────────────────
  const invoiceFound = INVOICE_FRAUD.filter(k => bodyLower.includes(k));
  if (invoiceFound.length >= 2) {
    findings.push({
      severity: 'critical',
      category: 'Invoice / Payment Fraud',
      text: `Invoice fraud indicators: "${invoiceFound.slice(0, 2).join('", "')}" — fraudulent redirection of legitimate payments to attacker-controlled accounts.`
    });
    risk += 30;
  }

  // ── 9. Suspicious URLs ────────────────────────────────────────────────────
  const suspiciousUrls = [];
  const shortenedUrls = [];
  const unusualTldUrls = [];

  urls.forEach(url => {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      const tld = getTld(host);

      if (IP_PATTERN.test(host)) {
        findings.push({
          severity: 'critical',
          category: 'Suspicious URL — Raw IP',
          text: `Link uses a raw IP address (${host}) instead of a domain name — no legitimate service uses an IP as a host. Strong malware and phishing indicator.`
        });
        risk += 40;
        suspiciousUrls.push(url);
      }

      if (SHORTENED_DOMAINS.has(host)) {
        shortenedUrls.push(url);
        risk += 10;
      }

      if (HIGH_RISK_TLDS.has(tld)) {
        unusualTldUrls.push(url);
        suspiciousUrls.push(url);
        risk += 25;
      }

      if (!suspiciousUrls.includes(url) &&
          /login|verify|confirm|update|secure|account|password|credential|reset|auth/i.test(u.pathname + u.search)) {
        suspiciousUrls.push(url);
        risk += 10;
      }
    } catch { /* invalid URL — ignore */ }
  });

  if (shortenedUrls.length > 0) {
    findings.push({
      severity: 'warning',
      category: 'Shortened URLs',
      text: `${shortenedUrls.length} shortened URL(s) detected — the real destination is hidden, a common tactic to disguise phishing or malware delivery links.`
    });
  }
  if (unusualTldUrls.length > 0) {
    findings.push({
      severity: 'critical',
      category: 'Unusual TLDs in Links',
      text: `${unusualTldUrls.length} link(s) pointing to high-risk TLD domains — free/abused domains disproportionately associated with phishing infrastructure.`
    });
  }

  // ── 10. Attachment risk ───────────────────────────────────────────────────
  const riskyAttachments = attachments.filter(a => ATTACHMENT_RISK_EXTS.test(a.filename || ''));
  if (riskyAttachments.length > 0) {
    findings.push({
      severity: 'critical',
      category: 'Attachment Risk',
      text: `High-risk attachment(s) detected: ${riskyAttachments.map(a => a.filename).join(', ')} — executable or macro-enabled files are the primary ransomware and malware delivery mechanism. Do not open.`
    });
    risk += 40;
  } else if (attachments.length > 0) {
    findings.push({
      severity: 'info',
      category: 'Attachments Present',
      text: `${attachments.length} attachment(s): ${attachments.map(a => a.filename).join(', ')} — no high-risk file types detected, but verify sender before opening.`
    });
    risk += 5;
  }

  // ── 11. SPF / authentication headers ─────────────────────────────────────
  if (headers.receivedSpf) {
    const spfFail = /fail|softfail/i.test(headers.receivedSpf);
    if (spfFail) {
      findings.push({
        severity: 'critical',
        category: 'SPF Authentication Failure',
        text: `SPF check failed — this email did NOT originate from an authorized server for "${senderDomain}". This is a strong indicator of domain spoofing.`
      });
      risk += 25;
    }
  }

  // ── Clamp and verdict ─────────────────────────────────────────────────────
  risk = Math.min(risk, 100);

  let verdict, riskLevel;
  if (risk >= 70)      { verdict = 'MALICIOUS';  riskLevel = 'danger'; }
  else if (risk >= 45) { verdict = 'HIGH RISK';  riskLevel = 'high'; }
  else if (risk >= 20) { verdict = 'SUSPICIOUS'; riskLevel = 'warning'; }
  else                 { verdict = 'SAFE';        riskLevel = 'safe'; }

  const recommendedAction = {
    'MALICIOUS':  'Do not click any links or open attachments. Report to IT Security immediately. Delete this email.',
    'HIGH RISK':  'Do not respond, click links, or open attachments until the sender is verified via phone or official channels. Report to IT Security.',
    'SUSPICIOUS': 'Verify sender identity through official channels before responding. Do not share credentials or sensitive information.',
    'SAFE':       'No immediate threats detected. Standard email hygiene applies — hover over links before clicking.'
  }[verdict];

  // ── Compliance mapping ────────────────────────────────────────────────────
  const complianceMapping = [];
  const cats = new Set(findings.map(f => f.category));

  if (cats.has('Credential Harvesting Language') || cats.has('Spoofed Brand Names')) {
    complianceMapping.push('HIPAA §164.312(a)(1) — Access Control');
    complianceMapping.push('PCI-DSS Req 8 — User Identification & Authentication');
    complianceMapping.push('ISO 27001 A.9.2 — User Access Management');
    complianceMapping.push('NIST 800-53 IA-2 — Identification and Authentication');
  }
  if (cats.has('BEC / Wire Fraud Indicators') || cats.has('Invoice / Payment Fraud')) {
    complianceMapping.push('SOX — Financial controls and fraud prevention');
    complianceMapping.push('PCI-DSS Req 12 — Information Security Policy');
    complianceMapping.push('GLBA Safeguards Rule — Customer information protection');
  }
  if (cats.has('Attachment Risk')) {
    complianceMapping.push('HIPAA §164.308(a)(7) — Contingency Plan / Ransomware Prevention');
    complianceMapping.push('NIST SP 800-61 — Computer Security Incident Handling');
    complianceMapping.push('CIS Control 10 — Malware Defenses');
  }
  if (cats.has('SPF Authentication Failure') || cats.has('Reply-To Mismatch')) {
    complianceMapping.push('DMARC/DKIM/SPF — Email authentication standards');
    complianceMapping.push('NIST 800-177 — Trustworthy Email');
  }

  if (findings.length === 0) {
    findings.push({
      severity: 'safe',
      category: 'No Threats Detected',
      text: 'No phishing patterns, high-risk indicators, or suspicious content detected. Email appears consistent with legitimate communication.'
    });
  }

  return {
    verdict,
    riskLevel,
    riskScore: risk,
    findings,
    suspiciousUrls: [...new Set(suspiciousUrls)],
    shortenedUrls,
    riskyAttachments,
    recommendedAction,
    complianceMapping
  };
}

module.exports = analyzeEmailPhish;
