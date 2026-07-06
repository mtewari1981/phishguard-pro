# Changelog

All notable changes to PhishGuard Pro are documented here.

---

## [2026-07-06] — Documentation Updates

### Updated — README
- Clarified API key model: each visitor brings their own PhishTank, AbuseIPDB, and Anthropic keys — stored in their own browser, never shared, no cost to the site owner
- Added note directing users to `console.anthropic.com` to get an Anthropic key and set a monthly budget limit
- Enhanced Gmail Integration section with stronger copy explaining the two-layer protection model (rule-based engine + Claude AI)

### Commits
| Commit | Branch | Description |
|--------|--------|-------------|
| `b0eff38` | main | Clarify API key model — each user brings their own keys |
| `5a2fbe4` | main | Enhance README with stronger Gmail + AI section copy |

---

## [2026-07-06] — Gmail Integration (v3.1)

### Added — Gmail Integration Tab
- New **📬 Gmail Integration** tab powered by a Node.js/Express backend with Google OAuth 2.0
- Users connect their Gmail inbox and analyze real emails for phishing threats in one click — no manual copy-paste of sender, recipient, or body required
- Fetches the 20 most recent inbox messages and displays them in a table (sender, subject, date, snippet)
- **Analyze** button runs the same phishing detection engine used by the standalone Email Analyzer
- Results include risk score, verdict, suspicious URLs, shortened URLs, findings, recommended action, and compliance mapping
- **AI Analyze** button (optional) sends email metadata to Claude Haiku for a second-opinion verdict with confidence level and plain-English explanation
- Gmail access is strictly read-only (`gmail.readonly`) — PhishGuard Pro cannot send, delete, label, or modify emails
- Email content is never stored — fetched on demand, analyzed in memory, discarded
- OAuth tokens stored in server-side session only, never in the browser or any file
- Supports up to 100 test users while OAuth app is in Google Testing mode

### Added — Node.js Backend (server.js)
- Express server with session management (`express-session`)
- Google OAuth 2.0 login/logout flow with redirect handling
- `/api/auth/status` — check if user is authenticated
- `/api/gmail/messages` — list recent inbox messages
- `/api/gmail/analyze` — run phishing analysis on a specific message
- `/api/gmail/ai-analyze` — optional Claude AI analysis on a specific message

### Added — Phishing Engine Module (phish-engine.js)
- Extracted core phishing detection logic into a standalone Node.js module
- Used by `server.js` to analyze Gmail messages server-side with the same rule-based engine as the browser frontend

### Added — Project Setup Files
- `package.json` — Node.js dependencies (express, express-session, googleapis, dotenv)
- `.env.example` — template for required environment variables (Google OAuth credentials, session secret, optional Anthropic API key)
- `.gitignore` — excludes `node_modules/`, `.env`, and log files from version control

### Updated — README
- Added Gmail Integration as an optional fifth key principle
- Added Option 3 (run with Gmail) to Getting Started
- Updated OAuth scope table to include `userinfo.email`
- Added test user limit note (100 users in Testing mode)
- Updated Contributing section to reference `server.js` and `phish-engine.js`

### Commits
| Commit | Branch | Description |
|--------|--------|-------------|
| `1ae1ac2` | main | Add Gmail Integration and Node.js backend (v3.1) |

---

## [2026-07-01] — AI Classification

### Added — AI URL Classification (Claude / Anthropic)
- New **🤖 AI Classification** source in the Live Threat Intelligence panel
- After scanning any URL, sends the URL structure (protocol, host, TLD, path) to Claude Haiku 4.5 via the Anthropic API for AI-powered phishing/malicious risk classification
- Returns a verdict of **MALICIOUS**, **SUSPICIOUS**, or **SAFE** with a one-sentence reason and confidence level (high / medium / low)
- Requires a personal Anthropic API key — enter it in the **⚙️ Live API Keys** panel (stored in browser localStorage only, never logged or shared)
- Shows **KEY REQUIRED** prompt with link to `console.anthropic.com` if no key is set

### Added — Anthropic Key Field in API Config Panel
- New **Anthropic API Key** input field added to the ⚙️ Live API Keys collapsible panel
- Key is saved and restored from localStorage alongside existing PhishTank and AbuseIPDB keys

### Commits
| Commit | Branch | Description |
|--------|--------|-------------|
| `1aba2f8` | main | Add AI classification to URL threat intelligence |

---

## [2026-06-30] — Live Intelligence & Theme

### Added — Live Threat Intelligence Panel
- New **🌐 Live Threat Intelligence** card in the URL / Web Traffic Checker tab
- After analyzing any URL, automatically queries three external threat databases:
  - **URLScan.io** — searches existing scans for the domain (no API key needed). If browser CORS blocks the call, shows a clickable **Search URLScan.io manually ↗** link as fallback
  - **PhishTank** — checks if the URL is in the phishing database (free key required at phishtank.com)
  - **AbuseIPDB** — checks raw IP addresses for abuse reports (free key required at abuseipdb.com). Shows N/A for domain-based URLs

### Added — API Key Config Panel
- Collapsible **⚙️ Live API Keys** section inside the URL input card
- Paste PhishTank and AbuseIPDB keys directly on the site — no source code editing needed
- Keys are saved in browser localStorage and never sent anywhere except the respective API

### Added — Light / Dark Theme Toggle
- **☀️ Light / 🌙 Dark** toggle button in the top-right header
- Switches the entire site between a dark navy theme and a clean white theme
- Theme preference is saved in localStorage and restored on every visit

### Commits
| Commit | Branch | Description |
|--------|--------|-------------|
| `4cca360` | master | Add live threat intelligence to URL analyzer |
| `b3be75d` | master | Add light/dark theme toggle |
| `679bc5a` | main | Sync both features to main (GitHub Pages branch) |
| `c5d42bf` | main | Fix URLScan.io CORS — show manual search link as fallback |
| `66438b0` | master | Sync URLScan.io fix back to master |
| `41d132f` | main | Add CHANGELOG.md |

---

## [2026-05-20] — Initial Release (v3.0)

First public deployment of PhishGuard Pro to GitHub Pages. Evolved from
CyberShield Healthcare Security Suite, expanded to cover all 5 U.S. critical
infrastructure sectors. Entire platform is a single self-contained `index.html`
file (~75KB) with no external dependencies beyond Google Fonts.

### Core Architecture
- 100% client-side — all processing happens in the browser, no backend, no tracking
- Zero setup — open `index.html` in any browser and it works offline
- Single-file application — fully auditable, trivially deployable
- Rule-based pattern matching engine written in vanilla JavaScript

### Sectors Supported
| Sector | Compliance Framework |
|--------|----------------------|
| 🏥 Healthcare | HIPAA §164.308 / §164.312 |
| 🏦 Finance | PCI-DSS v4 / SOX / GLBA |
| 🏛 Government | FISMA / NIST SP 800-53 / CMMC 2.0 |
| 🎓 Education | FERPA / CIPA / COPPA |
| 🏢 Enterprise | ISO 27001 / SOC 2 / NIST CSF 2.0 |

### 📧 Email Phishing Analyzer
- Domain spoofing detection — catches impersonation of EPIC, Chase, Canvas, Login.gov, Microsoft 365, and 40+ sector-specific platforms
- Reply-To mismatch detection — identifies emails that silently redirect replies to attacker-controlled domains
- Sector keyword scanning — flags PHI, financial data, government identifiers, and academic record references (80+ keywords)
- Business Email Compromise (BEC) detection — executive impersonation and wire transfer fraud language (15 phrases)
- Social engineering detection — urgency and pressure tactics (16 patterns)
- Malicious attachment indicators — warns on `.exe`, `.vbs`, `.docm`, `.ps1`, and other high-risk file types (10 types)
- Embedded URL extraction and analysis — evaluates every link found in the email body
- Risk score 0–100 with three verdicts: `LIKELY SAFE` · `SUSPICIOUS` · `PHISHING / MALICIOUS`
- Compliance citations — each finding references the specific regulatory control at risk
- 24 pre-loaded phishing scenario samples (4–6 per sector) for training and testing

### 🔗 URL / Web Traffic Checker
- Protocol check — flags unencrypted HTTP connections
- Raw IP detection — flags URLs using raw IP addresses instead of domain names
- High-risk TLD detection — covers `.tk`, `.ml`, `.ga`, `.xyz`, `.top`, `.pw`, and 8+ other abused TLDs (14 total)
- Sector domain spoof detection — typosquatting patterns for 40+ sector-specific platforms
- Safe domain verification — cross-references against curated list of legitimate sector domains
- Suspicious path analysis — detects `/login`, `/verify`, `/reset` patterns on unverified domains
- Subdomain depth check — catches obfuscation like `login.epic.verify.malicious.tk`
- URL length anomaly detection — flags unusually long URLs used to hide malicious parameters
- Scan history — last 8 URLs checked, with verdict and sector
- URL context selector — note where the URL was encountered (email, browser, SMS, document, QR code)

### 📋 Compliance Framework Tab
- Dynamically renders the full compliance framework for the active sector
- Maps each regulatory control to its relevant threat category
- Displays sector threat landscape with risk severity ratings (CRITICAL / HIGH / MEDIUM)
- Shows detection coverage statistics per sector

### 📊 Dashboard
- Aggregate scan statistics across all 5 sectors
- Per-sector scan activity tracking
- Real-time threat indicator log
- Overall detection rate and sector activity summary

### Detection Coverage at Launch
| Category | Count |
|----------|-------|
| Compliance frameworks mapped | 13 |
| Sectors covered | 5 |
| Sector domain spoof patterns | 40+ regex patterns |
| Sector-specific keywords | 80+ |
| High-risk TLDs monitored | 14 |
| BEC / wire fraud indicators | 15 phrases |
| Social engineering phrases | 16 patterns |
| High-risk file extensions | 10 types |
| Pre-loaded sample scenarios | 24 |

### Known Limitations at Launch
- Threat intelligence was static — no live feeds (added 2026-06-30)
- Pattern matching only — cannot detect novel zero-day phishing
- Does not parse raw MIME, DKIM, SPF, or DMARC email headers
- Client-side only — no centralized logging or export
- English-language detection only

---

## Roadmap — Planned Next-Level Additions

Ideas for future development sessions, in rough priority order:

| # | Feature | Description |
|---|---------|-------------|
| 1 | **VirusTotal API integration** | Live URL reputation lookups against 70+ antivirus engines |
| 2 | **Gmail Integration** ✅ | Connect Gmail inbox for one-click email analysis — shipped 2026-07-06 |
| 3 | **DKIM / SPF / DMARC analysis** | Parse raw email headers to verify sender authentication |
| 3 | **Export scan results** | Download results as PDF or CSV for reporting and compliance evidence |
| 4 | **Custom sector configuration** | Let users define their own domains, keywords, and spoof patterns |
| 5 | **Dark mode refinements** | Polish the light/dark theme based on real-world usage feedback |
| 6 | **Machine learning scoring** | Add a TensorFlow.js scoring layer on top of the rule-based engine |
| 7 | **Additional sectors** | Legal, Insurance, Energy & Utilities |
| 8 | **REST API mode** | Expose detection engine as an API for SIEM and SOC tool integration |
