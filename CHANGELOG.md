# Changelog

All notable changes to PhishGuard Pro are documented here.

---

## [2026-07-09] — VirusTotal Integration

### Added — VirusTotal URL reputation lookup
- New **🦠 VirusTotal** row in the Live Threat Intelligence panel queries 70+ antivirus and threat intelligence engines for a consensus verdict on any scanned URL
- Verdict thresholds: 3+ engines flagging → **MALICIOUS** · 1–2 engines or 3+ suspicious → **SUSPICIOUS** · else → **CLEAN**
- Results show malicious / suspicious / clean engine counts with a direct link to the full VirusTotal report
- If the URL has never been submitted to VirusTotal, shows **NOT SCANNED** with a link to submit it

### Added — VirusTotal proxy endpoint in server.js
- New `GET /api/virustotal/url?url=...` endpoint proxies requests to the VirusTotal v3 API, bypassing browser CORS restrictions
- Accepts the API key from the `x-vt-key` request header (sent by the browser) or falls back to `VIRUSTOTAL_API_KEY` in `.env`
- When running standalone (no server), shows **BLOCKED** with a manual VirusTotal link as fallback

### Added — VirusTotal API key field
- New **VirusTotal API Key** input in the ⚙️ Live API Keys panel, saved and restored from localStorage
- Free key available at virustotal.com — no rate limit for individual lookups on the free tier
- Added `VIRUSTOTAL_API_KEY` to `.env.example` as an optional server-side alternative

---

## [2026-07-09] — Expanded URL Detection Engine

### Added — Global brand impersonation detection
- New `URL_BRAND_SPOOF` pattern list detects typosquatting and lookalike domains for 19 major brands regardless of active sector: PayPal, Microsoft, Google, Apple, Amazon, Netflix, Chase, Bank of America, Wells Fargo, IRS, DocuSign, DHL, FedEx, LinkedIn, Dropbox, Zoom, Stripe, Venmo, Coinbase
- Fires +45 risk and `credential` trigger — results show which brand is being impersonated

### Added — @ symbol URL deception detection
- Detects `https://google.com@evil.com` style URLs where browsers ignore everything before `@` and load `evil.com`
- Fires +40 risk and `credential` trigger

### Added — Punycode / homograph attack detection
- Detects `xn--` in the domain — internationalized lookalike domains (e.g. аpple.com with Cyrillic characters) that appear identical to real brands
- Fires +35 risk and `credential` trigger

### Added — Open redirect parameter detection
- Detects `?redirect=`, `?url=`, `?next=`, `?goto=`, `?return=`, `?redir=`, `?target=`, `?callback=`, `?dest=`, `?destination=` in query string
- Fires +20 risk and `transmission` trigger

### Added — Hyphen abuse detection
- Domains with 3+ hyphens (e.g. `secure-paypal-update-account.com`) flagged as suspicious
- Fires +15 risk

### Added — Percent-encoding obfuscation detection
- Detects `%`-encoded characters in the URL path used to hide keywords from security scanners
- Fires +15 risk

### Updated — Path keyword list expanded
- Added: `signin`, `sign-in`, `wallet`, `billing`, `invoice`, `payment`, `checkout`, `webscr`, `banking`, `validate`, `suspend`, `unlock`, `restricted`

### Updated — High-risk TLD list expanded
- Added 14 TLDs: `.icu`, `.vip`, `.cc`, `.bz`, `.ws`, `.zip`, `.mov`, `.buzz`, `.monster`, `.cyou`, `.fit`, `.bar`, `.cfd`, `.sbs`
- Total now 27 monitored TLDs (was 13)

---

## [2026-07-09] — Email Form Clear Button

### Added — Clear button on Email Phishing Analyzer
- New **✕ Clear** button next to the Analyze Email button clears all four input fields (Sender, Reply-To, Subject, Body) and resets the results panel to its empty state
- Does not affect Dashboard stats, scan history, compliance triggers, or any persisted localStorage state

---

## [2026-07-09] — Dashboard Persistence & Dynamic Compliance (v3.2)

### Added — Dashboard localStorage Persistence
- Dashboard state (scan counts, sector tallies, threat log, scan history) now survives page reloads via `localStorage`
- `saveState()` serializes all counters and history after every scan; `loadState()` restores them on startup
- State is keyed to `pgp_dashboard_state`; up to 50 email/URL history entries and 20 scan log entries are persisted
- **Last saved timestamp** displayed on the Dashboard card so users know when state was last written
- **🗑 Clear History** button wipes all persisted state and resets counters to zero (with confirmation prompt)

### Added — Recent Scan Activity card
- Dashboard card renamed from "Top Threat Indicators Detected" to **Recent Scan Activity**
- Previously only showed CRITICAL findings — now logs every scan regardless of severity (SAFE, SUSPICIOUS, PHISHING)
- Each entry shows scan type (email/URL), verdict badge, sender/URL truncated, sector, risk score, and time
- `scanLog` (up to 20 entries) is persisted in localStorage alongside the rest of the dashboard state

### Added — Dynamic Compliance Framework (Session Triggers)
- Compliance controls in the **📋 Compliance Framework** tab now show a live **TRIGGERED** status (amber highlight) when scan findings from the current session match the control's threat category
- Each sector maintains a `sessionTriggers` map keyed by threat type (`credential`, `awareness`, `transmission`, `bec`, `malware`, `incident`, `data`)
- `recordTrigger(key)` is called during email and URL analysis to mark which controls are relevant to real findings
- `renderCompliancePanel()` reads `sessionTriggers` to apply the `.cs-triggered` class and "TRIGGERED" label
- Trigger mapping covers 14 Gmail finding categories (Suspicious Sender Domain, Reply-To Mismatch, BEC indicators, Credential Harvesting, High-Risk Attachments, etc.)
- Session trigger state persists across reloads alongside the rest of the dashboard state

### Fixed — Browser cache serving stale JavaScript
- Added `Cache-Control: no-store` response header for all `.html` files in `server.js` static file middleware
- Prevents browsers from caching old versions of `index.html` after deployments; ensures users always run the latest JavaScript

### Commits
| Commit | Branch | Description |
|--------|--------|-------------|
| *(this release)* | main | Dashboard persistence, dynamic compliance triggers, cache fix |

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
