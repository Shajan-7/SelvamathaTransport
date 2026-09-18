/**
 * ==============================================================================
 * SELVAMATHA TRANSPORT - MAIN INTERACTIVE CONTROLLER
 * Features: Rolls-Royce Magnetic Cursor, GSAP/Lenis Smooth Scroll,
 * Multi-Language (EN/TA/ML), Light/Dark Theme, WhatsApp Booking, Feedback Modal
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ============================================================================
     1. ROLLS-ROYCE LUXURY MAGNETIC CURSOR
     ============================================================================ */
  const cursorRing = document.getElementById('luxuryCursorRing');
  const cursorDot = document.getElementById('luxuryCursorDot');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer && cursorRing && cursorDot) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorRing.classList.contains('is-active')) {
        cursorRing.classList.add('is-active');
        cursorDot.classList.add('is-active');
      }

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function renderLuxuryCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderLuxuryCursor);
    }
    requestAnimationFrame(renderLuxuryCursor);

    const hoverSelectors = 'a, button, input, select, textarea, .interactive, .service-card, .founder-card, .phone-btn, .route-pill';
    const interactiveElements = document.querySelectorAll(hoverSelectors);

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });

    window.addEventListener('mousedown', () => cursorRing.classList.add('is-clicking'));
    window.addEventListener('mouseup', () => cursorRing.classList.remove('is-clicking'));
  }

  /* ============================================================================
     2. SMOOTH SCROLL (GSAP & LENIS SMOOTH SCROLLER)
     ============================================================================ */
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* Safe Internal Anchor Click Navigation (Prevents file:// Cross-Origin Security Errors) */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        e.preventDefault();

        // If mobile nav drawer is open, close it
        const mobileToggleEl = document.getElementById('mobileToggle');
        const navMenuEl = document.getElementById('navMenu');
        if (navMenuEl && navMenuEl.classList.contains('is-open')) {
          navMenuEl.classList.remove('is-open');
          document.body.style.overflow = '';
          if (mobileToggleEl) {
            mobileToggleEl.setAttribute('aria-expanded', 'false');
            const icon = mobileToggleEl.querySelector('svg');
            if (icon) {
              icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            }
          }
        }

        const navHeight = 72;
        if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
          lenisInstance.scrollTo(targetEl, { offset: -navHeight });
        } else {
          const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }

        try {
          if (window.location.protocol !== 'file:' && window.history && window.history.pushState) {
            window.history.pushState(null, '', hash);
          }
        } catch (_) {
          // Gracefully ignored on restricted file:// origins
        }
      }
    });
  });

  /* ============================================================================
     3. LIGHT & DARK THEME SWITCHER
     ============================================================================ */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const themeIcons = document.querySelectorAll('.theme-icon-svg');
  const drawerThemeLabel = document.getElementById('drawerThemeLabel');
  const savedTheme = localStorage.getItem('selvamatha_theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('selvamatha_theme', theme);

    const isLight = theme === 'light';
    const sunSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    const moonSvg = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';

    themeIcons.forEach((icon) => {
      icon.innerHTML = isLight ? moonSvg : sunSvg;
    });

    themeToggleBtns.forEach((btn) => {
      btn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });

    if (drawerThemeLabel) {
      drawerThemeLabel.textContent = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }
  }

  applyTheme(savedTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  /* ============================================================================
     4. MULTI-LANGUAGE TOGGLE (ENGLISH | தமிழ் | മലയാളം)
     ============================================================================ */
  const translations = {
    en: {
      nav_home: "Home",
      nav_services: "Service",
      nav_about_fleet: "About",
      nav_quote: "Booking",
      nav_contact: "Contact",
      hero_title_1: "Selvamatha Transport - Safe & Fast",
      hero_title_2: "Tamil Nadu ⇄ Kerala",
      hero_point_1: "Send anything, anywhere, anytime, on correct time with 15+ heavy trucks and 25+ years experience.",
      hero_point_2: "Premier heavy truck transportation connecting Tamil Nadu and Kerala with safe, fast, and transparent service.",
      hero_point_3: "Multiple pickup and multiple delivery available at nominal cost.",
      hero_btn_quote: "Book on WhatsApp",
      hero_btn_call: "Call Dispatch: 9487366449",
      stat_years: "25+ Years",
      stat_years_lbl: "Trusted Service",
      stat_trucks: "15+ Lorries",
      stat_trucks_lbl: "Heavy Commercial Fleet",
      stat_staff: "35+ Crew",
      stat_staff_lbl: "Experienced Drivers",
      stat_service: "24/7 Hours",
      stat_service_lbl: "Daily Regular Trips",
      caption_route: "Heavy Commercial Fleet • Daily Regular Service",
      caption_status: "Trusted Since 1998",
      sec_services_tag: "What We Offer",
      sec_services_desc: "Reliable, Affordable & Safe Freight",
      srv_1_title: "FTL and LTL Freight",
      srv_1_desc: "Dedicated Full Truck Load (FTL) or economical Part Load Freight (LTL). Direct point-to-point transit and regular departures between Tamil Nadu and Kerala.",
      srv_2_title: "Hassle-Free Truck Rental",
      srv_2_desc: "Book truck online. Whenever you need, wherever you need with trained drivers and verified vehicles.",
      srv_3_title: "Transparent Pricing",
      srv_3_desc: "Enjoy the most affordable rates in town with our transparent pricing. No hidden costs or surprise surcharges.",
      srv_4_title: "Safe & Reliable Trucks",
      srv_4_desc: "Superior safety and trained partners. Heavy waterproof tarpaulins and continuous route monitoring.",
      srv_5_title: "15+ Partner Vehicles",
      srv_5_desc: "15+ vehicles in partner to deliver streamline trucks on time and every time.",
      sec_fleet_tag: "Our Fleet & History",
      sec_fleet_desc: "15+ heavy-duty haulers with payload capacities from 10 to 25 Tons, operated by experienced highway drivers.",
      fleet_caption_title: "Selvamatha & Ponkani Heavy Fleet",
      about_sub_title: "Founded on Trust",
      about_p1: "Selvamatha Transport was founded by S. Xavier in 1998. He started this company with one simple commitment: deliver every product safely, securely, and at the correct time.",
      about_quote: "“Send anything, anywhere, anytime at correct Time.”",
      about_p2: "Our wheels keep turning across every corner of Tamil Nadu and Kerala, delivering trust on every highway, every single day.",
      about_partner: "Special thanks to AKN Modern Rice Mill for their continuous trust in our journey.",
      role_founder: "Founder",
      role_directors: "Co Founders",
      sec_quote_tag: "Instant Booking",
      sec_quote_desc: "Type your pickup and drop points for immediate booking via WhatsApp.",
      quote_box_title: "⚡ WhatsApp Fast Booking",
      quote_box_desc: "Enter your pickup and delivery locations to book directly.",
      lbl_origin: "Pickup Point",
      lbl_dest: "Delivery Point",
      lbl_cargo: "Cargo / Goods Description",
      lbl_weight: "Estimated Weight",
      btn_send_whatsapp: "Send Booking Request on WhatsApp",
      btn_open_feedback: "📋 Click Here to Open Feedback / Query Form",
      sec_contact_tag: "Contact Us",
      sec_contact_desc: "24/7 Logistics Booking Desk",
      contact_phones_title: "Direct contact for immediate bookings",
      contact_email_title: "Email Address",
      footer_about: "Premier heavy truck transportation connecting Tamil Nadu and Kerala with safe, fast, and transparent service.",
      footer_designed: "Designed by",
      cookie_msg: "We use cookies and basic analytics to improve your experience, ensure secure bookings, and optimize our freight services. Do you accept cookies?",
      cookie_accept: "Accept Cookies",
      cookie_decline: "Decline"
    },
    ta: {
      nav_home: "முகப்பு",
      nav_services: "சேவை",
      nav_about_fleet: "பற்றி",
      nav_quote: "முன்பதிவு",
      nav_contact: "தொடர்பு",
      hero_title_1: "செல்வமாதா டிரான்ஸ்போர்ட் - பாதுகாப்பான & வேகமான",
      hero_title_2: "தமிழ்நாடு ⇄ கேரளா",
      hero_point_1: "எதையும், எங்கும், எப்போதும் சரியான நேரத்தில் கொண்டு சேர்க்க 15+ கனரக லாரிகள் மற்றும் 25+ ஆண்டுகள் அனுபவம்.",
      hero_point_2: "தமிழ்நாடு மற்றும் கேரளாவை பாதுகாப்பான, விரைவான மற்றும் வெளிப்படையான சேவையுடன் இணைக்கும் முன்னணி கனரக லாரி போக்குவரத்து.",
      hero_point_3: "குறைந்த செலவில் பல இடங்களில் ஏற்றுதல் (Multiple Pickup) மற்றும் இறக்குதல் (Multiple Delivery) வசதி உண்டு.",
      hero_btn_quote: "வாட்ஸ்அப்பில் முன்பதிவு செய்ய",
      hero_btn_call: "அழைக்க: 9487366449",
      stat_years: "25+ ஆண்டுகள்",
      stat_years_lbl: "நம்பகமான சேவை",
      stat_trucks: "15+ லாரிகள்",
      stat_trucks_lbl: "கனரக லாரி படை",
      stat_staff: "35+ பணியாளர்கள்",
      stat_staff_lbl: "அனுபவமிக்க ஓட்டுநர்கள்",
      stat_service: "24/7 சேவை",
      stat_service_lbl: "தினசரி தொடர் பயணம்",
      caption_route: "கனரக லாரி படை • தினசரி தொடர் சேவை",
      caption_status: "1998 முதல் நம்பகமான சேவை",
      sec_services_tag: "எங்கள் சேவைகள்",
      sec_services_desc: "பாதுகாப்பான, மலிவான & நம்பகமான சரக்கு போக்குவரத்து",
      srv_1_title: "FTL மற்றும் LTL சரக்கு சேவை",
      srv_1_desc: "முழு லாரி சுமை (FTL) மற்றும் பகுதி லாரி சுமை (LTL) ஆகிய இரண்டிற்கும் விரைவான மற்றும் நம்பகமான நேரடி போக்குவரத்து.",
      srv_2_title: "எளிய லாரி வாடகை",
      srv_2_desc: "எப்போது வேண்டுமானாலும், எங்கு வேண்டுமானாலும் ஆன்லைனில் எளிதாக லாரி புக் செய்யுங்கள்.",
      srv_3_title: "வெளிப்படையான விலை",
      srv_3_desc: "மறைமுக கட்டணங்கள் இன்றி நகரின் மிகக் குறைந்த, வெளிப்படையான கட்டணங்கள்.",
      srv_4_title: "பாதுகாப்பான & நம்பகமான லாரிகள்",
      srv_4_desc: "பயிற்சி பெற்ற ஓட்டுநர்கள் மற்றும் மூன்று அடுக்கு தார்ப்பாய் பாதுகாப்புடன் பாதுகாப்பான பயணம்.",
      srv_5_title: "15+ வாகனங்கள்",
      srv_5_desc: "எப்போதும் குறித்த நேரத்தில் சரக்குகளை சேர்க்க 15+ வாகனங்கள் தயார் நிலையில் உள்ளன.",
      sec_fleet_tag: "லாரிகள் & வரலாறு",
      sec_fleet_desc: "10 டன் முதல் 25 டன் வரை தாங்கும் வலிமைமிக்க கனரக வாகனங்கள், அனுபவமிக்க நெடுஞ்சாலை ஓட்டுநர்கள்.",
      fleet_caption_title: "செல்வமாதா & பொன்கனி லாரிகள்",
      about_sub_title: "நம்பிக்கையின் அடித்தளம்",
      about_p1: "செல்வமாதா டிரான்ஸ்போர்ட் 1998 ஆம் ஆண்டு எஸ். சேவியர் அவர்களால் தொடங்கப்பட்டது. சரியான நேரத்தில் பாதுகாப்பாக சரக்குகளை சேர்ப்பதே எங்கள் குறிக்கோள்.",
      about_quote: "“எதையும், எங்கும், எப்போதும், சரியான நேரத்தில் கொண்டு சேர்ப்போம்.”",
      about_p2: "தமிழ்நாடு மற்றும் கேரளாவின் அனைத்து பகுதிகளிலும் எங்கள் லாரிகள் தினசரி நம்பிக்கையுடன் இடைவிடாது இயங்கி வருகின்றன.",
      about_partner: "எங்கள் பயணத்தில் தொடர்ந்து நம்பிக்கை வைத்துள்ள ஏ.கே.என் (AKN) மாடர்ன் ரைஸ் மில் நிறுவனத்திற்கு மனமார்ந்த நன்றிகள்.",
      role_founder: "நிறுவனர்",
      role_directors: "இணை நிறுவனர்கள்",
      sec_quote_tag: "எளிய முன்பதிவு",
      sec_quote_desc: "வாட்ஸ்அப் மூலமாக உடனடி முன்பதிவு செய்ய ஏற்றுமிடம் மற்றும் இறங்குமிடத்தை தட்டச்சு செய்யவும்.",
      quote_box_title: "⚡ உடனடி வாட்ஸ்அப் முன்பதிவு",
      quote_box_desc: "ஊர் மற்றும் சரக்கு விபரத்தை தட்டச்சு செய்யவும்.",
      lbl_origin: "ஏற்றும் இடம்",
      lbl_dest: "இறக்கும் இடம்",
      lbl_cargo: "சரக்கு வகை",
      lbl_weight: "எடை அளவு",
      btn_send_whatsapp: "வாட்ஸ்அப்பில் முன்பதிவு செய்ய கிளிக் செய்க",
      btn_open_feedback: "📋 கருத்து அல்லது புகார் படிவத்தை திறக்க கிளிக் செய்க",
      sec_contact_tag: "தொடர்புக்கு",
      sec_contact_desc: "24/7 முன்பதிவு மற்றும் தகவல் அலுவலகம்",
      contact_phones_title: "உடனடி முன்பதிவுக்கு நேரடி தொடர்பு",
      contact_email_title: "மின்னஞ்சல் முகவரி",
      footer_about: "தமிழ்நாடு மற்றும் கேரளாவை பாதுகாப்பான, விரைவான மற்றும் வெளிப்படையான சேவையுடன் இணைக்கும் முன்னணி கனரக லாரி போக்குவரத்து.",
      footer_designed: "வடிவமைப்பு:",
      cookie_msg: "எங்கள் இணையதளத்தில் சிறந்த அனுபவம், பாதுகாப்பான லாரி முன்பதிவு மற்றும் சேவையை மேம்படுத்த நாங்கள் குக்கீகளைப் (Cookies) பயன்படுத்துகிறோம். குக்கீகளை ஏற்கிறீர்களா?",
      cookie_accept: "ஏற்றுக்கொள்",
      cookie_decline: "நிராகரி"
    },
    ml: {
      nav_home: "ഹോം",
      nav_services: "സേവനം",
      nav_about_fleet: "വിവരങ്ങൾ",
      nav_quote: "ബുക്കിംഗ്",
      nav_contact: "ബന്ധപ്പെടുക",
      hero_title_1: "സെൽവമാതാ ട്രാൻസ്പോർട്ട് - സുരക്ഷിതവും വേഗമേറിയതും",
      hero_title_2: "തമിഴ്‌നാട് ⇄ കേരളം",
      hero_point_1: "ഏതൊരു ചരക്കും കൃത്യസമയത്ത് എത്തിക്കാൻ 15+ ഹെവി കൊമേഴ്‌സ്യൽ ലോറികളും 25+ വർഷത്തെ പരിചയവും.",
      hero_point_2: "തമിഴ്‌നാടിനെയും കേരളത്തെയും സുരക്ഷിതവും വേഗമേറിയതും സുതാര്യവുമായ സേവനങ്ങളിലൂടെ ബന്ധിപ്പിക്കുന്ന മുൻനിര ഹെവി ട്രക്ക് ഗതാഗതം.",
      hero_point_3: "കുറഞ്ഞ ചെലവിൽ മൾട്ടിപ്പിൾ പിക്കപ്പും മൾട്ടിപ്പിൾ ഡെലിവറിയും ലഭ്യമാണ്.",
      hero_btn_quote: "വാട്ട്‌സ്ആപ്പിൽ ബുക്ക് ചെയ്യുക",
      hero_btn_call: "ഡെസ്കിലേക്ക് വിളിക്കുക: 9487366449",
      stat_years: "25+ വർഷം",
      stat_years_lbl: "വിശ്വസ്ത സേവനം",
      stat_trucks: "15+ ലോറികൾ",
      stat_trucks_lbl: "ഹെവി ഫ്ലീറ്റ്",
      stat_staff: "35+ ഡ്രൈവർമാർ",
      stat_staff_lbl: "പരിചയസമ്പന്നരായ ജീവനക്കാർ",
      stat_service: "24/7 സർവീസ്",
      stat_service_lbl: "പ്രതിദിന സർവീസുകൾ",
      caption_route: "ഹെവി കൊമേഴ്‌സ്യൽ ഫ്ലീറ്റ് • പ്രതിദിന സർവീസ്",
      caption_status: "1998 മുതൽ വിശ്വസ്ത സേവനം",
      sec_services_tag: "ഞങ്ങളുടെ സേവനങ്ങൾ",
      sec_services_desc: "സുരക്ഷിതവും മിതമായ നിരക്കിലുള്ളതുമായ ചരക്ക് ഗതാഗതം",
      srv_1_title: "FTL & LTL ചരക്ക് സേവനം",
      srv_1_desc: "പൂർണ്ണ ലോറി ലോഡുകൾക്കും (FTL) പാർട്ട് ലോഡ് ചരക്കുകൾക്കും (LTL) വിശ്വസനീയവും വേഗമേറിയതുമായ സർവീസ്.",
      srv_2_title: "ലളിതമായ ലോറി വാടക",
      srv_2_desc: "എപ്പോൾ വേണമെങ്കിലും എവിടെ വേണമെങ്കിലും ഓൺലൈനായി എളുപ്പത്തിൽ ബുക്ക് ചെയ്യാം.",
      srv_3_title: "സുതാര്യമായ നിരക്കുകൾ",
      srv_3_desc: "മറഞ്ഞിരിക്കുന്ന ചെലവുകളില്ലാതെ ഏറ്റവും കുറഞ്ഞ നിരക്കുകൾ.",
      srv_4_title: "സുരക്ഷിതമായ ലോറികൾ",
      srv_4_desc: "മികച്ച ഡ്രൈവർമാരും മഴയിൽ നനയാത്ത ത്രിബിൾ ടാർപോളിൻ സംരക്ഷണവും.",
      srv_5_title: "15+ പങ്കാളി വാഹനങ്ങൾ",
      srv_5_desc: "എപ്പോഴും കൃത്യസമയത്ത് സാധനങ്ങൾ എത്തിക്കാൻ 15+ വാഹനങ്ങൾ പങ്കാളിയായി ഉണ്ട്.",
      sec_fleet_tag: "ഫ്ലീറ്റ് & ചരിത്രം",
      sec_fleet_desc: "10 മുതൽ 25 ടൺ വരെ ഭാരം വഹിക്കാൻ ശേഷിയുള്ള ഹെവി കൊമേഴ്‌സ്യൽ വാഹനങ്ങൾ, പരിചയസമ്പന്നരായ ഡ്രൈവർമാർ.",
      fleet_caption_title: "സെൽവമാതാ & പൊൻകനി ലോറികൾ",
      about_sub_title: "വിശ്വാസ്യതയുടെ അടിത്തറ",
      about_p1: "1998-ൽ എസ്. സേവ്യർ സ്ഥാപിച്ചതാണ് സെൽവമാതാ ട്രാൻസ്പോർട്ട്. ചരക്കുകൾ സുരക്ഷിതമായി കൃത്യസമയത്ത് എത്തിക്കുക എന്നതാണ് ഞങ്ങളുടെ ലക്ഷ്യം.",
      about_quote: "“എന്തും, എവിടെയും, എപ്പോഴും, കൃത്യസമയത്ത് എത്തിക്കും.”",
      about_p2: "തമിഴ്‌നാടിന്റെയും കേരളത്തിന്റെയും എല്ലാ കോണുകളിലും ഞങ്ങളുടെ ചക്രങ്ങൾ വിശ്വാസ്യതയോടെ പ്രതിദിനം ഓടിക്കൊണ്ടിരിക്കുന്നു.",
      about_partner: "ഞങ്ങളുടെ യാത്രയിൽ നിരന്തരം വിശ്വാസമർപ്പിച്ച AKN മോഡേൺ റൈസ് മില്ലിന് പ്രത്യേക നന്ദി.",
      role_founder: "സ്ഥാപകൻ",
      role_directors: "സഹസ്ഥാപകർ",
      sec_quote_tag: "എളുപ്പത്തിൽ ബുക്കിംഗ്",
      sec_quote_desc: "വാട്ട്‌സ്ആപ്പ് വഴി വേഗത്തിൽ ബുക്ക് ചെയ്യാൻ പിക്കപ്പും ഡെലിവറിയും നൽകുക.",
      quote_box_title: "⚡ തത്സമയ വാട്ട്‌സ്ആപ്പ് ബുക്കിംഗ്",
      quote_box_desc: "റൂട്ടും വിവരങ്ങളും നൽകുക.",
      lbl_origin: "കയറ്റുന്ന സ്ഥലം",
      lbl_dest: "ഇറക്കുന്ന സ്ഥലം",
      lbl_cargo: "ചരക്ക് ഇനം",
      lbl_weight: "ഭാരം",
      btn_send_whatsapp: "വാട്ട്‌സ്ആപ്പിൽ ബുക്കിംഗ് സന്ദേശം അയക്കുക",
      btn_open_feedback: "📋 ഫീഡ്‌ബാക്ക് ഫോം തുറക്കാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക",
      sec_contact_tag: "ബന്ധപ്പെടുക",
      sec_contact_desc: "24/7 ബുക്കിംഗ് ഡെസ്ക്",
      contact_phones_title: "ഉടനടി ബുക്കിംഗിനായി നേരിട്ട് ബന്ധപ്പെടുക",
      contact_email_title: "ഇമെയിൽ വിലാസം",
      footer_about: "തമിഴ്‌നാടിനെയും കേരളത്തെയും സുരക്ഷിതവും വേഗമേറിയതും സുതാര്യവുമായ സേവനങ്ങളിലൂടെ ബന്ധിപ്പിക്കുന്ന മുൻനിര ഹെവി ട്രക്ക് ഗതാഗതം.",
      footer_designed: "ഡിസൈൻ ചെയ്തത്:",
      cookie_msg: "ഞങ്ങളുടെ വെബ്സൈറ്റിൽ മികച്ച അനുഭവം നൽകുന്നതിനും സുരക്ഷിതമായ ചരക്ക് ബുക്കിംഗിനുമായി ഞങ്ങൾ കുക്കികൾ (Cookies) ഉപയോഗിക്കുന്നു. താങ്കൾ കുക്കികൾ സ്വീകരിക്കുന്നുവോ?",
      cookie_accept: "സ്വീകരിക്കുക",
      cookie_decline: "നിരസിക്കുക"
    }
  };

  const langButtons = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('selvamatha_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('selvamatha_lang', lang);

    langButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.documentElement.setAttribute('lang', lang);
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang);
    });
  });

  applyLanguage(currentLang);

  /* ============================================================================
     5. MOBILE MENU DRAWER
     ============================================================================ */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      const icon = mobileToggle.querySelector('svg');
      if (isOpen) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      }
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          document.body.style.overflow = '';
          mobileToggle.setAttribute('aria-expanded', 'false');
          const icon = mobileToggle.querySelector('svg');
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
        }
      });
    });
  }

  /* ============================================================================
     6. FAST QUOTE & WHATSAPP DISPATCHER (INPUT BOXES)
     ============================================================================ */
  const fastQuoteForm = document.getElementById('fastQuoteForm');
  const quoteOrigin = document.getElementById('quoteOrigin');
  const quoteDest = document.getElementById('quoteDest');
  const quoteCargo = document.getElementById('quoteCargo');
  const quoteWeight = document.getElementById('quoteWeight');
  const btnWhatsappSubmit = document.getElementById('btnWhatsappSubmit');

  function handleFastQuoteSubmit(e) {
    if (e) {
      e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    const o = quoteOrigin && quoteOrigin.value.trim() ? quoteOrigin.value.trim() : 'Tamil Nadu';
    const d = quoteDest && quoteDest.value.trim() ? quoteDest.value.trim() : 'Kerala';
    const cargo = quoteCargo && quoteCargo.value.trim() ? quoteCargo.value.trim() : 'General Goods / Freight';
    const w = quoteWeight ? quoteWeight.value : '10-16 Tons';

    const msg = `*SELVAMATHA TRANSPORT - TRUCK BOOKING INQUIRY*%0A` +
      `----------------------------------------%0A` +
      `📍 *Pickup Point:* ${encodeURIComponent(o)}%0A` +
      `🏁 *Delivery Point:* ${encodeURIComponent(d)}%0A` +
      `📦 *Cargo Details:* ${encodeURIComponent(cargo)}%0A` +
      `⚖️ *Weight:* ${encodeURIComponent(w)}%0A` +
      `----------------------------------------%0A` +
      `Please send available truck & best rate.`;

    const waUrl = `https://wa.me/919487366449?text=${msg}`;

    if (window.SelvamathaAnalytics) {
      window.SelvamathaAnalytics.sendCustomEvent('whatsapp_booking_click', { o, d, cargo, w });
    }

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return false;
  }

  if (fastQuoteForm) {
    fastQuoteForm.addEventListener('submit', handleFastQuoteSubmit);
  }

  if (btnWhatsappSubmit) {
    btnWhatsappSubmit.addEventListener('click', handleFastQuoteSubmit);
  }

  /* ============================================================================
     7. GOOGLE FEEDBACK FORM TOGGLE (SHOWN ONLY ON CLICK)
     ============================================================================ */
  const toggleFeedbackBtn = document.getElementById('toggleFeedbackBtn');
  const feedbackFormContainer = document.getElementById('feedbackFormContainer');

  if (toggleFeedbackBtn && feedbackFormContainer) {
    toggleFeedbackBtn.addEventListener('click', () => {
      const isHidden = feedbackFormContainer.style.display === 'none' || feedbackFormContainer.style.display === '';
      if (isHidden) {
        feedbackFormContainer.style.display = 'block';
        toggleFeedbackBtn.textContent = '✖ Close Feedback / Query Form';
        feedbackFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        feedbackFormContainer.style.display = 'none';
        const dict = translations[currentLang] || translations.en;
        toggleFeedbackBtn.textContent = dict.btn_open_feedback || '📋 Click Here to Open Feedback / Query Form';
      }
    });
  }
  /* ============================================================================
     8. HERO GALLERY AUTO-SLIDER (Lorry 1, 2, 3, 4, Logo, New Logo)
     ============================================================================ */
  const heroGallery = document.getElementById('heroGallery');
  if (heroGallery) {
    const slides = heroGallery.querySelectorAll('.gallery-slide');
    const dots = heroGallery.querySelectorAll('.gallery-dot');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    let currentSlide = 0;
    let slideInterval = null;

    function goToSlide(index) {
      if (!slides.length) return;
      slides[currentSlide].classList.remove('is-active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('is-active');

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('is-active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('is-active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, 3500);
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(slideIndex)) {
          goToSlide(slideIndex);
          startAutoSlide();
        }
      });
    });

    heroGallery.addEventListener('mouseenter', stopAutoSlide);
    heroGallery.addEventListener('mouseleave', startAutoSlide);
    heroGallery.addEventListener('touchstart', stopAutoSlide, { passive: true });
    heroGallery.addEventListener('touchend', startAutoSlide, { passive: true });

    startAutoSlide();
  }
});
