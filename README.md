# Selvamatha Transport | Official Web Platform

> **Premier Heavy Commercial Truck Logistics connecting Tamil Nadu & Kerala.**  
> Operating 15+ heavy haulers with 25+ years of highway experience. *Send anything, anywhere, anytime, on correct time.*

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](https://github.com/Shajan-7/SelvamathaTransport)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D%20%7C%20%E0%B4%AE%E0%B4%B2%E0%B4%AF%E0%B4%BE%E0%B4%B3%E0%B4%82-blue?style=for-the-badge)](https://github.com/Shajan-7/SelvamathaTransport)
[![Theme](https://img.shields.io/badge/Theme-Dark%20%26%20Light-gold?style=for-the-badge)](https://github.com/Shajan-7/SelvamathaTransport)

---

## 📖 About Selvamatha Transport

Founded in **1998** by **S. Xavier** and steered by Co-Founders **S. Innasimuthu & S. Micheal**, **Selvamatha Transport** is a premier freight and heavy commercial truck logistics provider based in Serndamaram (Tenkasi / Kadaiyanallur, Tamil Nadu). 

Operating a modern fleet of 15+ heavy commercial haulers and 35+ experienced highway crew members, the company provides daily regular cargo transit connecting all districts across **Tamil Nadu** and **Kerala**.

---

## ✨ Key Features

### 1. 🚛 Interactive Hero Showcase Gallery
- **Auto-Rotating Carousel**: Features 6 high-resolution slides:
  - Official Medallion Brand Emblem
  - Heavy Commercial Trucks (Lorries 1, 2, 3, and 4)
  - Full Brand Emblem & Typography
- **Smooth Navigation**: Cross-fading 3.5s auto-interval, interactive chevron navigation buttons, pill-expansion indicator dots, and automatic pause on mouse-hover or touch.
- **Uncompromised Display**: Custom `object-fit: contain` styling ensures the full truck chassis and wheels are 100% visible on all devices.

### 2. 🌐 Complete Trilingual Localization
- Instant one-click language switching without page reloads:
  - **English** (`en`)
  - **தமிழ் (Tamil)** (`ta`)
  - **മലയാളം (Malayalam)** (`ml`)
- **Typography & Script Stability**: Custom font stacks (`Noto Sans Tamil`, `Noto Sans Malayalam`, `Outfit`, `Inter`) with syllable-preserving word breaks (`word-break: keep-all;`) to prevent layout collapse.

### 3. 🌓 Executive Theme Switcher
- **Deep Navy Luxury Dark Mode** (Default, `#050D1A` / `#0A192F` with gold accents).
- **Executive Crisp Light Mode** with soft shadows and refined glassmorphic cards.
- Automatically persists user preference via `localStorage`.

### 4. ⚡ Instant WhatsApp Booking Desk
- Interactive pickup, delivery, cargo type, and tonnage selector.
- Automatically generates pre-formatted, encrypted booking messages routed directly to dispatch telephone line `+91 9487366449`.
- Submissions are captured gracefully without full page reload or security exceptions on local/file protocols.

### 5. 📊 Real-Time Visitor Telemetry & Google Sheets Analytics
- **Non-blocking Telemetry**: Captures visitor device type, city, region, country, IP carrier, browser, OS, screen resolution, viewport, and IST timestamp.
- **Silent Logging**: Dispatches directly to a secure Google Apps Script Web App connected to a live Google Sheet.
- **Zero Performance Penalty**: Uses `requestIdleCallback` and `sessionStorage` throttling (5-minute cooldown) to protect client performance.

### 6. 🔍 Search Engine Optimization (SEO) & Schema.org
- Fully configured `<title>`, `<meta description>`, and comprehensive search keyword tags.
- **Schema.org Structured Data** (`LogisticsService`) with local address, coordinates, founding date, founders, and `alternateName` aliases (`Selvamatha Lorry`, `Selvamatha Truck Booking`, `Ponkani Selvamatha`).
- **Social Graph Optimization**: OpenGraph metadata (`og:title`, `og:description`, `og:image`) for WhatsApp, LinkedIn, and Facebook preview cards.

---

## 📂 Repository Structure

```plaintext
SelvamathaTransport/
├── images/                           # Curated, production-ready image assets
│   ├── 4 lorry image with gap.png    # High-resolution fleet showcase & OpenGraph cover
│   ├── crest_round.png               # Official medallion crest (Favicon & Logo)
│   ├── Founder.png                   # S. Xavier (Founder photo)
│   ├── Logo with name.png            # Official brand emblem with typography
│   ├── lorry_1.png                   # Heavy commercial hauler slide 1
│   ├── lorry_2.png                   # Heavy commercial hauler slide 2
│   ├── lorry_3.png                   # Heavy commercial hauler slide 3
│   ├── lorry_4.png                   # Heavy commercial hauler slide 4
│   └── Two pillars.png               # S. Innasimuthu & S. Micheal (Co-Founders photo)
├── analytics.js                      # Non-blocking client telemetry collector
├── GOOGLE_SHEETS_INTEGRATION.md      # Documentation for Google Sheets telemetry connection
├── GOOGLE_SHEETS_SCRIPT.js           # Google Apps Script Web App source code
├── index.html                        # Semantic HTML5 application structure
├── main.js                           # UI logic, translations, slider & theme controller
├── README.md                         # Project documentation
└── styles.css                        # Modern CSS design system & responsive layout
```

---

## 🛠️ Technology Stack

- **Core**: Semantic HTML5, CSS3 Custom Properties (Variables), Modern Vanilla ES6+ JavaScript.
- **Motion & Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling engine & [GSAP](https://greensock.com/gsap/) ticker integration.
- **Typography**: Google Fonts (`Outfit`, `Inter`, `Noto Sans Tamil`, `Noto Sans Malayalam`).
- **Telemetry**: Google Apps Script (`doPost` / `doGet`) logging to Google Sheets.
- **Icons**: Handcrafted inline SVGs (zero external font-icon dependencies for ultra-fast load times).

---

## 🚀 Running Locally

Because this project is built with standard web technologies, no heavy build tools or bundlers are required.

### Option 1: Python Built-in Server (Recommended)
```bash
python -m http.server 8088
```
Then navigate to: `http://localhost:8088/index.html`

### Option 2: VS Code / IDE Live Server
Right-click `index.html` and select **Open with Live Server**.

---

## 📞 Contact & Head Office

- **Head Office**: Mr. S. Micheal, 165/F, Sakthi Complex, Main Road, Serndamaram – 627857, Tenkasi District, Tamil Nadu.
- **Dispatch Telephone Lines**:
  - `+91 9487366449` (Primary Dispatch Desk)
  - `+91 9442796261`
  - `+91 9487366447`
  - `+91 6374292340`
- **Official Email Addresses**:
  - `support@selvamathatransport.com`
  - `selvamatha96@gmail.com`
- **Hours of Operation**: 24 Hours • 7 Days Open

---

## 👨‍💻 Author & Engineering

Designed & Developed by **[M. Shajan](https://www.linkedin.com/in/shajanm/)**.
All rights reserved © 1998–2026 Selvamatha Transport.
