# 🛡️ PhishGuard Pro

### Multi-Sector Phishing Detection Platform

![Version](https://img.shields.io/badge/version-3.1-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Sectors](https://img.shields.io/badge/sectors-5-orange?style=flat-square)
![Frameworks](https://img.shields.io/badge/compliance%20frameworks-13-purple?style=flat-square)
![Gmail](https://img.shields.io/badge/Gmail-OAuth%202.0-red?style=flat-square&logo=gmail)

An **open-source, browser-based** educational and defensive cybersecurity platform for detecting phishing threats across Healthcare, Finance, Government, Education, and Enterprise — with real-time compliance mapping to 13 federal and international security frameworks. 

🌐 **Live Site:** [https://mtewari1981.github.io/phishguard-pro/](https://mtewari1981.github.io/phishguard-pro/)

---

## Table of Contents

- [Overview](#overview)
- [Sectors & Compliance](#sectors--compliance)
- [Features](#features)
- [Live Threat Intelligence](#live-threat-intelligence)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Gmail Integration](#gmail-integration)
- [Use Cases](#use-cases)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PhishGuard Pro is a client-side threat detection platform that analyzes suspicious emails and URLs for phishing, social engineering, malware delivery, and sector-targeted attacks.

PhishGuard Pro is designed not only to analyze phishing emails and suspicious URLs but also to improve cybersecurity awareness by helping users understand *why* a message or website appears malicious. By combining threat analysis with explanations aligned to recognized cybersecurity frameworks, the platform serves as both a practical defensive tool and a learning resource for organizations seeking to strengthen their cybersecurity posture.

**Key principles:**
- 🔒 **Privacy-first** — core analysis runs entirely in your browser; no backend, no tracking, no accounts required
- ⚡ **Zero setup** — open `index.html` in any browser, or visit the live site, and it works instantly
- 🏛 **Compliance-aware** — every threat finding maps to a specific regulatory control
- 🆓 **Free to use** — no registration required; optional API keys unlock live intelligence features
- 📬 **Gmail Integration** *(optional)* — connect your inbox to analyze real emails without manual copy-paste; requires the Node.js backend server

---

## Sectors & Compliance

| Sector | Compliance Frameworks | Key Threats Detected |
|--------|-----------------------|----------------------|
| 🏥 **Healthcare** | HIPAA §164.308 / §164.312 | EHR spoofing, PHI exfiltration, Medicare fraud, ransomware delivery |
| 🏦 **Finance** | PCI-DSS v4 / SOX / GLBA | Wire fraud, bank credential phishing, IRS impersonation, BEC |
| 🏛 **Government** | FISMA / NIST SP 800-53 / CMMC 2.0 | Security clearance phishing, FEMA fraud, Login.gov spoofing |
| 🎓 **Education** | FERPA / CIPA / COPPA | LMS credential theft, FAFSA fraud, student loan scams |
| 🏢 **Enterprise** | ISO 27001 / SOC 2 / NIST CSF 2.0 | IT helpdesk phishing, DocuSign spoofing, CEO impersonation |

---

## Features

### 📧 Email Phishing Analyzer
Paste any suspicious email and get an instant threat assessment:

- **Domain spoofing detection** — catches impersonation of EPIC, Chase, Canvas, Login.gov, Microsoft 365, and 40+ sector-specific platforms
- **Reply-To mismatch detection** — identifies emails that silently redirect replies to attacker-controlled domains
- **Sector keyword scanning** — flags PHI, financial data, government identifiers, and academic record references
- **Business Email Compromise (BEC)** — detects executive impersonation and wire transfer fraud language
- **Social engineering detection** — surfaces urgency and pressure tactics used to bypass rational judgment
- **Malicious attachment indicators** — warns on references to `.exe`, `.vbs`, `.docm`, `.ps1`, and other high-risk file types
- **Embedded URL analysis** — extracts and evaluates every link in the email body
- **Risk score (0–100)** — quantified verdict: `LIKELY SAFE` · `SUSPICIOUS` · `PHISHING / MALICIOUS`
- **Compliance citations** — each finding references the specific HIPAA, PCI-DSS, FISMA, FERPA, or ISO control at risk

### 🔗 URL / Web Traffic Checker
Analyze any URL before visiting:

- **Protocol check** — flags unencrypted HTTP connections
- **Raw IP detection** — no legitimate healthcare, banking, or government site uses a raw IP address
- **High-risk TLD detection** — covers `.tk`, `.ml`, `.ga`, `.xyz`, `.top`, `.pw`, and 8+ other abused domains
- **Sector spoof detection** — typosquatting patterns for sector-specific platforms
- **Safe domain verification** — cross-references against a curated list of legitimate sector domains
- **Suspicious path analysis** — detects `/login`, `/verify`, `/reset` patterns on unverified domains
- **Subdomain depth check** — catches obfuscation like `login.epic.verify.malicious.tk`
- **URL length anomaly** — flags unusually long URLs used to hide malicious parameters

### 🌐 Live Threat Intelligence
After each URL scan, PhishGuard Pro queries multiple external threat databases in parallel:

| Source | Key Required | What It Checks |
|--------|-------------|----------------|
| **URLScan.io** | No | Historical domain scans and malicious verdicts |
| **PhishTank** | Free key | Known phishing URL database |
| **AbuseIPDB** | Free key | IP address abuse reports (IP targets only) |
| **🤖 AI Classification** | Anthropic key | Claude-powered verdict with reasoning |

The AI Classification feature uses **Claude Haiku** to reason about URL structure and return a `MALICIOUS` / `SUSPICIOUS` / `SAFE` verdict with a confidence level and plain-English explanation — catching novel attacks not yet in any signature database.

All API keys are stored in your browser's `localStorage` only and are never logged or shared.

> **How API keys work for visitors:** Each user enters their own API keys — PhishTank, AbuseIPDB, and Anthropic. Keys are saved in their own browser and never sent to anyone else. This means every user brings their own credentials, so there are no shared costs and no risk of your keys being used by others. Anthropic keys are free to create at [console.anthropic.com](https://console.anthropic.com/) and cost fractions of a cent per scan — set a monthly budget limit to keep spend in check.

### 📋 Compliance Framework Tab
- Dynamically renders the full compliance framework for the active sector
- Maps each control to its relevant threat category with risk severity ratings
- Displays the sector-specific threat landscape

### 📊 Dashboard
- Aggregate scan statistics across all 5 sectors
- Per-sector scan activity and detection rate
- Top threat indicators detected across all sessions

---

## How It Works

PhishGuard Pro uses a **rule-based pattern matching engine** written in vanilla JavaScript. All processing happens locally in the browser — no server, no API calls required for the core analysis.

### Email Analysis Pipeline
1. Parse sender domain, reply-to, subject, and body
2. Run sector-specific spoof domain patterns
3. Score keyword matches (PHI, financial terms, urgency language, attachment types)
4. Extract and evaluate embedded URLs
5. Map each finding to the active sector's compliance framework
6. Produce a 0–100 risk score and tagged verdict

### URL Analysis Pipeline
1. Parse protocol, host, TLD, path, and query string
2. Check raw IP, high-risk TLD, and subdomain depth
3. Cross-reference sector spoof patterns and legitimate domain list
4. Scan path for credential-harvesting keywords
5. Query live threat intelligence sources asynchronously
6. Combine static score with live intel for final verdict

---

## Getting Started

### Option 1 — Live site (no install)
Visit **[mtewari1981.github.io/phishguard-pro](https://mtewari1981.github.io/phishguard-pro/)** directly in any browser.

### Option 2 — Run locally (standalone, no server needed)
```bash
git clone https://github.com/mtewari1981/phishguard-pro.git
cd phishguard-pro
open index.html   # or double-click the file
```
No build step, no `npm install`, no dependencies. Email Analyzer, URL Checker, Compliance, and Dashboard tabs all work.

### Option 3 — Run with Gmail Integration (requires Node.js)
```bash
git clone https://github.com/mtewari1981/phishguard-pro.git
cd phishguard-pro
npm install
cp .env.example .env   # fill in your Google OAuth credentials
node server.js
```
Then open `http://localhost:3000`. See the [Gmail Integration](#gmail-integration) section for setup details.

### Optional API Keys (for live threat intelligence)
Enter keys in the **⚙️ Live API Keys** panel on the URL Checker tab:

| Key | Where to get it | Cost |
|-----|----------------|------|
| PhishTank App Key | [phishtank.com/api_register.php](https://www.phishtank.com/api_register.php) | Free |
| AbuseIPDB API Key | [abuseipdb.com/register](https://www.abuseipdb.com/register) | Free |
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com/) | Pay-per-use (fractions of a cent per scan) |

---

## Gmail Integration

> **This is where PhishGuard Pro gets serious.**

Most phishing detection tools make you do the work — copy the sender, paste the body, manually extract the headers. PhishGuard Pro's **Gmail Integration** eliminates all of that. Connect your inbox once and analyze any real email for phishing threats in a single click.

But the real game-changer is the **AI layer**. After the rule-based engine scores an email, you can hit **AI Analyze** to send it to **Claude** — Anthropic's state-of-the-art AI model — for a second-opinion verdict. Claude reasons about the email the way a seasoned security analyst would: examining sender patterns, social engineering language, URL structure, and urgency tactics that static rules can miss. It returns a verdict (`SAFE`, `SUSPICIOUS`, `HIGH_RISK`, or `MALICIOUS`), a confidence level, a plain-English explanation of exactly what looks wrong, and a recommended action.

**Two layers of protection. Rule-based speed. AI-powered depth.**

- The **phishing engine** catches known patterns — spoofed domains, Reply-To mismatches, BEC language, malicious attachments — in milliseconds
- **Claude AI** catches what rules can't — novel phrasing, subtle social engineering, zero-day attack patterns not yet in any signature database
- Together, they give you the kind of coverage that enterprise security teams pay thousands for — free, running on your own machine

Powered by a Node.js/Express backend with Google OAuth 2.0.

### What Gmail access is used and why

| Scope | What it allows | Why it's needed |
|---|---|---|
| `https://www.googleapis.com/auth/gmail.readonly` | Read emails and inbox metadata | Fetch message headers, body, and attachment names for analysis |
| `https://www.googleapis.com/auth/userinfo.email` | Read your Google account email address | Display which account is connected |

PhishGuard Pro requests **the minimum possible scopes**. It cannot send, delete, label, or modify any emails or settings.

> **Note on test users:** While your Google OAuth app is in Testing mode, up to **100 email addresses** can connect. Add test users in Google Cloud Console under **OAuth consent screen → Test users**. To allow anyone to connect, publish the app and complete Google's verification process.

### Privacy guarantees

- Email content is **never stored** — fetched on demand, analyzed in memory, discarded
- OAuth tokens are stored in a **server-side session only** — never in the browser or any file
- Email content is **not sent to any AI** unless you explicitly click the "AI Analyze" button
- The server runs locally on your machine; nothing leaves your network except OAuth and optional AI calls

---

### Step 1 — Create a Google Cloud OAuth app

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project
2. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
3. Set Application type to **Web application**
4. Add an Authorized Redirect URI: `http://localhost:3000/auth/google/callback`
5. Copy your **Client ID** and **Client Secret**

### Step 2 — Enable the Gmail API

1. In Cloud Console, go to **APIs & Services → Library**
2. Search for **Gmail API** and click **Enable**

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
SESSION_SECRET=some-long-random-string-change-this

# Optional — enables the "AI Analyze" button
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 4 — Run locally

```bash
npm install
node server.js
```

Then open `http://localhost:3000` in your browser and click the **Gmail Integration** tab.

> **Note:** The existing standalone `index.html` still works without the server for the Email Analyzer, URL Checker, and Compliance tabs. The Gmail tab requires the server.

### Risk score levels

| Level | Score | Meaning |
|---|---|---|
| SAFE | 0–19 | No threats detected |
| SUSPICIOUS | 20–44 | Some indicators — verify before acting |
| HIGH RISK | 45–69 | Multiple strong indicators — do not click links |
| MALICIOUS | 70–100 | Confirmed phishing or malware — report and delete |

---

## Use Cases

- **Security awareness training** — use the built-in email samples to train employees on real attack patterns
- **SOC triage** — rapid first-pass verdict on suspicious URLs and emails before deeper investigation
- **Compliance audits** — demonstrate phishing detection coverage mapped to HIPAA, PCI-DSS, FISMA, and other frameworks
- **Incident response** — quickly assess whether a reported email or link is malicious
- **Education** — interactive platform for teaching phishing recognition by sector

---

## Limitations

- **No file/attachment scanning** — only references to attachment types in email text are flagged; actual files are not analyzed
- **Static domain lists** — legitimate and spoof domain lists are curated manually and may not cover every case
- **CORS restrictions** — some live threat APIs (AbuseIPDB) are designed for server-side use and may be blocked by browser CORS policies
- **AI classification cost** — the Anthropic API is pay-per-use; use a budget limit in the Anthropic Console to control spend

---

## Contributing

Pull requests are welcome. To contribute:

1. Fork the repo
2. Make your changes — `index.html` for the frontend, `server.js` / `phish-engine.js` for the backend
3. Open a pull request describing what you changed and why

Please keep contributions focused — no additional build tools or frontend frameworks.

---

## License

MIT License — free to use, modify, and distribute with attribution.

---

*Built for security-aware teams in regulated industries. Not a substitute for enterprise security tooling.*
