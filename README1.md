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

PhishGuard Pro is a client-side threat detection platform that analyzes suspicious emails and URLs for phishing, social engineering, malware delivery, and sector-targeted attacks. It uses live AI analysis to detect if a URL or domain or IP is malicious.

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

## Benefits
Generic tools (VirusTotal, URLScan.io, PhishTank) give you:
- A yes/no verdict on whether a URL/file is known-malicious
- Based on crowdsourced or historical database lookups
- No context about who is being targeted or why

---
PhishGuard Pro gives you:

1. Sector-specific detection
Generic tools don't know you work in Healthcare vs Finance vs Government. PhishGuard Pro switches its entire detection ruleset by sector — it knows EPIC/Cerner/MyChart spoof patterns for healthcare, Chase/PayPal/IRS spoofs for finance, login.gov/USAJobs/DoD spoofs for government. A raw IP hosting an .exe file means different things depending on your sector context.

2. Compliance mapping
Results tie directly to the frameworks your sector is regulated by — HIPAA §164.308/312, PCI-DSS v4 requirements, SOX sections, FISMA/NIST SP 800-53, FERPA, CMMC. A generic tool tells you "malicious." PhishGuard Pro tells you "this is a HIPAA Transmission Security violation."

3. Email + URL in one tool
Most tools do one or the other. PhishGuard Pro analyzes the full email (sender, reply-to, subject, body, embedded
links) and the URL together — which is how r

4. AI reasoning layer (new)
The Claude classification doesn't just match known-bad signatures — it reasons about why a URL looks suspicious based
on structure, which catches novel attacks no

5. No account, no data sent
Everything runs in your browser. Your emails and URLs aren't logged by a third party.

---
The gap it fills: It's purpose-built for secpliance teams in regulated industries whoneed more than "blocked/not blocked" — they need context, sector relevance, and an audit trail tied to their regulatory framework.
