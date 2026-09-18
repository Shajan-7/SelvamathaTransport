/**
 * ==============================================================================
 * SELVAMATHA TRANSPORT - MAIN INTERACTIVE CONTROLLER
 * Features: Rolls-Royce Magnetic Cursor, GSAP/Lenis Smooth Scroll,
 * Multi-Language (EN/TA/ML), Light/Dark Theme, WhatsApp Booking
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

      // Direct instant dot positioning
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Silky lerp loop for the outer ring (spring inertia)
    function renderLuxuryCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderLuxuryCursor);
    }
    requestAnimationFrame(renderLuxuryCursor);

    // Hover expansions on interactive elements
    const hoverSelectors = 'a, button, input, select, textarea, .interactive, .service-card, .founder-card, .phone-btn';
    const interactiveElements = document.querySelectorAll(hoverSelectors);

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });

    // Tactile click press
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
        // Moon icon for switching to dark
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        // Sun icon for switching to light
        themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
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
      nav_corridors: "Daily Routes",
      nav_services: "Services",
      nav_fleet: "Our Trucks",
      nav_heritage: "Our Story",
      nav_quote: "Book Online",
      nav_contact: "Contact",
      hero_tag: "Daily Lorry Service Since 1998",
      hero_title_1: "Safe & Fast Lorry Transport",
      hero_title_2: "Tamil Nadu 🔁 Kerala",
      hero_desc: "Send anything, anywhere, anytime — on correct time. Operating 15+ heavy Ashok Leyland trucks, 35+ experienced crew, and 24/7 booking support for 25+ years.",
      hero_btn_quote: "Book on WhatsApp",
      hero_btn_call: "Call Dispatch Desk",
      stat_years: "25+ Years",
      stat_years_lbl: "Trusted Service",
      stat_trucks: "15+ Lorries",
      stat_trucks_lbl: "Ashok Leyland Fleet",
      stat_staff: "35+ Crew",
      stat_staff_lbl: "Experienced Drivers",
      stat_service: "24/7 Hours",
      stat_service_lbl: "Daily Regular Trips",
      caption_route: "Tenkasi • Madurai 🔁 Kollam • Kochi",
      caption_status: "Daily Active Service",
      sec_corridors_tag: "Regular Routes",
      sec_corridors_title: "Tamil Nadu 🔁 Kerala Daily Lines",
      sec_corridors_desc: "Direct point-to-point lorry services without transit delays or goods handling damage.",
      tn_hubs: "Tamil Nadu Hubs",
      kl_hubs: "Kerala Hubs",
      corridor_daily: "Daily Direct Line",
      sec_services_tag: "What We Offer",
      sec_services_title: "Simple, Safe & Reliable Freight",
      sec_services_desc: "Choose the service you need with transparent pricing and full cargo safety.",
      srv_1_title: "Full Truck Load (FTL)",
      srv_1_desc: "Dedicated lorry just for your load. Direct from pickup point to delivery destination with zero delay.",
      srv_2_title: "Daily Kerala Linehaul",
      srv_2_desc: "Regular daily trips linking Tenkasi, Madurai, and all Tamil Nadu towns with major Kerala commercial centers.",
      srv_3_title: "Rice Mill & Agro Transport",
      srv_3_desc: "Specialized grain, paddy, and rice haulage with waterproof triple-tarpaulin protection. Trusted partner of AKN Modern Rice Mill.",
      srv_4_title: "24/7 Quick Booking",
      srv_4_desc: "Immediate truck allocation and transparent pricing. Call or WhatsApp our dispatchers anytime.",
      sec_fleet_tag: "Heavy Fleet",
      sec_fleet_title: "Our Ashok Leyland Lorries",
      sec_fleet_desc: "Equipped with strong 10-wheel and multi-axle Ashok Leyland trucks carrying 10 to 25 Tons safely.",
      fleet_caption_title: "Selvamatha & Ponkani Heavy Fleet",
      fleet_caption_sub: "Maintained in top running condition with experienced highway drivers.",
      sec_about_tag: "Our History",
      sec_about_title: "Founded on Trust & Timeliness",
      about_p1: "Selvamatha Transport was founded by S. Xavier in 1998. He started this company with one simple commitment: deliver every product safely, securely, and at the correct time.",
      about_quote: "“Send anything, anywhere, anytime at correct TIME.”",
      about_p2: "Today, his brothers S. Innasimuthu & S. Micheal — the Two Pillars of Selvamatha Transport — manage daily operations across Tamil Nadu and Kerala.",
      about_partner: "Special thanks to John & AKN Modern Rice Mill for their continuous trust in our journey.",
      role_founder: "Founder (1998)",
      role_directors: "Two Pillars & Directors",
      sec_quote_tag: "Easy Booking",
      sec_quote_title: "Get Instant Quote & Book",
      sec_quote_desc: "Pick your route below to book instantly via WhatsApp, or submit corporate inquiry form.",
      quote_box_title: "⚡ Instant WhatsApp Booking",
      quote_box_desc: "Select your route and cargo for immediate availability.",
      lbl_origin: "Pickup Town (Tamil Nadu)",
      lbl_dest: "Delivery Town (Kerala)",
      lbl_cargo: "Cargo / Goods Type",
      lbl_weight: "Estimated Weight",
      btn_send_whatsapp: "Send Booking Request on WhatsApp",
      sec_contact_tag: "Reach Us",
      sec_contact_title: "Contact Our Booking Desk",
      sec_contact_desc: "Speak directly with our directors Mr. S. Micheal and dispatchers.",
      contact_phones_title: "Dispatch Phone Numbers",
      contact_email_title: "Official Email",
      contact_office_title: "Branch Office Location",
      footer_about: "Premier heavy truck transportation connecting Tamil Nadu and Kerala with safe, fast, and transparent service.",
      footer_designed: "Designed by"
    },
    ta: {
      nav_home: "முகப்பு",
      nav_corridors: "பாதைகள்",
      nav_services: "சேவைகள்",
      nav_fleet: "லாரிகள்",
      nav_heritage: "வரலாறு",
      nav_quote: "முன்பதிவு",
      nav_contact: "தொடர்பு",
      hero_tag: "1998 முதல் தினசரி லாரி சேவை",
      hero_title_1: "பாதுகாப்பான & வேகமான லாரி போக்குவரத்து",
      hero_title_2: "தமிழ்நாடு 🔁 கேரளா",
      hero_desc: "எதையும், எங்கும், எப்போதும் — சரியான நேரத்தில் கொண்டு சேர்ப்போம். 15+ அசோக் லேலண்ட் லாரிகள், 35+ அனுபவமிக்க ஓட்டுநர்கள், 24/7 முன்பதிவு வசதி.",
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
      caption_route: "தென்காசி • மதுரை 🔁 கொல்லம் • கொச்சி",
      caption_status: "தினசரி இயங்கும் சேவை",
      sec_corridors_tag: "முக்கிய பாதைகள்",
      sec_corridors_title: "தமிழ்நாடு 🔁 கேரளா தினசரி சேவை",
      sec_corridors_desc: "எந்தவித தாமதமும் இன்றி உங்கள் சரக்குகளை நேரடியாக கொண்டு சேர்க்கிறோம்.",
      tn_hubs: "தமிழ்நாடு பகுதிகள்",
      kl_hubs: "கேரளா பகுதிகள்",
      corridor_daily: "தினசரி நேரடி சேவை",
      sec_services_tag: "எங்கள் சேவைகள்",
      sec_services_title: "பாதுகாப்பான & நம்பகமான போக்குவரத்து",
      sec_services_desc: "வெளிப்படையான கட்டணத்துடன் உங்களுக்கு தேவையான சேவையை தேர்வு செய்யுங்கள்.",
      srv_1_title: "முழு லாரி சுமை (FTL)",
      srv_1_desc: "உங்கள் சரக்குக்கு மட்டும் தனி லாரி ஒதுக்கீடு. ஏற்றுமிடத்திலிருந்து இறங்குமிடம் வரை நேரடி பயணம்.",
      srv_2_title: "தினசரி கேரளா லைன்ஹால்",
      srv_2_desc: "தென்காசி, மதுரை மற்றும் தமிழக பகுதிகளை கேரளாவின் முக்கிய வணிக நகரங்களுடன் இணைக்கும் தினசரி சேவை.",
      srv_3_title: "அரிசி ஆலை & விவசாய சரக்குகள்",
      srv_3_desc: "மூன்று அடுக்கு தார்ப்பாய் பாதுகாப்புடன் நெல், அரிசி மூட்டைகள் பாதுகாப்புடன் கொண்டு செல்லப்படுகிறது. AKN ரைஸ் மில்லின் பெருமைமிகு பங்குதாரர்.",
      srv_4_title: "24/7 உடனடி முன்பதிவு",
      srv_4_desc: "எப்போதும் கிடைக்கும் லாரிகள் மற்றும் உடனடி கட்டண விபரம். வாட்ஸ்அப் அல்லது போன் மூலம் தொடர்பு கொள்ளுங்கள்.",
      sec_fleet_tag: "எங்கள் லாரிகள்",
      sec_fleet_title: "அசோக் லேலண்ட் லாரிகள்",
      sec_fleet_desc: "10 டன் முதல் 25 டன் வரை தாங்கும் வலிமைமிக்க அசோக் லேலண்ட் வாகனங்கள்.",
      fleet_caption_title: "செல்வமாதா & பொன்கனி லாரிகள்",
      fleet_caption_sub: "சிறந்த முறையில் பராமரிக்கப்படும் அதிநவீன நெடுஞ்சாலை லாரிகள்.",
      sec_about_tag: "எங்கள் வரலாறு",
      sec_about_title: "நம்பிக்கையும் நேரந்தவறாமையும்",
      about_p1: "செல்வமாதா டிரான்ஸ்போர்ட் 1998 ஆம் ஆண்டு எஸ். சேவியர் அவர்களால் தொடங்கப்பட்டது. சரியான நேரத்தில் பாதுகாப்பாக சரக்குகளை சேர்ப்பதே எங்கள் குறிக்கோள்.",
      about_quote: "“எதையும், எங்கும், எப்போதும் — சரியான நேரத்தில் கொண்டு சேர்ப்போம்.”",
      about_p2: "தற்போது அவரது சகோதரர்கள் எஸ். இன்னாசிமுத்து & எஸ். மைக்கேல் — செல்வமாதாவின் இரண்டு தூண்களாக வெற்றிகரமாக நடத்தி வருகின்றனர்.",
      about_partner: "எங்கள் வளர்ச்சிக்கு உறுதுணையாக இருந்த ஏ.கே.என் (AKN) மாடர்ன் ரைஸ் மில் ஜான் அவர்களுக்கு மனமார்ந்த நன்றிகள்.",
      role_founder: "நிறுவனர் (1998)",
      role_directors: "இரண்டு தூண்கள் & இயக்குனர்கள்",
      sec_quote_tag: "எளிய முன்பதிவு",
      sec_quote_title: "கட்டண விபரம் & உடனடி முன்பதிவு",
      sec_quote_desc: "வாட்ஸ்அப் மூலமாக எளிதாக முன்பதிவு செய்யுங்கள்.",
      quote_box_title: "⚡ உடனடி வாட்ஸ்அப் முன்பதிவு",
      quote_box_desc: "ஊர் மற்றும் சரக்கு விபரத்தை தேர்வு செய்யவும்.",
      lbl_origin: "ஏற்றும் இடம் (தமிழ்நாடு)",
      lbl_dest: "இறக்கும் இடம் (கேரளா)",
      lbl_cargo: "சரக்கு வகை",
      lbl_weight: "எடை அளவு",
      btn_send_whatsapp: "வாட்ஸ்அப்பில் முன்பதிவு செய்ய கிளிக் செய்க",
      sec_contact_tag: "தொடர்புக்கு",
      sec_contact_title: "எங்களை தொடர்பு கொள்ளுங்கள்",
      sec_contact_desc: "எஸ். மைக்கேல் மற்றும் புக்கிங் அலுவலகத்தை நேரடியாக தொடர்பு கொள்ளவும்.",
      contact_phones_title: "தொலைபேசி எண்கள்",
      contact_email_title: "மின்னஞ்சல் முகவரி",
      contact_office_title: "கிளை அலுவலக முகவரி",
      footer_about: "தமிழ்நாடு மற்றும் கேரளாவை இணைக்கும் முன்னணி லாரி போக்குவரத்து நிறுவனம்.",
      footer_designed: "வடிவமைப்பு:"
    },
    ml: {
      nav_home: "ഹോം",
      nav_corridors: "റൂട്ടുകൾ",
      nav_services: "സേവനങ്ങൾ",
      nav_fleet: "ലോറികൾ",
      nav_heritage: "ചരിത്രം",
      nav_quote: "ബുക്കിംഗ്",
      nav_contact: "ബന്ധപ്പെടുക",
      hero_tag: "1998 മുതൽ പ്രതിദിന ലോറി സർവീസ്",
      hero_title_1: "സുരക്ഷിതവും വേഗമേറിയതുമായ ഗതാഗതം",
      hero_title_2: "തമിഴ്‌നാട് 🔁 കേരളം",
      hero_desc: "ഏതൊരു ചരക്കും കൃത്യസമയത്ത് സുരക്ഷിതമായി എത്തിക്കുന്നു. 15+ അശോക് ലെയ്‌ലാൻഡ് ലോറികൾ, 35+ പരിചയസമ്പന്നരായ ഡ്രൈവർമാർ, 24/7 ബുക്കിംഗ്.",
      hero_btn_quote: "വാട്ട്‌സ്ആപ്പിൽ ബുക്ക് ചെയ്യുക",
      hero_btn_call: "ഡെസ്കിലേക്ക് വിളിക്കുക",
      stat_years: "25+ വർഷം",
      stat_years_lbl: "വിശ്വസ്ത സേവനം",
      stat_trucks: "15+ ലോറികൾ",
      stat_trucks_lbl: "അശോക് ലെയ്‌ലാൻഡ് ഫ്ലീറ്റ്",
      stat_staff: "35+ ജീവനക്കാർ",
      stat_staff_lbl: "പരിചയസമ്പന്നർ",
      stat_service: "24/7 മണിക്കൂർ",
      stat_service_lbl: "പ്രതിദിന സർവീസ്",
      caption_route: "തെങ്കാശി • മധുര 🔁 കൊല്ലം • കൊച്ചി",
      caption_status: "പ്രതിദിന സർവീസ് സജീവം",
      sec_corridors_tag: "പ്രധാന റൂട്ടുകൾ",
      sec_corridors_title: "തമിഴ്‌നാട് 🔁 കേരളം പ്രതിദിന സർവീസ്",
      sec_corridors_desc: "കാലതാമസമില്ലാതെ ചരക്കുകൾ നേരിട്ട് സുരക്ഷിതമായി എത്തിക്കുന്നു.",
      tn_hubs: "തമിഴ്‌നാട് ഹബ്ബുകൾ",
      kl_hubs: "കേരള ഹബ്ബുകൾ",
      corridor_daily: "പ്രതിദിന നേരിട്ടുള്ള സർവീസ്",
      sec_services_tag: "ഞങ്ങളുടെ സേവനങ്ങൾ",
      sec_services_title: "സുരക്ഷിതവും വിശ്വസനീയവുമായ സേവനങ്ങൾ",
      sec_services_desc: "സുതാര്യമായ നിരക്കുകളിൽ മികച്ച സേവനങ്ങൾ തിരഞ്ഞെടുക്കുക.",
      srv_1_title: "ഫുൾ ട്രക്ക് ലോഡ് (FTL)",
      srv_1_desc: "നിങ്ങളുടെ ചരക്കുകൾക്കായി മാത്രം പ്രത്യേക ലോറി. നേരിട്ട് منزلത്തിൽ എത്തിക്കുന്നു.",
      srv_2_title: "പ്രതിദിന കേരള ലൈൻഹോൾ",
      srv_2_desc: "തെങ്കാശി, മധുര എന്നിവയെ കേരളത്തിലെ പ്രധാന വാണിജ്യ കേന്ദ്രങ്ങളുമായി ബന്ധിപ്പിക്കുന്ന പ്രതിദിന സർവീസ്.",
      srv_3_title: "റൈസ് മിൽ & കാർഷിക ചരക്കുകൾ",
      srv_3_desc: "മഴയിൽ നനയാത്ത ത്രിബിൾ ടാർപോളിൻ സംരക്ഷണത്തോടെ അരി, നെല്ല് കൊണ്ടുപോകുന്നു. AKN റൈസ് മില്ലിന്റെ പങ്കാളി.",
      srv_4_title: "24/7 വേഗത്തിലുള്ള ബുക്കിംഗ്",
      srv_4_desc: "എപ്പോഴും ലഭ്യമായ ലോറികളും സുതാര്യമായ നിരക്കുകളും.",
      sec_fleet_tag: "ഞങ്ങളുടെ ലോറികൾ",
      sec_fleet_title: "അശോക് ലെയ്‌ലാൻഡ് ലോറികൾ",
      sec_fleet_desc: "10 മുതൽ 25 ടൺ വരെ ഭാരം വഹിക്കാൻ ശേഷിയുള്ള അശോക് ലെയ്‌ലാൻഡ് വാഹനങ്ങൾ.",
      fleet_caption_title: "സെൽവമാതാ & പൊൻകനി ലോറികൾ",
      fleet_caption_sub: "മികച്ച രീതിയിൽ പരിപാലിക്കുന്ന ഹൈവേ ലോറികൾ.",
      sec_about_tag: "ഞങ്ങളുടെ ചരിത്രം",
      sec_about_title: "വിശ്വാസ്യതയും കൃത്യനിഷ്ഠയും",
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
      quote_box_desc: "റൂട്ടും ഭാരവും തിരഞ്ഞെടുക്കുക.",
      lbl_origin: "കയറ്റുന്ന സ്ഥലം (തമിഴ്‌നാട്)",
      lbl_dest: "ഇറക്കുന്ന സ്ഥലം (കേരളം)",
      lbl_cargo: "ചരക്ക് ഇനം",
      lbl_weight: "ഭാരം",
      btn_send_whatsapp: "വാട്ട്‌സ്ആപ്പിൽ ബുക്കിംഗ് സന്ദേശം അയക്കുക",
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

    // Update document lang attribute
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
     6. FAST QUOTE & WHATSAPP DISPATCHER
     ============================================================================ */
  const quoteOrigin = document.getElementById('quoteOrigin');
  const quoteDest = document.getElementById('quoteDest');
  const quoteCargo = document.getElementById('quoteCargo');
  const quoteWeight = document.getElementById('quoteWeight');
  const calcRoute = document.getElementById('calcRoute');
  const calcTime = document.getElementById('calcTime');
  const btnWhatsappSubmit = document.getElementById('btnWhatsappSubmit');

  const routeTimes = {
    'Tenkasi-Kollam': 'Approx 3-4 hrs (Same Day)',
    'Tenkasi-Kochi': 'Overnight Express (8 hrs)',
    'Tenkasi-Trivandrum': 'Approx 4 hrs (Same Day)',
    'Tenkasi-Palakkad': 'Overnight (7 hrs)',
    'Madurai-Kochi': 'Overnight Express (7 hrs)',
    'Coimbatore-Kochi': 'Same-Day (Approx 5 hrs)'
  };

  function updateRouteCalc() {
    if (!quoteOrigin || !quoteDest) return;
    const o = quoteOrigin.value;
    const d = quoteDest.value;
    if (calcRoute) calcRoute.textContent = `${o} ➔ ${d}`;
    if (calcTime) calcTime.textContent = routeTimes[`${o}-${d}`] || 'Direct Line: 6-10 hrs';
  }

  if (quoteOrigin && quoteDest) {
    quoteOrigin.addEventListener('change', updateRouteCalc);
    quoteDest.addEventListener('change', updateRouteCalc);
    updateRouteCalc();
  }

  if (btnWhatsappSubmit) {
    btnWhatsappSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const o = quoteOrigin ? quoteOrigin.value : 'Tenkasi';
      const d = quoteDest ? quoteDest.value : 'Kochi';
      const cargo = quoteCargo && quoteCargo.value.trim() ? quoteCargo.value.trim() : 'General Goods / Freight';
      const w = quoteWeight ? quoteWeight.value : '10-15 Tons';

      const msg = `*SELVAMATHA TRANSPORT - TRUCK BOOKING INQUIRY*%0A` +
        `----------------------------------------%0A` +
        `📍 *Pickup:* ${encodeURIComponent(o)}%0A` +
        `🏁 *Destination:* ${encodeURIComponent(d)}%0A` +
        `📦 *Cargo:* ${encodeURIComponent(cargo)}%0A` +
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
});
