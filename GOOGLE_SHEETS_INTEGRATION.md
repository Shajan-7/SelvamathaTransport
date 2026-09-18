# Google Sheets Visitor Telemetry Setup Guide

This guide walks you through setting up automated background logging of visitors from your website into a Google Sheet in less than 2 minutes.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new).
2. Rename the document to: **Selvamatha Transport - Web Visitors**.

---

### Step 2: Open Google Apps Script Editor
1. In the top navigation bar, click: **Extensions** > **Apps Script**.
2. An online code editor will open with a default `Code.gs` file.

---

### Step 3: Paste the Apps Script Code
1. Erase all code currently inside `Code.gs`.
2. Open the file [`GOOGLE_SHEETS_SCRIPT.js`](file:///c:/Users/shajan/Documents/Projects/Selvamatha%20Transport/SelvamathaTransport/GOOGLE_SHEETS_SCRIPT.js) in this project.
3. Copy all code from `GOOGLE_SHEETS_SCRIPT.js` and paste it into the Apps Script editor.
4. Press `Ctrl + S` (or click the disk icon) to save.

---

### Step 4: Deploy as a Web App
1. Click the blue **Deploy** button (top-right) and select **New deployment**.
2. Click the **Select type** gear icon on the left and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Selvamatha Analytics Collector`
   - **Execute as**: `Me (<your-google-email>)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must be set to "Anyone" so anonymous web visitors can submit telemetry without logging into Google).*
4. Click **Deploy**.
5. When prompted with "Authorization required":
   - Click **Authorize access**.
   - Choose your Google Account.
   - Click **Advanced** > **Go to Selvamatha Analytics Collector (unsafe)**.
   - Click **Allow**.
6. Copy the generated **Web app URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 5: Connect to `analytics.js`
1. Open [`analytics.js`](file:///c:/Users/shajan/Documents/Projects/Selvamatha%20Transport/SelvamathaTransport/analytics.js) in your website codebase.
2. Find the line:
   ```javascript
   const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_DEPLOYED_APP_SCRIPT_URL/exec';
   ```
3. Replace the placeholder URL with your copied Google Apps Script Web App URL.
4. Save the file.

---

### Done!
Whenever visitors open your website, `analytics.js` quietly gathers visitor telemetry (device type, screen size, approximate city/region, IP, browser, timestamp) and automatically appends a new row in your Google Sheet with zero performance impact.
