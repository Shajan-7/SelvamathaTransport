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
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* ============================================================================
     3. LIGHT & DARK THEME SWITCHER
     ============================================================================ */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('selvamatha_theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('selvamatha_theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      }
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  /* ============================================================================
     4. MULTI-LANGUAGE TOGGLE (ENGLISH | தமிழ் | മലയാളം)
     ============================================================================ */
  const translations = {
    en: {
      nav_home: "Home",
      nav_services: "Services",
      nav_about_fleet: "About & Fleet",
      nav_quote: "Book Online",
      nav_contact: "Contact",
      hero_tag: "Daily Lorry Service Since 1998",
      hero_title_1: "Safe & Fast Lorry Transport",
      hero_title_2: "Tamil Nadu ⇄ Kerala",
      hero_desc: "Send anything, anywhere, anytime, on correct time. Operating 15+ heavy Ashok Leyland trucks, 35+ experienced crew, and 24/7 booking support for 25+ years.",
      hero_btn_quote: "Book on WhatsApp",
      hero_btn_call: "Call Dispatch: 9487366449",
      stat_years: "25+ Years",
      stat_years_lbl: "Trusted Service",
      stat_trucks: "15+ Lorries",
      stat_trucks_lbl: "Ashok Leyland Fleet",
      stat_staff: "35+ Crew",
      stat_staff_lbl: "Experienced Drivers",
      stat_service: "24/7 Hours",
      stat_service_lbl: "Daily Regular Trips",
      caption_route: "Ashok Leyland Fleet • Regular Service",
      caption_status: "Daily Active Linehaul",
      corridor_text: " We pickup and deliver load anywhere in Tamil Nadu and Kerala (always exploring new locations). Multiple pickup and multiple delivery available at nominal cost.",
      sec_services_tag: "What We Offer",
      sec_services_title: "Reliable, Affordable & Safe Freight",
      sec_services_desc: "Choose the exact transport solution you need with transparent pricing and full cargo safety.",
      srv_1_title: "Full Truck Load (FTL)",
      srv_1_desc: "Dedicated lorry just for your consignment. Direct point-to-point transit from pickup to destination with zero delays.",
      srv_2_title: "Part Load Freight (LTL)",
      srv_2_desc: "Economical part-load transportation with regular departures across all Tamil Nadu and Kerala trade lanes.",
      srv_3_title: "Hassle-Free Truck Rental",
      srv_3_desc: "Book truck online. Whenever you need, wherever you need with trained drivers and verified vehicles.",
      srv_4_title: "Transparent Pricing",
      srv_4_desc: "Enjoy the most affordable rates in town with our transparent pricing. No hidden costs or surprise surcharges.",
      srv_5_title: "Safe & Reliable Trucks",
      srv_5_desc: "Superior safety and trained partners. Heavy waterproof tarpaulins and continuous route monitoring.",
      sec_fleet_tag: "Our Fleet & History",
      sec_fleet_title: "Ashok Leyland Heavy Lorries & Heritage",
      sec_fleet_desc: "15+ heavy-duty haulers with payload capacities from 10 to 25 Tons, operated by experienced highway drivers.",
      fleet_caption_title: "Selvamatha & Ponkani Heavy Fleet",
      fleet_caption_sub: "Maintained in prime highway running condition for safe long-haul transit.",
      about_sub_title: "Founded on Trust & Timeliness",
      about_p1: "Selvamatha Transport was founded by S. Xavier in 1998. He started this company with one simple commitment: deliver every product safely, securely, and at the correct time.",
      about_quote: "“Send anything, anywhere, anytime at correct TIME.”",
      about_p2: "Today, his brothers S. Innasimuthu & S. Micheal (the Two Pillars of Selvamatha Transport) manage daily operations across Tamil Nadu and Kerala.",
      about_partner: "Special thanks to John & AKN Modern Rice Mill for their continuous trust in our journey.",
      role_founder: "Founder (1998)",
      role_directors: "Two Pillars & Directors",
      sec_quote_tag: "Instant Booking",
      sec_quote_title: "Calculate Route & Book on WhatsApp",
      sec_quote_desc: "Type your pickup and drop towns for immediate rate and availability via WhatsApp.",
      quote_box_title: "⚡ WhatsApp Fast Booking",
      quote_box_desc: "Enter your pickup and delivery locations to book directly.",
      lbl_origin: "Pickup Town (Tamil Nadu)",
      lbl_dest: "Delivery Town (Kerala)",
      lbl_cargo: "Cargo / Goods Description",
      lbl_weight: "Estimated Weight",
      btn_send_whatsapp: "Send Booking Request on WhatsApp",
      btn_open_feedback: "📋 Click Here to Open Feedback / Query Form",
      sec_contact_tag: "Direct Reach",
      sec_contact_title: "24/7 Logistics Booking Desk",
      sec_contact_desc: "Speak directly with our directors Mr. S. Micheal and booking dispatchers.",
      contact_phones_title: "Dispatch Telephone Lines",
      contact_email_title: "Official Email Address",
      contact_office_title: "Registered Branch Office",
      footer_about: "Premier heavy truck transportation connecting Tamil Nadu and Kerala with safe, fast, and transparent service.",
      footer_designed: "Designed by"
    },
    ta: {
      nav_home: "முகப்பு",
      nav_services: "சேவைகள்",
      nav_about_fleet: "எங்களைப் பற்றி & லாரிகள்",
      nav_quote: "முன்பதிவு",
      nav_contact: "தொடர்பு",
      hero_tag: "1998 முதல் தினசரி லாரி சேவை",
      hero_title_1: "பாதுகாப்பான & வேகமான லாரி போக்குவரத்து",
      hero_title_2: "தமிழ்நாடு ⇄ கேரளா",
      hero_desc: "எதையும், எங்கும், எப்போதும், சரியான நேரத்தில் கொண்டு சேர்ப்போம். 15+ அசோக் லேலண்ட் லாரிகள், 35+ அனுபவமிக்க ஓட்டுநர்கள், 24/7 முன்பதிவு வசதி.",
      hero_btn_quote: "வாட்ஸ்அப்பில் முன்பதிவு செய்ய",
      hero_btn_call: "அழைக்க: 9487366449",
      stat_years: "25+ ஆண்டுகள்",
      stat_years_lbl: "நம்பகமான சேவை",
      stat_trucks: "15+ லாரிகள்",
      stat_trucks_lbl: "அசோக் லேலண்ட் படை",
      stat_staff: "35+ நபர்கள்",
      stat_staff_lbl: "அனுபவமிக்க ஓட்டுநர்கள்",
      stat_service: "24 மணி நேரம்",
      stat_service_lbl: "தினசரி தொடர் சேவை",
      caption_route: "அசோக் லேலண்ட் லாரி • தினசரி சேவை",
      caption_status: "தினசரி இயங்கும் சேவை",
      corridor_text: " தமிழ்நாடு ⇄ கேரளா மற்றும் கேரளா ⇄ தமிழ்நாடு முழுவதும் எங்கிருந்தும் சரக்குகளை ஏற்றி குறித்த நேரத்தில் இறக்குகிறோம். குறைந்த செலவில் பல இடங்களில் ஏற்றுதல் (Multiple Pickup) மற்றும் பல இடங்களில் இறக்குதல் (Multiple Delivery) வசதி உண்டு.",
      sec_services_tag: "எங்கள் சேவைகள்",
      sec_services_title: "பாதுகாப்பான & நம்பகமான போக்குவரத்து",
      sec_services_desc: "வெளிப்படையான கட்டணத்துடன் உங்களுக்கு தேவையான சேவையை தேர்வு செய்யுங்கள்.",
      srv_1_title: "முழு லாரி சுமை (FTL)",
      srv_1_desc: "உங்கள் சரக்குக்கு மட்டும் தனி லாரி ஒதுக்கீடு. ஏற்றுமிடத்திலிருந்து இறங்குமிடம் வரை நேரடி பயணம்.",
      srv_2_title: "பகுதி சுமை சேவை (LTL)",
      srv_2_desc: "குறைந்த அளவு சரக்குகளையும் சிக்கனமான கட்டணத்தில் தினசரி விரைவாக கொண்டு சேர்க்கும் வசதி.",
      srv_3_title: "எளிய லாரி வாடகை",
      srv_3_desc: "எப்போது வேண்டுமானாலும், எங்கு வேண்டுமானாலும் ஆன்லைனில் எளிதாக லாரி புக் செய்யுங்கள்.",
      srv_4_title: "வெளிப்படையான விலை",
      srv_4_desc: "மறைமுக கட்டணங்கள் இன்றி நகரின் மிகக் குறைந்த, வெளிப்படையான கட்டணங்கள்.",
      srv_5_title: "பாதுகாப்பான & நம்பகமான லாரிகள்",
      srv_5_desc: "பயிற்சி பெற்ற ஓட்டுநர்கள் மற்றும் மூன்று அடுக்கு தார்ப்பாய் பாதுகாப்புடன் பாதுகாப்பான பயணம்.",
      sec_fleet_tag: "லாரிகள் & வரலாறு",
      sec_fleet_title: "அசோக் லேலண்ட் லாரிகள் & வரலாறு",
      sec_fleet_desc: "10 டன் முதல் 25 டன் வரை தாங்கும் வலிமைமிக்க அசோக் லேலண்ட் வாகனங்கள்.",
      fleet_caption_title: "செல்வமாதா & பொன்கனி லாரிகள்",
      fleet_caption_sub: "சிறந்த முறையில் பராமரிக்கப்படும் அதிநவீன நெடுஞ்சாலை லாரிகள்.",
      about_sub_title: "நம்பிக்கையும் நேரந்தவறாமையும்",
      about_p1: "செல்வமாதா டிரான்ஸ்போர்ட் 1998 ஆம் ஆண்டு எஸ். சேவியர் அவர்களால் தொடங்கப்பட்டது. சரியான நேரத்தில் பாதுகாப்பாக சரக்குகளை சேர்ப்பதே எங்கள் குறிக்கோள்.",
      about_quote: "“எதையும், எங்கும், எப்போதும் — சரியான நேரத்தில் கொண்டு சேர்ப்போம்.”",
      about_p2: "தற்போது அவரது சகோதரர்கள் எஸ். இன்னாசிமுத்து & எஸ். மைக்கேல் (செல்வமாதாவின் இரண்டு தூண்கள்) வெற்றிகரமாக நடத்தி வருகின்றனர்.",
      about_partner: "எங்கள் வளர்ச்சிக்கு உறுதுணையாக இருந்த ஏ.கே.என் (AKN) மாடர்ன் ரைஸ் மில் ஜான் அவர்களுக்கு மனமார்ந்த நன்றிகள்.",
      role_founder: "நிறுவனர் (1998)",
      role_directors: "இரண்டு தூண்கள் & இயக்குனர்கள்",
      sec_quote_tag: "எளிய முன்பதிவு",
      sec_quote_title: "கட்டண விபரம் & உடனடி முன்பதிவு",
      sec_quote_desc: "வாட்ஸ்அப் மூலமாக எளிதாக முன்பதிவு செய்யுங்கள்.",
      quote_box_title: "⚡ உடனடி வாட்ஸ்அப் முன்பதிவு",
      quote_box_desc: "ஊர் மற்றும் சரக்கு விபரத்தை தட்டச்சு செய்யவும்.",
      lbl_origin: "ஏற்றும் ஊர் (தமிழ்நாடு)",
      lbl_dest: "இறக்கும் ஊர் (கேரளா)",
      lbl_cargo: "சரக்கு வகை",
      lbl_weight: "எடை அளவு",
      btn_send_whatsapp: "வாட்ஸ்அப்பில் முன்பதிவு செய்ய கிளிக் செய்க",
      btn_open_feedback: "📋 கருத்து அல்லது புகார் படிவத்தை திறக்க கிளிக் செய்க",
      sec_contact_tag: "தொடர்புக்கு",
      sec_contact_title: "எங்களை தொடர்பு கொள்ளுங்கள்",
      sec_contact_desc: "எஸ். மைக்கேல் மற்றும் புக்கிங் அலுவலகத்தை நேரடியாக தொடர்பு கொள்ளவும்.",
      contact_phones_title: "தொலைபேசி எண்கள்",
      contact_email_title: "அதிகாரப்பூர்வ மின்னஞ்சல்",
      contact_office_title: "கிளை அலுவலக முகவரி",
      footer_about: "தமிழ்நாடு மற்றும் கேரளாவை இணைக்கும் முன்னணி லாரி போக்குவரத்து நிறுவனம்.",
      footer_designed: "வடிவமைப்பு:"
    },
    ml: {
      nav_home: "ഹോം",
      nav_services: "സേവനങ്ങൾ",
      nav_about_fleet: "ഞങ്ങളെക്കുറിച്ച് & ഫ്ലീറ്റ്",
      nav_quote: "ബുക്കിംഗ്",
      nav_contact: "ബന്ധപ്പെടുക",
      hero_tag: "1998 മുതൽ പ്രതിദിന ലോറി സർവീസ്",
      hero_title_1: "സുരക്ഷിതവും വേഗമേറിയതുമായ ഗതാഗതം",
      hero_title_2: "തമിഴ്‌നാട് ⇄ കേരളം",
      hero_desc: "ഏതൊരു ചരക്കും കൃത്യസമയത്ത് സുരക്ഷിതമായി എത്തിക്കുന്നു. 15+ അശോക് ലെയ്‌ലാൻഡ് ലോറികൾ, 35+ പരിചയസമ്പന്നരായ ഡ്രൈവർമാർ, 24/7 ബുക്കിംഗ്.",
      hero_btn_quote: "വാട്ട്‌സ്ആപ്പിൽ ബുക്ക് ചെയ്യുക",
      hero_btn_call: "ഡെസ്കിലേക്ക് വിളിക്കുക: 9487366449",
      stat_years: "25+ വർഷം",
      stat_years_lbl: "വിശ്വസ്ത സേവനം",
      stat_trucks: "15+ ലോറികൾ",
      stat_trucks_lbl: "അശോക് ലെയ്‌ലാൻഡ് ഫ്ലീറ്റ്",
      stat_staff: "35+ ജീവനക്കാർ",
      stat_staff_lbl: "പരിചയസമ്പന്നർ",
      stat_service: "24/7 മണിക്കൂർ",
      stat_service_lbl: "പ്രതിദിന സർവീസ്",
      caption_route: "അശോക് ലെയ്‌ലാൻഡ് ലോറി • പ്രതിദിന സർവീസ്",
      caption_status: "പ്രതിദിന സർവീസ് സജീവം",
      corridor_text: " തമിഴ്‌നാട് ⇄ കേരളം സർവീസുകൾ. തമിഴ്‌നാട്ടിലും കേരളത്തിലും എവിടെനിന്നും ചരക്കുകൾ കയറ്റുകയും ഇറക്കുകയും ചെയ്യുന്നു. കുറഞ്ഞ ചെലവിൽ മൾട്ടിപ്പിൾ പിക്കപ്പും മൾട്ടിപ്പിൾ ഡെലിവറിയും ലഭ്യമാണ്.",
      sec_services_tag: "ഞങ്ങളുടെ സേവനങ്ങൾ",
      sec_services_title: "സുരക്ഷിതവും വിശ്വസനീയവുമായ സേവനങ്ങൾ",
      sec_services_desc: "സുതാര്യമായ നിരക്കുകളിൽ മികച്ച സേവനങ്ങൾ തിരഞ്ഞെടുക്കുക.",
      srv_1_title: "ഫുൾ ട്രക്ക് ലോഡ് (FTL)",
      srv_1_desc: "നിങ്ങളുടെ ചരക്കുകൾക്കായി മാത്രം പ്രത്യേക ലോറി. നേരിട്ട് منزلത്തിൽ എത്തിക്കുന്നു.",
      srv_2_title: "പാർട്ട് ലോഡ് സർവീസ് (LTL)",
      srv_2_desc: "കുറഞ്ഞ അളവിലുള്ള ചരക്കുകൾക്കും മിതമായ നിരക്കിൽ വേഗത്തിലുള്ള സർവീസ്.",
      srv_3_title: "ലളിതമായ ലോറി വാടക",
      srv_3_desc: "എപ്പോൾ വേണമെങ്കിലും എവിടെ വേണമെങ്കിലും ഓൺലൈനായി എളുപ്പത്തിൽ ബുക്ക് ചെയ്യാം.",
      srv_4_title: "സുതാര്യമായ നിരക്കുകൾ",
      srv_4_desc: "മറഞ്ഞിരിക്കുന്ന ചെലവുകളില്ലാതെ ഏറ്റവും കുറഞ്ഞ നിരക്കുകൾ.",
      srv_5_title: "സുരക്ഷിതമായ ലോറികൾ",
      srv_5_desc: "മികച്ച ഡ്രൈവർമാരും മഴയിൽ നനയാത്ത ത്രിബിൾ ടാർപോളിൻ സംരക്ഷണവും.",
      sec_fleet_tag: "ഫ്ലീറ്റ് & ചരിത്രം",
      sec_fleet_title: "അശോക് ലെയ്‌ലാൻഡ് ലോറികൾ & ചരിത്രം",
      sec_fleet_desc: "10 മുതൽ 25 ടൺ വരെ ഭാരം വഹിക്കാൻ ശേഷിയുള്ള അശോക് ലെയ്‌ലാൻഡ് വാഹനങ്ങൾ.",
      fleet_caption_title: "സെൽവമാതാ & പൊൻകനി ലോറികൾ",
      fleet_caption_sub: "മികച്ച രീതിയിൽ പരിപാലിക്കുന്ന ഹൈവേ ലോറികൾ.",
      about_sub_title: "വിശ്വാസ്യതയും കൃത്യനിഷ്ഠയും",
      about_p1: "1998-ൽ എസ്. സേവ്യർ സ്ഥാപിച്ചതാണ് സെൽവമാതാ ട്രാൻസ്പോർട്ട്. ചരക്കുകൾ സുരക്ഷിതമായി കൃത്യസമയത്ത് എത്തിക്കുക എന്നതാണ് ഞങ്ങളുടെ ലക്ഷ്യം.",
      about_quote: "“എന്തും, എവിടെയും, എപ്പോഴും — കൃത്യസമയത്ത് എത്തിക്കും.”",
      about_p2: "ഇന്ന് അദ്ദേഹത്തിന്റെ സഹോദരന്മാരായ എസ്. ഇന്നസിമുത്തു, എസ്. മൈക്കിൾ എന്നിവർ വിജയകരമായി നയിക്കുന്നു.",
      about_partner: "ഞങ്ങളുടെ വളർച്ചയിൽ കൂടെനിന്ന AKN മോഡേൺ റൈസ് മിൽ ജോണിന് പ്രത്യേക നന്ദി.",
      role_founder: "സ്ഥാപകൻ (1998)",
      role_directors: "ഡയറക്ടർമാർ",
      sec_quote_tag: "എളുപ്പത്തിൽ ബുക്കിംഗ്",
      sec_quote_title: "നിരക്കുകൾ അറിയാനും ബുക്ക് ചെയ്യാനും",
      sec_quote_desc: "വാട്ട്‌സ്ആപ്പ് വഴി വേഗത്തിൽ ബുക്ക് ചെയ്യുക.",
      quote_box_title: "⚡ തത്സമയ വാട്ട്‌സ്ആപ്പ് ബുക്കിംഗ്",
      quote_box_desc: "റൂട്ടും ഭാരവും ടൈപ്പ് ചെയ്യുക.",
      lbl_origin: "കയറ്റുന്ന സ്ഥലം (തമിഴ്‌നാട്)",
      lbl_dest: "ഇറക്കുന്ന സ്ഥലം (കേരളം)",
      lbl_cargo: "ചരക്ക് ഇനം",
      lbl_weight: "ഭാരം",
      btn_send_whatsapp: "വാട്ട്‌സ്ആപ്പിൽ ബുക്കിംഗ് സന്ദേശം അയക്കുക",
      btn_open_feedback: "📋 ഫീഡ്‌ബാക്ക് ഫോം തുറക്കാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക",
      sec_contact_tag: "ബന്ധപ്പെടുക",
      sec_contact_title: "ബുക്കിംഗ് ഡെസ്കിലേക്ക് ബന്ധപ്പെടുക",
      sec_contact_desc: "എസ്. മൈക്കിൾ എന്നിവരെ നേരിട്ട് ബന്ധപ്പെടാം.",
      contact_phones_title: "ഫോൺ നമ്പറുകൾ",
      contact_email_title: "ഔദ്യോഗിക ഇമെയിൽ",
      contact_office_title: "ഓഫീസ് വിലാസം",
      footer_about: "തമിഴ്‌നാടും കേരളവും തമ്മിൽ ബന്ധിപ്പിക്കുന്ന പ്രമുഖ ലോറി ഗതാഗത സർവീസ്.",
      footer_designed: "ഡിസൈൻ ചെയ്തത്:"
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
  const quoteOrigin = document.getElementById('quoteOrigin');
  const quoteDest = document.getElementById('quoteDest');
  const quoteCargo = document.getElementById('quoteCargo');
  const quoteWeight = document.getElementById('quoteWeight');
  const calcRoute = document.getElementById('calcRoute');
  const btnWhatsappSubmit = document.getElementById('btnWhatsappSubmit');

  function updateRouteCalc() {
    if (!quoteOrigin || !quoteDest || !calcRoute) return;
    const o = quoteOrigin.value.trim() || 'Origin';
    const d = quoteDest.value.trim() || 'Destination';
    calcRoute.textContent = `${o} ➔ ${d}`;
  }

  if (quoteOrigin && quoteDest) {
    quoteOrigin.addEventListener('input', updateRouteCalc);
    quoteDest.addEventListener('input', updateRouteCalc);
    updateRouteCalc();
  }

  if (btnWhatsappSubmit) {
    btnWhatsappSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const o = quoteOrigin && quoteOrigin.value.trim() ? quoteOrigin.value.trim() : 'Tenkasi';
      const d = quoteDest && quoteDest.value.trim() ? quoteDest.value.trim() : 'Kochi';
      const cargo = quoteCargo && quoteCargo.value.trim() ? quoteCargo.value.trim() : 'General Goods / Freight';
      const w = quoteWeight ? quoteWeight.value : '10-16 Tons';

      const msg = `*SELVAMATHA TRANSPORT - TRUCK BOOKING INQUIRY*%0A` +
        `----------------------------------------%0A` +
        `📍 *Pickup Location:* ${encodeURIComponent(o)}%0A` +
        `🏁 *Delivery Location:* ${encodeURIComponent(d)}%0A` +
        `📦 *Cargo Details:* ${encodeURIComponent(cargo)}%0A` +
        `⚖️ *Weight:* ${encodeURIComponent(w)}%0A` +
        `----------------------------------------%0A` +
        `Please send available truck & best rate.`;

      const waUrl = `https://wa.me/919487366449?text=${msg}`;

      if (window.SelvamathaAnalytics) {
        window.SelvamathaAnalytics.sendCustomEvent('whatsapp_booking_click', { o, d, cargo, w });
      }

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
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
});
