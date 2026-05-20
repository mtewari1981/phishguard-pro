# 🛡️ PhishGuard Pro — Multi-Sector Phishing Detection Platform

![Version](https://img.shields.io/badge/version-3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Sectors](https://img.shields.io/badge/sectors-5-orange)
![Frameworks](https://img.shields.io/badge/compliance%20frameworks-7-purple)

> A free, open-source, browser-based cybersecurity tool for detecting phishing threats across **Healthcare, Finance, Government, Education, and Enterprise** sectors — with built-in compliance mapping to HIPAA, PCI-DSS, FISMA, FERPA, ISO 27001, SOC 2, and NIST CSF.

---

## 🌐 Live Site

**[https://mtewari1981.github.io/CyberShield-Healthcare-Security-Suite/](https://mtewari1981.github.io/CyberShield-Healthcare-Security-Suite/)**

---

## 🌐 Live Demo

**Hosted on GitHub Pages:** [https://mtewari1981.github.io/CyberShield-Healthcare-Security-Suite/](https://mtewari1981.github.io/CyberShield-Healthcare-Security-Suite/)

Or open `index.html` locally in any modern browser. No server, no installation, no dependencies.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Sectors Covered](#sectors-covered)
- [Features](#features)
- [Compliance Frameworks](#compliance-frameworks)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Use Cases](#use-cases)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PhishGuard Pro is a **client-side threat detection platform** that analyzes emails and URLs for phishing, social engineering, malware delivery, and sector-specific attacks. It requires no backend, no API keys, and no data ever leaves the user's browser.

It was designed for:
- **Security awareness training** across multiple industries
- **IT security teams** needing a quick triage tool
- **Compliance officers** documenting threat detection coverage
- **Researchers and educators** demonstrating phishing tactics
- **NIW/national interest cybersecurity projects** demonstrating broad societal value

---

## Sectors Covered

| Sector | Icon | Compliance | Key Threats Detected |
|--------|------|------------|----------------------|
| Healthcare | 🏥 | HIPAA §164.308 / §164.312 | EHR spoofing, PHI theft, Medicare fraud, ransomware |
| Finance | 🏦 | PCI-DSS v4 / SOX / GLBA | Wire fraud, bank phishing, IRS scams, BEC |
| Government | 🏛 | FISMA / NIST SP 800-53 / CMMC | Clearance phishing, FEMA fraud, agency impersonation |
| Education | 🎓 | FERPA / CIPA / COPPA | LMS spoofing, FAFSA fraud, student loan scams |
| Enterprise | 🏢 | ISO 27001 / SOC 2 / NIST CSF | IT helpdesk phishing, DocuSign spoofing, CEO fraud |

---

## Features

### 📧 Email Phishing Analyzer
- **Sender domain spoofing detection** — identifies domains impersonating sector-specific platforms (EPIC, Chase, Canvas, Login.gov, Microsoft 365, etc.)
- **Reply-To mismatch detection** — catches emails that redirect replies to attacker-controlled domains
- **Sector-specific keyword analysis** — scans for PHI, PII, financial, government, and academic data references
- **Business Email Compromise (BEC) detection** — identifies wire fraud and executive impersonation patterns
- **Social engineering / urgency detection** — flags pressure tactics designed to bypass rational decision-making
- **Malicious attachment indicators** — detects references to high-risk file types (`.exe`, `.vbs`, `.docm`, etc.)
- **Embedded URL analysis** — extracts and evaluates all links within email bodies
- **Risk scoring (0–100)** — quantified threat score with verdict: `LIKELY SAFE`, `SUSPICIOUS`, or `PHISHING / MALICIOUS`
- **HIPAA/PCI/FISMA/FERPA/ISO compliance citations** — each finding maps to a specific regulatory control

### 🔗 URL / Web Traffic Checker
- **Protocol analysis** — flags unencrypted HTTP connections
- **Raw IP address detection** — identifies IP-based malicious hosts
- **High-risk TLD detection** — `.tk`, `.ml`, `.ga`, `.xyz`, `.top`, and 10+ other abused extensions
- **Sector domain spoofing** — checks for typosquatting of sector-specific platforms
- **Legitimate domain verification** — cross-references against a vetted safe domain list
- **Suspicious path keyword analysis** — detects credential-harvesting URL patterns
- **Subdomain depth analysis** — catches obfuscation via excessive subdomain nesting
- **URL length anomaly detection** — flags unusually long URLs used to hide malicious parameters

### 📋 Compliance Framework Tab
- Dynamically renders the active sector's full compliance framework
- Maps each control to its phishing/threat relevance
- Shows threat landscape with risk level ratings
- Displays detection coverage statistics (keyword count, pattern count)

### 📊 Dashboard
- Aggregate scan statistics across all sectors
- Per-sector scan counts and activity tracking
- Real-time threat indicator log
- Overall detection rate calculation
- Active sector counter

### 🎭 Sample Scenarios
- **24 pre-loaded phishing scenarios** (4–6 per sector)
- Realistic email content modeled on actual attack campaigns
- Covers: credential phishing, BEC, ransomware, government fraud, student aid scams, IT helpdesk attacks

---

## Compliance Frameworks

| Framework | Sector | Coverage |
|-----------|--------|----------|
| **HIPAA** (§164.308 / §164.310 / §164.312) | Healthcare | Administrative, Physical, Technical Safeguards |
| **PCI-DSS v4** | Finance | Requirements 5, 7, 8, 12 |
| **SOX** (Sarbanes-Oxley) | Finance | Sections 302, 404, 802 |
| **GLBA** (Gramm-Leach-Bliley) | Finance | Safeguards Rule, Privacy Rule |
| **FISMA** | Government | RMF, ConMon, Incident Response |
| **NIST SP 800-53** | Government | AC-2, AT-2, IR-4, SI-3 |
| **CMMC 2.0** | Government | AC.1.001, AT.2.056, IR.2.092 |
| **FERPA** | Education | Student record access, third-party sharing |
| **CIPA** | Education | Technology protection, internet safety |
| **COPPA** | Education | Minor data collection, parental consent |
| **ISO 27001** | Enterprise | A.6.1.1, A.7.2.2, A.12.6.1, A.16.1 |
| **SOC 2** | Enterprise | CC6.1, CC6.7, CC7.2 |
| **NIST CSF 2.0** | Enterprise | Identify, Protect, Detect, Respond |

---

## How It Works

PhishGuard Pro uses a **rule-based pattern matching engine** written in vanilla JavaScript. All analysis runs entirely in the browser.

### Email Analysis Pipeline

```
Input (sender, reply-to, subject, body)
        │
        ▼
┌─────────────────────────────────┐
│  1. Domain Spoofing Check       │  ← Regex patterns per sector
│  2. TLD Risk Assessment         │  ← High-risk TLD list
│  3. Reply-To Mismatch           │  ← Domain comparison
│  4. Sector Keyword Scan         │  ← PHI / financial / gov / edu keywords
│  5. BEC Pattern Detection       │  ← Executive + financial language
│  6. Urgency / Social Eng. Check │  ← Pressure phrase detection
│  7. Attachment Risk Scan        │  ← Dangerous file extension regex
│  8. URL Extraction + Analysis   │  ← Embedded link evaluation
└─────────────────────────────────┘
        │
        ▼
   Risk Score (0–100)
        │
   ┌────┴─────┐
   │  Verdict  │  → SAFE / SUSPICIOUS / PHISHING
   └──────────┘
        │
   Compliance Mapping
   (HIPAA / PCI / FISMA / FERPA / ISO)
```

### URL Analysis Pipeline

```
Input URL
    │
    ▼
Parse → Protocol → Host Type → TLD Risk
                                   │
                              Sector Spoof Check
                                   │
                              Legitimate Domain Check
                                   │
                              Path Keyword Analysis
                                   │
                              Subdomain Depth Check
                                   │
                              Risk Score (0–100)
```

### Risk Scoring

| Score Range | Verdict | Recommended Action |
|-------------|---------|-------------------|
| 0 – 24 | ✅ Likely Safe | Safe to proceed |
| 25 – 59 | ⚠️ Suspicious | Verify via official channel before acting |
| 60 – 100 | 🚨 Phishing / Malicious | Do not click, report to IT security |

---

## Getting Started

### Option 1 — Just open it
```bash
# Clone the repository
git clone https://github.com/mtewari1981/CyberShield-Healthcare-Security-Suite.git

# Open in browser
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

### Option 2 — Serve locally
```bash
# Using Python (optional, for serving over local network)
cd phishguard-pro
python -m http.server 8080
# Then visit: http://localhost:8080
```

### Option 3 — Host for free
Deploy instantly with no configuration on:
- **GitHub Pages** — push to `gh-pages` branch or enable in repo Settings
- **Netlify** — drag and drop the folder
- **Vercel** — connect GitHub repo

---

## Use Cases

| User | How They Use It |
|------|----------------|
| **Hospital IT Security Team** | Screen suspicious emails before forwarding to clinical staff |
| **Bank Security Operations** | Triage reported phishing emails from employees |
| **Federal Agency ISSO** | Demonstrate phishing detection in FISMA documentation |
| **University IT Department** | Train students and faculty on phishing recognition |
| **Corporate Security Team** | BEC and vendor impersonation detection during SOC 2 audits |
| **Security Awareness Trainer** | Load sample scenarios for interactive phishing training sessions |
| **Compliance Officer** | Generate evidence of phishing detection controls for audits |

---

## Project Structure

```
phishguard-pro/
│
├── index.html          # Complete application (self-contained)
└── README.md           # This file
```

The entire application is a **single HTML file** (~75KB) with no external dependencies beyond Google Fonts. This makes it:
- Easy to audit
- Simple to deploy
- Trivial to share
- Functional entirely offline

---

## Detection Coverage Summary

| Category | Patterns / Rules |
|----------|-----------------|
| Sector domain spoof patterns | 40+ regex patterns |
| High-risk TLDs monitored | 14 TLDs |
| Sector-specific keywords | 80+ keywords across 5 sectors |
| BEC / wire fraud indicators | 15 phrases |
| Urgency / social engineering phrases | 16 patterns |
| High-risk file extensions | 10 types |
| Compliance frameworks mapped | 13 frameworks |
| Pre-loaded sample scenarios | 24 scenarios |

---

## Limitations

PhishGuard Pro is a **rule-based** tool. It is designed for education, awareness, and triage — not as a replacement for enterprise-grade email security.

| Limitation | Notes |
|------------|-------|
| No live threat intelligence feeds | Rules are static; does not connect to VirusTotal, PhishTank, etc. |
| No machine learning | Pattern matching only; cannot detect novel phishing techniques |
| No email header parsing | Does not parse raw MIME headers or DKIM/SPF/DMARC records |
| Client-side only | No scan logging or centralized reporting |
| English-language only | Non-English phishing content may not be scored accurately |

Future versions may address these through API integrations and an optional backend service.

---

## Roadmap

- [ ] VirusTotal API integration for live URL reputation checks
- [ ] PhishTank feed integration
- [ ] DKIM / SPF / DMARC header analysis
- [ ] Export scan results to PDF or CSV
- [ ] Sector configuration customization (add custom domains/keywords)
- [ ] REST API mode for integration with SIEM tools
- [ ] Machine learning scoring layer (TensorFlow.js)
- [ ] Additional sectors: Legal, Insurance, Energy/Utilities

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes to `index.html`
4. Test across multiple browsers
5. Submit a pull request with a clear description

### Good contribution ideas
- Adding new sector patterns or keywords
- Improving detection accuracy
- Adding new sample phishing scenarios
- UI/UX improvements
- Bug fixes and performance improvements

---

## License

MIT License — free to use, modify, and distribute with attribution.

```
MIT License

Copyright (c) 2026 PhishGuard Pro Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## Acknowledgments

- Compliance framework references: NIST, HHS OCR, PCI Security Standards Council, U.S. Department of Education
- Threat landscape data: IBM Cost of a Data Breach Report 2023, CISA advisories, FBI IC3 reports
- Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies

---

*PhishGuard Pro is an educational and awareness tool. It does not constitute legal or compliance advice. Always consult a qualified cybersecurity professional for enterprise security decisions.*
