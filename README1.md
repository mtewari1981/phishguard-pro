# 🛡️ PhishGuard Pro

### Multi-Sector Phishing Detection Platform

![Version](https://img.shields.io/badge/version-3.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Sectors](https://img.shields.io/badge/sectors-5-orange?style=flat-square)
![Frameworks](https://img.shields.io/badge/compliance%20frameworks-13-purple?style=flat-square)
![No Dependencies](https://img.shields.io/badge/dependencies-none-lightgrey?style=flat-square)

An **, open-source, browser-based** cybersecurity platform for detecting phishing threats across Healthcare, Finance, Government, Education, and Enterprise — with real-time compliance mapping to 13 federal and international security frameworks.

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
- 🆓 **ready to use** —  no registration, no API keys required

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
