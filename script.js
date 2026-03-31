/* =============================================
   MUI BAKERY — script.js
   GSAP animations, ScrollTrigger, interactions
   ============================================= */

// =============================================
// 1. LOADER
// =============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for fill animation (1.4s) then fade out
  setTimeout(() => {
    gsap.to(loader, {
      opacity: 0,
      duration: .6,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        // Trigger hero entrance after loader exits
        heroEntrance();
      }
    });
  }, 1600);
});


// =============================================
// 2. GSAP + SCROLLTRIGGER INIT
// =============================================
try {
  gsap.registerPlugin(ScrollTrigger);
} catch (err) {
  console.warn('ScrollTrigger plugin not available:', err);
}


// =============================================
// 3. HERO ENTRANCE ANIMATION
// =============================================
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Eyebrow
  tl.to('#heroEyebrow', { opacity: 1, y: 0, duration: .8 })

    // Each word of the title
    .to('.title-word', {
      opacity: 1,
      y: 0,
      duration: .9,
      stagger: .15,
      ease: 'expo.out'
    }, '-=.4')

    // Subtitle
    .to('#heroSub', { opacity: 1, y: 0, duration: .8 }, '-=.5')

    // CTA buttons
    .to('#heroActions', { opacity: 1, y: 0, duration: .7 }, '-=.4')

    // Rotating badge
    .to('#heroBadge', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=.3')

    // Hero image subtle zoom
    .fromTo('.hero-img', { scale: 1.08 }, { scale: 1, duration: 2.5, ease: 'expo.out' }, 0);
}


// =============================================
// 4. NAVBAR — scroll state + smooth scrolling
// =============================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Toggle scrolled class
  navbar.classList.toggle('scrolled', scrollY > 60);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', scrollY > 500);
}, { passive: true });

// Back to top click
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth-scroll for all internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // Close mobile nav if open
    closeMobileNav();
  });
});


// =============================================
// 5. HAMBURGER / MOBILE NAV
// =============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

function openMobileNav() {
  mobileNav.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Animate mobile links in
  gsap.fromTo('.mobile-link',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, stagger: .07, duration: .5, ease: 'power2.out', delay: .25 }
  );
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileClose.addEventListener('click', closeMobileNav);


// =============================================
// 6. CUSTOM CURSOR
// =============================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0 });
});

// Smooth follower with requestAnimationFrame
function animateFollower() {
  followerX += (mouseX - followerX) * .12;
  followerY += (mouseY - followerY) * .12;
  gsap.set(cursorFollower, { x: followerX, y: followerY });
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor grow on interactive elements
const hoverTargets = 'a, button, .menu-card, .gallery-item, .review-card, input, textarea';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorFollower, { width: 64, height: 64, opacity: .3, duration: .3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorFollower, { width: 36, height: 36, opacity: .6, duration: .3 });
  });
});


// =============================================
// 7. SCROLL REVEAL ANIMATIONS (ScrollTrigger)
// =============================================
// Generic reveal-up elements
gsap.utils.toArray('.reveal-up').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    }
  });
});

// Image reveals
gsap.utils.toArray('.reveal-img').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });
});

// About images stagger
ScrollTrigger.create({
  trigger: '.about-images',
  start: 'top 75%',
  onEnter: () => {
    gsap.fromTo('.about-img-main',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1, ease: 'expo.out' }
    );
    gsap.fromTo('.about-img-accent',
      { opacity: 0, x: 40, y: 20 },
      { opacity: 1, x: 0, y: 0, duration: 1, delay: .2, ease: 'expo.out' }
    );
    gsap.fromTo('.about-stat-card',
      { opacity: 0, scale: .8 },
      { opacity: 1, scale: 1, duration: .8, delay: .4, ease: 'back.out(1.7)' }
    );
  }
});

// Menu cards stagger on scroll
ScrollTrigger.create({
  trigger: '#menuGrid',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.menu-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: .7,
        stagger: .08,
        ease: 'power3.out'
      }
    );
  }
});

// Special section pulse animation
ScrollTrigger.create({
  trigger: '.special',
  start: 'top 70%',
  onEnter: () => {
    const tl = gsap.timeline();
    tl.fromTo('.special-emoji',
      { scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: .7, ease: 'back.out(2)' }
    )
    .fromTo('.special-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, '-=.3'
    )
    .fromTo('.special-feat',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: .1, duration: .5, ease: 'power2.out' }, '-=.4'
    );
  }
});

// Gallery grid stagger
ScrollTrigger.create({
  trigger: '.gallery-grid',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.gallery-item',
      { opacity: 0, scale: .94 },
      { opacity: 1, scale: 1, stagger: .07, duration: .7, ease: 'power3.out' }
    );
  }
});

// Reviews cards
ScrollTrigger.create({
  trigger: '.reviews-slider-wrap',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.review-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: .12, duration: .7, ease: 'power3.out' }
    );
  }
});

// Contact cards stagger
ScrollTrigger.create({
  trigger: '.contact-info',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.contact-card',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: .1, duration: .7, ease: 'power3.out' }
    );
  }
});

// Parallax on hero background
gsap.to('.hero-img', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// Special section background parallax
gsap.to('.special-bg-img', {
  yPercent: 15,
  ease: 'none',
  scrollTrigger: {
    trigger: '.special',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// Order form reveal
ScrollTrigger.create({
  trigger: '.order-form-wrap',
  start: 'top 85%',
  onEnter: () => {
    gsap.fromTo('.order-form-wrap',
      { opacity: 0, y: 50, scale: .98 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' }
    );
  }
});


// =============================================
// 8. MENU TAB FILTER
// =============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;

    // GSAP fade out all first
    gsap.to('.menu-card', {
      opacity: 0,
      y: 10,
      duration: .2,
      ease: 'power2.in',
      onComplete: () => {
        // Show/hide cards
        menuCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        // Fade visible cards back in with stagger
        const visible = [...menuCards].filter(c => c.style.display !== 'none');
        gsap.fromTo(visible,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: .06, duration: .4, ease: 'power2.out' }
        );
      }
    });
  });
});


// =============================================
// 9. GALLERY LIGHTBOX
// =============================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.lightbox;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


// =============================================
// 10. REVIEWS SLIDER
// =============================================
const slider = document.getElementById('reviewsSlider');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');

if (!slider) {
  console.warn('Reviews slider container not found');
} else {
  const cards = slider.querySelectorAll('.review-card');
  let currentSlide = 0;

  // Ensure we always start visible even if JS interrupts
  gsap.set(slider, { x: 0 });

  // Determine cards per view
  function getCardsPerView() {
    if (window.innerWidth >= 1100) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
  }

  let cardsPerView = getCardsPerView();
  let totalSlides = Math.max(1, Math.ceil(cards.length / cardsPerView));

  // Build dots
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(idx) {
    currentSlide = Math.max(0, Math.min(idx, totalSlides - 1));

    const gap = 24;
    const cardWidth = cards[0]?.offsetWidth || 0;
    const offset = currentSlide * cardsPerView * (cardWidth + gap);

    gsap.to(slider, {
      x: -offset,
      duration: .6,
      ease: 'power3.out'
    });

    updateDots();
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

  let autoSlide = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
  });

  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }, { passive: true });

  buildDots();
  goToSlide(currentSlide);

  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      cardsPerView = newCardsPerView;
      totalSlides = Math.max(1, Math.ceil(cards.length / cardsPerView));
      currentSlide = 0;
      goToSlide(currentSlide);
      buildDots();
    }
  });
}




// =============================================
// 11. CONTACT FORM SUBMISSION
// =============================================
const orderForm = document.getElementById('orderForm');
const formSuccess = document.getElementById('formSuccess');

orderForm.addEventListener('submit', e => {
  e.preventDefault();

  // Animate button
  const submitBtn = orderForm.querySelector('button[type="submit"]');
  gsap.to(submitBtn, { scale: .96, duration: .1, yoyo: true, repeat: 1 });

  // Simulate sending
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';

  setTimeout(() => {
    orderForm.style.display = 'none';
    formSuccess.classList.add('show');
    gsap.fromTo(formSuccess,
      { opacity: 0, scale: .9 },
      { opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.5)' }
    );
  }, 1500);
});


// =============================================
// 12. BTN ORDER — micro cart animation
// =============================================
document.querySelectorAll('.btn-order').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:30px;height:30px;border-radius:50%;
      background:rgba(255,255,255,.3);
      transform:scale(0);animation:rippleAnim .4s ease-out forwards;
    `;
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);

    // Pulse the button
    gsap.fromTo(btn,
      { scale: 1 },
      { scale: 1.3, duration: .15, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  });
});

// Add ripple keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);


// =============================================
// 13. FLOATING ELEMENTS — GSAP loop in Special
// =============================================
gsap.utils.toArray('.float-el').forEach((el, i) => {
  gsap.to(el, {
    y: -20,
    rotation: (i % 2 === 0) ? 10 : -10,
    duration: 2.5 + i * .7,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: i * .8
  });
});


// =============================================
// 14. SECTION TITLE SPLIT CHARACTER ANIMATION
// =============================================
// Animate section eyebrows with a subtle scale
ScrollTrigger.batch('.section-eyebrow', {
  start: 'top 90%',
  onEnter: (els) => {
    gsap.fromTo(els,
      { opacity: 0, y: 12, letterSpacing: '0.04em' },
      { opacity: 1, y: 0, letterSpacing: '0.18em', stagger: .1, duration: .6, ease: 'power2.out' }
    );
  }
});


// =============================================
// 15. NAVBAR BRAND PULSE on hover
// =============================================
document.querySelector('.nav-brand')?.addEventListener('mouseenter', () => {
  gsap.fromTo('.brand-script',
    { scale: 1 },
    { scale: 1.05, duration: .3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
  );
});


// =============================================
// 16. CARD TILT EFFECT on Menu Cards
// =============================================
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    gsap.to(card, {
      rotateY: x * 6,
      rotateX: -y * 6,
      duration: .4,
      ease: 'power2.out',
      transformPerspective: 800
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: .4, ease: 'power2.out' });
  });
});
