/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: SELVAMATHA TRANSPORT VISITOR TELEMETRY DISPATCHER
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR GOOGLE SHEETS SETUP:
 * 1. Open Google Sheets (https://sheets.new) and name it "Selvamatha Transport - Web Visitors".
 * 2. In the top menu, go to: Extensions -> Apps Script.
 * 3. Delete everything in the Code.gs editor.
 * 4. Copy and paste this entire code snippet into the editor.
 * 5. Click the "Save" (disk) icon.
 * 6. Click "Deploy" (top right) -> "New deployment".
 * 7. Click the gear icon next to "Select type" and select "Web app".
 * 8. In the configuration popup:
 *    - Description: "Selvamatha Visitor Logger"
 *    - Execute as: "Me (<your-email>)"
 *    - Who has access: "Anyone"   <--- CRITICAL: MUST BE 'Anyone' so website visitors can log data
 * 9. Click "Deploy". Authorize permissions when prompted (Advanced -> Go to ... (unsafe)).
 * 10. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/AKfycb.../exec).
 * 11. Paste this URL into `analytics.js` in the `WEB_APP_URL` variable.
 * 
 * That's it! The script will automatically format the columns and append visitor rows.
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10 seconds lock to prevent concurrency collisions

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Visitors") || ss.getActiveSheet();

    // Ensure the sheet name is 'Visitors'
    if (sheet.getName() !== "Visitors" && ss.getSheets().length === 1) {
      sheet.setName("Visitors");
    }

    // Expected Columns Schema
    var headers = [
      "Timestamp (ISO)",
      "Local Time (IST)",
      "Device",
      "City",
      "Region",
      "Country",
      "IP Address",
      "ISP / Carrier",
      "Browser",
      "OS",
      "Screen Res",
      "Viewport",
      "Referrer",
      "Page URL",
      "Language",
      "Coordinates"
    ];

    // Check if headers row exists, if not create and format it
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0F213E");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Parse incoming JSON data
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // Build row in exact schema order
    var row = [
      data.timestampISO || new Date().toISOString(),
      data.localDateTime || "",
      data.deviceType || "",
      data.city || "",
      data.region || "",
      data.country || "",
      data.ip || "",
      data.isp || "",
      data.browser || "",
      data.os || "",
      data.screenResolution || "",
      data.viewport || "",
      data.referrer || "",
      data.pageUrl || "",
      data.language || "",
      data.coordinates || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Telemetry recorded" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Selvamatha Transport Telemetry Web App is Active.");
}
