/* =========================================
   Свадьба Кати & Паши — Main Script
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Hide loader ----------
  var loader = document.getElementById('pageLoader');
  if (loader) {
    // Fade out loader immediately
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(function () { loader.remove(); }, 700);
  }

  // ---------- Countdown ----------
  const weddingDate = new Date('2026-07-04T17:00:00+03:00').getTime();

  function updateCountdown() {
    const now = Date.now();
    let diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---------- Hide Nav on Scroll Down ----------
  let lastScrollY = window.scrollY;
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });

  // ---------- Scroll-triggered fade-in ----------
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        const children = entry.target.querySelectorAll('.timeline-item, .format-card, .open-mic-item');
        children.forEach(function (child, index) {
          setTimeout(function () {
            child.classList.add('visible');
          }, index * 120);
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(function (section) {
    observer.observe(section);
  });

  document.querySelectorAll('.timeline-item, .format-card').forEach(function (el) {
    if (!el.closest('.section')) {
      observer.observe(el);
    }
  });

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Confetti on load ----------
  setTimeout(function () {
    var duration = 2000;
    var end = Date.now() + duration;
    var colors = ['#FF6B8A', '#F5B700', '#FFD54F', '#FF8FAB', '#FFF'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, 300);

  // ---------- Wedding march toggle ----------
  var audio = document.getElementById('weddingAudio');
  var musicBtn = document.getElementById('musicToggle');

  if (audio && musicBtn) {
    musicBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          musicBtn.classList.add('playing');
          musicBtn.setAttribute('aria-label', 'Выключить музыку');
        }).catch(function () {});
      } else {
        audio.pause();
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('aria-label', 'Включить музыку');
      }
    });
  }
});

// ---------- Google Form auto-height ----------
window.addEventListener('message', function (e) {
  if (e.origin === 'https://docs.google.com') {
    var iframe = document.querySelector('#rsvp iframe');
    if (iframe && e.data && e.data.height) {
      iframe.style.height = e.data.height + 'px';
    }
  }
});

// Fallback: resize on load
var rsvpFrame = document.querySelector('#rsvp iframe');
if (rsvpFrame) {
  rsvpFrame.addEventListener('load', function () {
    // Give Google Forms time to render
    setTimeout(function () {
      try {
        var h = rsvpFrame.contentDocument.body.scrollHeight;
        if (h > 200) rsvpFrame.style.height = h + 'px';
      } catch(e) {
        // Cross-origin — ignore, rely on postMessage
      }
    }, 1500);
  });
}