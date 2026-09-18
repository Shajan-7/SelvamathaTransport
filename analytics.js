/**
 * ==============================================================================
 * SELVAMATHA TRANSPORT - CLIENT-SIDE TELEMETRY & VISITOR ANALYTICS
 * ==============================================================================
 * 
 * Silent background visitor analytics collector.
 * Non-blocking, privacy-respecting client telemetry logging to Google Sheets
 * via Google Apps Script Web App Endpoint.
 * 
 * HOW TO CONNECT TO YOUR GOOGLE SHEET:
 * 1. Create a new Google Sheet (e.g., "Selvamatha Web Visitors").
 * 2. In Google Sheets, click 'Extensions' -> 'Apps Script'.
 * 3. Delete any existing code and paste the code from 'GOOGLE_SHEETS_SCRIPT.js'.
 * 4. Click 'Deploy' -> 'New deployment'.
 * 5. Select type 'Web app'.
 * 6. Set:
 *    - Description: "Selvamatha Telemetry Collector"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click 'Deploy', authorize permissions, and copy the Web App URL.
 * 8. Replace `WEB_APP_URL` below with your deployed Web App URL.
 * ==============================================================================
 */

(function () {
  'use strict';

  // Configurable Google Apps Script Web App Endpoint
  // Replace this placeholder with your live Google Apps Script Web App URL:
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_DEPLOYED_APP_SCRIPT_URL/exec';

  /**
   * Helper to detect Device Type based on user-agent and viewport width
   */
  function getDeviceType() {
    const width = window.innerWidth || screen.width;
    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

    if (isMobileUA || width < 640) {
      return 'Mobile';
    } else if (width >= 640 && width <= 1024) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  /**
   * Helper to detect Browser Name and Version
   */
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = '';

    if (/Edg\/([0-9.]+)/.test(ua)) {
      name = 'Microsoft Edge';
      version = RegExp.$1;
    } else if (/Chrome\/([0-9.]+)/.test(ua) && !/Edg/.test(ua)) {
      name = 'Google Chrome';
      version = RegExp.$1;
    } else if (/Safari\/([0-9.]+)/.test(ua) && !/Chrome/.test(ua)) {
      name = 'Apple Safari';
      version = RegExp.$1;
    } else if (/Firefox\/([0-9.]+)/.test(ua)) {
      name = 'Mozilla Firefox';
      version = RegExp.$1;
    } else if (/MSIE|Trident/.test(ua)) {
      name = 'Internet Explorer';
    }

    return `${name} ${version}`.trim();
  }

  /**
   * Helper to detect Operating System
   */
  function getOSInfo() {
    const ua = navigator.userAgent;
    if (/Windows NT 10.0/.test(ua)) return 'Windows 10/11';
    if (/Windows NT 6.3/.test(ua)) return 'Windows 8.1';
    if (/Windows NT 6.1/.test(ua)) return 'Windows 7';
    if (/Mac OS X ([0-9_]+)/.test(ua)) return 'macOS ' + RegExp.$1.replace(/_/g, '.');
    if (/Android ([0-9.]+)/.test(ua)) return 'Android ' + RegExp.$1;
    if (/iPhone OS ([0-9_]+)/.test(ua)) return 'iOS ' + RegExp.$1.replace(/_/g, '.');
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unknown OS';
  }

  /**
   * Dispatches the telemetry payload to Google Sheets via POST no-cors
   */
  async function sendTelemetryToGoogleSheets(payload) {
    if (!WEB_APP_URL || WEB_APP_URL.includes('REPLACE_WITH_YOUR_DEPLOYED_APP_SCRIPT_URL')) {
      console.info(
        '%c[Selvamatha Analytics] Telemetry collected successfully:%c %o \n(Configure WEB_APP_URL in analytics.js to log directly to Google Sheets)',
        'color: #3b82f6; font-weight: bold;',
        'color: inherit;',
        payload
      );
      return;
    }

    try {
      // mode: 'no-cors' allows sending data to Google Apps Script without CORS restrictions
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log('[Selvamatha Analytics] Telemetry dispatched silently.');
    } catch (err) {
      // Non-blocking catch to ensure zero disruption to user
      console.debug('[Selvamatha Analytics] Dispatch notice:', err);
    }
  }

  /**
   * Main telemetry runner: Gathers client metrics, fetches non-blocking IP & Geolocation,
   * and sends data to Google Sheets.
   */
  async function initTelemetry() {
    // Avoid double logging in the same session if already tracked recently (within 5 minutes)
    const SESSION_KEY = 'selvamatha_telemetry_last_ping';
    const lastPing = sessionStorage.getItem(SESSION_KEY);
    const nowMs = Date.now();

    if (lastPing && nowMs - parseInt(lastPing, 10) < 5 * 60 * 1000) {
      // Already recorded this session recently
      return;
    }

    const now = new Date();

    // Baseline client telemetry
    const basePayload = {
      timestampISO: now.toISOString(),
      localDateTime: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      pageUrl: window.location.href,
      pathname: window.location.pathname || '/',
      referrer: document.referrer || 'Direct Visit',
      deviceType: getDeviceType(),
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: `${screen.colorDepth}-bit`,
      browser: getBrowserInfo(),
      os: getOSInfo(),
      language: navigator.language || navigator.userLanguage || 'Unknown',
      platform: navigator.platform || 'Unknown',
      networkType: (navigator.connection && navigator.connection.effectiveType) || 'Unknown'
    };

    // Non-blocking IP & Geolocation gathering
    let geoPayload = {
      ip: 'Unavailable',
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      coordinates: 'Unknown',
      isp: 'Unknown'
    };

    try {
      // Free non-blocking IP geolocation lookup with quick 3.5s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Primary provider: freeipapi.com
      let response = await fetch('https://freeipapi.com/api/json', {
        signal: controller.signal
      }).catch(() => null);

      if (response && response.ok) {
        clearTimeout(timeoutId);
        const data = await response.json();
        geoPayload = {
          ip: data.ipAddress || 'Unavailable',
          city: data.cityName || 'Unknown',
          region: data.regionName || 'Unknown',
          country: data.countryName || 'Unknown',
          coordinates: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : 'Unknown',
          isp: data.isp || 'Unknown'
        };
      } else {
        // Fallback provider: ipapi.co
        const fallbackController = new AbortController();
        const fbTimeoutId = setTimeout(() => fallbackController.abort(), 3000);
        const fbRes = await fetch('https://ipapi.co/json/', {
          signal: fallbackController.signal
        }).catch(() => null);

        if (fbRes && fbRes.ok) {
          clearTimeout(fbTimeoutId);
          const fbData = await fbRes.json();
          geoPayload = {
            ip: fbData.ip || 'Unavailable',
            city: fbData.city || 'Unknown',
            region: fbData.region || 'Unknown',
            country: fbData.country_name || 'Unknown',
            coordinates: fbData.latitude && fbData.longitude ? `${fbData.latitude}, ${fbData.longitude}` : 'Unknown',
            isp: fbData.org || 'Unknown'
          };
        }
      }
    } catch (e) {
      // If network lookup is blocked by ad-blocker or offline, continue gracefully
      geoPayload.ip = 'Lookup Blocked / Offline';
    }

    const fullTelemetry = {
      ...basePayload,
      ...geoPayload
    };

    sessionStorage.setItem(SESSION_KEY, nowMs.toString());
    sendTelemetryToGoogleSheets(fullTelemetry);
  }

  // Defer execution until page has loaded and browser is idle so performance is never penalized
  if (document.readyState === 'complete') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initTelemetry, { timeout: 3000 });
    } else {
      setTimeout(initTelemetry, 1500);
    }
  } else {
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(initTelemetry, { timeout: 3000 });
      } else {
        setTimeout(initTelemetry, 1500);
      }
    });
  }

  // Expose global dispatcher helper if custom events want to log conversions
  window.SelvamathaAnalytics = {
    sendCustomEvent: function (eventName, eventData) {
      const now = new Date();
      sendTelemetryToGoogleSheets({
        timestampISO: now.toISOString(),
        localDateTime: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        pageUrl: window.location.href,
        eventType: eventName,
        eventData: JSON.stringify(eventData || {}),
        deviceType: getDeviceType(),
        browser: getBrowserInfo(),
        os: getOSInfo()
      });
    }
  };
})();
