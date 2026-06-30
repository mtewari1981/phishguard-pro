# Changelog

All notable changes to PhishGuard Pro are documented here.

---

## [2026-06-30]

### Added — Live Threat Intelligence Panel
- New **🌐 Live Threat Intelligence** card in the URL / Web Traffic Checker tab
- After analyzing any URL, automatically queries three external threat databases:
  - **URLScan.io** — searches existing scans for the domain (no API key needed)
  - **PhishTank** — checks if the URL is in the phishing database (free key required at phishtank.com)
  - **AbuseIPDB** — checks raw IP addresses for abuse reports (free key required at abuseipdb.com)
- If browser CORS blocks URLScan.io, a clickable **Search URLScan.io manually ↗** link is shown as fallback

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

---

## [2026-05-20]

- Initial deployment of PhishGuard Pro to GitHub Pages
- Single-file app (`index.html`) with email and URL phishing analysis
- Multi-sector support: Healthcare, Finance, Government, Education, Enterprise
- Compliance framework panel (HIPAA, PCI-DSS, FISMA, FERPA, ISO 27001)
- Dashboard with scan statistics
