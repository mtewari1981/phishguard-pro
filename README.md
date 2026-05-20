# 🛡️ PhishGuard Pro

### Multi-Sector Phishing Detection Platform

![Version](https://img.shields.io/badge/version-3.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Sectors](https://img.shields.io/badge/sectors-5-orange?style=flat-square)
![Frameworks](https://img.shields.io/badge/compliance%20frameworks-13-purple?style=flat-square)
![No Dependencies](https://img.shields.io/badge/dependencies-none-lightgrey?style=flat-square)

A **free, open-source, browser-based** cybersecurity platform for detecting phishing threats across Healthcare, Finance, Government, Education, and Enterprise — with real-time compliance mapping to 13 federal and international security frameworks.

🌐 **Live Site:** [https://mtewari1981.github.io/phishguard-pro/](https://mtewari1981.github.io/phishguard-pro/)

> **Origin:** PhishGuard Pro evolved from [CyberShield Healthcare Security Suite](https://github.com/mtewari1981/CyberShield-Healthcare-Security-Suite), a sector-specific tool for healthcare phishing detection. This platform expands that work to cover all critical infrastructure sectors.

---

## Table of Contents

- [Overview](#overview)
- [Sectors & Compliance](#sectors--compliance)
- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Use Cases](#use-cases)
- [Detection Coverage](#detection-coverage)
- [Limitations & Roadmap](#limitations--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PhishGuard Pro is a client-side threat detection platform that analyzes suspicious emails and URLs for phishing, social engineering, malware delivery, and sector-targeted attacks.

**Key principles:**
- 🔒 **Privacy-first** — no data ever leaves the browser, no backend, no tracking
- ⚡ **Zero setup** — open `index.html` in any browser and it works
- 🏛 **Compliance-aware** — every threat finding maps to a specific regulatory control
- 🆓 **Completely free** — no paywalls, no registration, no API keys required

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

### 📋 Compliance Framework Tab
- Dynamically renders the full compliance framework for the selected sector
- Maps each control to its relevant threat category
- Displays sector threat landscape with risk severity ratings
- Shows detection coverage statistics

### 📊 Dashboard
- Aggregate scan statistics across all 5 sectors
- Per-sector scan activity tracking
- Real-time threat indicator log
- Overall detection rate and sector activity summary

---

## How It Works

PhishGuard Pro uses a **rule-based pattern matching engine** written in vanilla JavaScript. All processing happens locally in the browser.

### Email Analysis Pipeline

```
Input: sender · reply-to · subject · body
              │
              ▼
  ┌───────────────────────────────┐
  │ 1. Domain spoofing check      │  regex per sector
  │ 2. TLD risk assessment        │  14 high-risk TLDs
  │ 3. Reply-To mismatch          │  domain comparison
  │ 4. Sector keyword scan        │  80+ keywords
  │ 5. BEC pattern detection      │  executive + financial language
  │ 6. Urgency / pressure check   │  16 social engineering phrases
  │ 7. Attachment risk scan       │  10 dangerous file extensions
  │ 8. URL extraction + analysis  │  embedded link evaluation
  └───────────────────────────────┘
              │
         Risk Score
         (0 – 100)
              │
     ┌────────┴────────┐
     │     Verdict      │  SAFE · SUSPICIOUS · PHISHING
     └─────────────────┘
              │
    Compliance Control Mapping
```

### Risk Score Reference

| Score | Verdict | Action |
|-------|---------|--------|
| 0 – 24 | ✅ Likely Safe | Safe to proceed |
| 25 – 59 | ⚠️ Suspicious | Verify via official channel before acting |
| 60 – 100 | 🚨 Phishing / Malicious | Do not click — report to IT security |

---

## Getting Started

### Use it instantly (no install)
```bash
git clone https://github.com/mtewari1981/phishguard-pro.git
cd phishguard-pro
# Then open index.html in your browser
```

**Windows:**
```
start index.html
```
**macOS:**
```
open index.html
```
**Linux:**
```
xdg-open index.html
```

### Optional: serve over local network
```bash
python -m http.server 8080
# Visit: http://localhost:8080
```

### Deploy for free
| Platform | Steps |
|----------|-------|
| **GitHub Pages** | Enable in repo Settings → Pages → Branch: main / root |
| **Netlify** | Drag and drop the project folder |
| **Vercel** | Connect GitHub repo — auto-deploys on push |

---

## Use Cases

| Who | How |
|-----|-----|
| Hospital IT security team | Triage suspicious emails before forwarding to clinical staff |
| Bank security operations | Screen reported phishing emails from employees |
| Federal agency ISSO | Document phishing detection controls for FISMA authorization |
| University IT department | Run interactive phishing training with pre-loaded scenarios |
| Corporate security team | Detect BEC and vendor impersonation during SOC 2 audits |
| Compliance officer | Generate evidence of detection controls for regulatory audits |
| Security awareness trainer | Load realistic scenarios for staff training sessions |

---

## Detection Coverage

| Category | Coverage |
|----------|----------|
| Compliance frameworks mapped | 13 (HIPAA, PCI-DSS v4, SOX, GLBA, FISMA, NIST SP 800-53, CMMC 2.0, FERPA, CIPA, COPPA, ISO 27001, SOC 2, NIST CSF 2.0) |
| Sectors covered | 5 |
| Sector domain spoof patterns | 40+ regex patterns |
| Sector-specific keywords | 80+ across all sectors |
| High-risk TLDs monitored | 14 |
| BEC / wire fraud indicators | 15 phrases |
| Social engineering phrases | 16 patterns |
| High-risk file extensions | 10 types |
| Pre-loaded sample scenarios | 24 (4–6 per sector) |

---

## Project Structure

```
phishguard-pro/
├── index.html       ← Complete self-contained application (~75KB)
└── README.md        ← This file
```

The entire platform is a single HTML file with no external dependencies beyond Google Fonts. This makes it fully auditable, trivially deployable, and functional entirely offline.

---

## Limitations & Roadmap

### Current Limitations
| Area | Detail |
|------|--------|
| Threat intelligence | Rules are static — no live feeds (VirusTotal, PhishTank, etc.) |
| Detection method | Pattern matching only — cannot detect novel zero-day phishing |
| Email headers | Does not parse raw MIME, DKIM, SPF, or DMARC records |
| Reporting | Client-side only — no centralized logging or export |
| Language | English-language detection only |

### Planned Features
- [ ] VirusTotal API integration for live URL reputation lookups
- [ ] PhishTank feed for known phishing domain matching
- [ ] DKIM / SPF / DMARC header analysis
- [ ] Export scan results to PDF or CSV
- [ ] Custom sector configuration (user-defined domains and keywords)
- [ ] REST API mode for SIEM and SOC tool integration
- [ ] Machine learning scoring layer (TensorFlow.js)
- [ ] Additional sectors: Legal, Insurance, Energy & Utilities

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes in `index.html`
4. Test in Chrome, Firefox, and Safari
5. Open a pull request with a clear description of what you changed and why

**Good first contributions:**
- Adding new sector-specific detection patterns or keywords
- Improving risk scoring accuracy
- Adding new pre-loaded phishing scenario samples
- UI or accessibility improvements
- Documentation fixes

---

## Acknowledgments

- Compliance references: [NIST](https://nist.gov) · [HHS OCR](https://hhs.gov/hipaa) · [PCI SSC](https://pcisecuritystandards.org) · [U.S. Dept. of Education](https://ed.gov)
- Threat data references: IBM Cost of a Data Breach Report · CISA Advisories · FBI IC3 Annual Report
- Built with vanilla HTML, CSS, and JavaScript — zero frameworks, zero dependencies

---

## License

```
MIT License — Copyright (c) 2026 PhishGuard Pro Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to deal in the Software without restriction, including the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

*PhishGuard Pro is an educational and awareness tool. It does not constitute legal or compliance advice.*
