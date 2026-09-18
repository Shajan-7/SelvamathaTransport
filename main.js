/**
 * ==============================================================================
 * SELVAMATHA TRANSPORT - MAIN INTERACTIVE CONTROLLER
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Check if device supports fine pointer (mouse / trackpad)
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ============================================================================
     A. CUSTOM STEERING WHEEL CURSOR
     ============================================================================ */
  const cursorFollower = document.getElementById('customCursorFollower');
  const cursorDot = document.getElementById('customCursorDot');

  if (isFinePointer && cursorFollower && cursorDot) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let targetAngle = 0;
    let currentAngle = 0;
    let isMoving = false;
    let moveTimeout;

    // Show cursor elements once initial mousemove occurs
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorFollower.classList.contains('is-active')) {
        cursorFollower.classList.add('is-active');
        cursorDot.classList.add('is-active');
      }

      // Calculate steering wheel angular tilt based on horizontal velocity
      const deltaX = e.movementX || 0;
      targetAngle = Math.max(-45, Math.min(45, deltaX * 3.5));

      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
        targetAngle = 0;
      }, 120);

      // Direct dot positioning
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth Lerp loop for trailing steering wheel
    function renderCursor() {
      // Linear interpolation (lerp factor 0.18 for silky responsiveness)
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      currentAngle += (targetAngle - currentAngle) * 0.14;

      cursorFollower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentAngle}deg)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements (expand wheel on hover)
    const hoverTargets = document.querySelectorAll(
      'a, button, input, select, textarea, .interactive, .service-card, .btn-primary, .btn-secondary, .phone-badge'
    );

    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('is-hovering');
      });
      target.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('is-hovering');
      });
    });

    // Mousedown click feedback
    window.addEventListener('mousedown', () => {
      cursorFollower.classList.add('is-clicking');
    });
    window.addEventListener('mouseup', () => {
      cursorFollower.classList.remove('is-clicking');
    });
  }

  /* ============================================================================
     B. STICKY NAVBAR BLUR ON SCROLL
     ============================================================================ */
  const header = document.getElementById('siteHeader');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ============================================================================
     C. MOBILE DRAWER NAVIGATION
     ============================================================================ */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Toggle hamburger / close icon
      const icon = mobileToggle.querySelector('svg');
      if (isOpen) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
      }
    });

    // Close menu when clicking any navigation link
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
     D. INSTANT ROUTE QUOTE & WHATSAPP DISPATCHER
     ============================================================================ */
  const originSelect = document.getElementById('quoteOrigin');
  const destSelect = document.getElementById('quoteDest');
  const cargoTypeInput = document.getElementById('quoteCargo');
  const weightSelect = document.getElementById('quoteWeight');
  const truckTypeSelect = document.getElementById('quoteTruck');
  const previewSummary = document.getElementById('previewRouteSummary');
  const previewTransit = document.getElementById('previewTransitTime');
  const btnWhatsappDispatch = document.getElementById('btnWhatsappDispatch');

  // Approximate distance / transit time matrix
  const transitTimes = {
    'Tenkasi-Kollam': 'Same-Day (Approx 3-4 hrs)',
    'Tenkasi-Kochi': 'Overnight / 8 hrs Express',
    'Tenkasi-Thiruvananthapuram': 'Same-Day (Approx 4 hrs)',
    'Tenkasi-Palakkad': 'Overnight / 7 hrs',
    'Madurai-Kochi': 'Overnight / 7 hrs Express',
    'Coimbatore-Kochi': 'Same-Day (Approx 5 hrs)',
    'Tirunelveli-Kollam': 'Same-Day (Approx 4-5 hrs)'
  };

  function updateQuotePreview() {
    if (!originSelect || !destSelect) return;
    const origin = originSelect.value;
    const dest = destSelect.value;
    const key1 = `${origin}-${dest}`;

    const estTime = transitTimes[key1] || 'Direct Linehaul: 6-12 hrs Transit';
    if (previewSummary) {
      previewSummary.innerHTML = `Corridor: <strong>${origin} ➔ ${dest}</strong>`;
    }
    if (previewTransit) {
      previewTransit.textContent = estTime;
    }
  }

  if (originSelect && destSelect) {
    originSelect.addEventListener('change', updateQuotePreview);
    destSelect.addEventListener('change', updateQuotePreview);
    updateQuotePreview();
  }

  if (btnWhatsappDispatch) {
    btnWhatsappDispatch.addEventListener('click', (e) => {
      e.preventDefault();
      const origin = originSelect ? originSelect.value : 'Tenkasi';
      const dest = destSelect ? destSelect.value : 'Kochi';
      const cargo = cargoTypeInput && cargoTypeInput.value.trim() ? cargoTypeInput.value.trim() : 'General Freight / Commercial Goods';
      const weight = weightSelect ? weightSelect.value : '10-15 Tons';
      const truck = truckTypeSelect ? truckTypeSelect.value : 'Heavy Duty Open-Top Lorry';

      // Build structured WhatsApp message
      const text = `*SELVAMATHA TRANSPORT - FREIGHT BOOKING INQUIRY*%0A` +
        `----------------------------------------%0A` +
        `📍 *Pickup Origin:* ${encodeURIComponent(origin)}%0A` +
        `🏁 *Destination:* ${encodeURIComponent(dest)}%0A` +
        `📦 *Cargo Details:* ${encodeURIComponent(cargo)}%0A` +
        `⚖️ *Estimated Weight:* ${encodeURIComponent(weight)}%0A` +
        `🚛 *Preferred Fleet:* ${encodeURIComponent(truck)}%0A` +
        `----------------------------------------%0A` +
        `Please provide availability & immediate freight quotation.`;

      const whatsappUrl = `https://wa.me/919487366449?text=${text}`;
      
      // Log custom conversion event silently to analytics if available
      if (window.SelvamathaAnalytics) {
        window.SelvamathaAnalytics.sendCustomEvent('whatsapp_quote_inquiry', {
          origin,
          dest,
          cargo,
          weight,
          truck
        });
      }

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* ============================================================================
     E. GOOGLE FORM SKELETON DISMISSER
     ============================================================================ */
  const gformIframe = document.getElementById('gformIframe');
  const gformWrapper = document.getElementById('gformWrapper');

  if (gformIframe && gformWrapper) {
    // When iframe finishes loading Google Form, remove skeleton
    gformIframe.addEventListener('load', () => {
      gformWrapper.classList.add('is-loaded');
    });

    // Safety timeout in case load event takes long
    setTimeout(() => {
      if (!gformWrapper.classList.contains('is-loaded')) {
        gformWrapper.classList.add('is-loaded');
      }
    }, 3500);
  }

  /* ============================================================================
     F. SCROLL REVEAL OBSERVER
     ============================================================================ */
  const revealElements = document.querySelectorAll('.service-card, .spec-card, .feature-point-card, .leader-card, .contact-info-card');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }
});
