/**
 * Dr. Divyanshi Mangla — Academic Portfolio
 * Features:
 *   1. Preloader with progress animation
 *   2. Hero dynamic text rotation (typewriter style)
 *   3. Theme switcher (dark/light, persisted)
 *   4. Scroll reveal animations
 *   5. 3D tilt on bento cards (subtle, elegant)
 *   6. Animated stats counter
 *   7. Publication search & filter
 *   8. 1-click citation copy & BibTeX modal
 *   9. Scrollspy active nav link
 *  10. Mobile nav drawer
 */

function initPortfolio() {

  /* ===================================================
     1. PRELOADER
     =================================================== */
  const preloader  = document.getElementById('site-preloader');
  const loaderBar  = document.getElementById('preloader-bar');
  const loaderSub  = document.getElementById('preloader-status');

  const stages = [
    'Synthesizing Bio-Polymer Framework...',
    'Calibrating Adsorption Models...',
    'Indexing 870+ Scholarly Citations...',
    'Academic Profile Ready!'
  ];

  let prog = 0;
  let stageIdx = 0;
  let preloaderDismissed = false;

  const dismissPreloader = () => {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    if (loaderBar) loaderBar.style.width = '100%';
    if (loaderSub) loaderSub.textContent = stages[stages.length - 1];
    setTimeout(() => {
      preloader?.classList.add('fade-out');
      setTimeout(() => {
        if (preloader) preloader.style.display = 'none';
      }, 560);
    }, 200);
  };

  const tick = setInterval(() => {
    prog = Math.min(prog + Math.floor(Math.random() * 25) + 18, 100);

    if (loaderBar) loaderBar.style.width = `${prog}%`;

    if (loaderSub && prog < 92) {
      const nextStage = Math.min(Math.floor((prog / 100) * (stages.length - 1)), stages.length - 2);
      if (nextStage !== stageIdx) {
        stageIdx = nextStage;
        loaderSub.textContent = stages[stageIdx];
      }
    }

    if (prog >= 100) {
      clearInterval(tick);
      dismissPreloader();
    }
  }, 80);

  // Safety fallback: maximum 2 seconds
  setTimeout(() => {
    clearInterval(tick);
    dismissPreloader();
  }, 2000);


  /* ===================================================
     2. THEME SWITCHER
     =================================================== */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  // Restore saved theme or detect OS preference
  const savedTheme = localStorage.getItem('dm-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initTheme);

  themeBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('dm-theme', next);
  });


  /* ===================================================
     3. HERO DYNAMIC TEXT — smooth fade & swap
     =================================================== */
  const dynamicEl = document.getElementById('hero-dynamic');
  const domains = [
    'Sustainable Materials',
    'Wastewater Remediation',
    'Biopolymer Composites',
    'Antibiotic Decontamination',
    'Magnetic Bio-adsorbents',
    'Green Nanotechnology'
  ];
  let domainIdx = 0;

  if (dynamicEl) {
    // Set initial transition style
    dynamicEl.style.transition = 'opacity 0.28s ease, transform 0.28s ease';

    setInterval(() => {
      // Fade out + slide up
      dynamicEl.style.opacity = '0';
      dynamicEl.style.transform = 'translateY(-6px)';

      setTimeout(() => {
        domainIdx = (domainIdx + 1) % domains.length;
        dynamicEl.textContent = domains[domainIdx];
        // Slide in from below
        dynamicEl.style.transform = 'translateY(6px)';
        dynamicEl.offsetHeight; // force reflow
        dynamicEl.style.opacity = '1';
        dynamicEl.style.transform = 'translateY(0)';
      }, 290);
    }, 3000);
  }


  /* ===================================================
     4. SCROLL REVEAL — IntersectionObserver
     =================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }


  /* ===================================================
     5. 3D TILT & CURSOR SPOTLIGHT on BENTO CARDS & STATS
     =================================================== */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spotlightCards = document.querySelectorAll('.bento-card, .stat-tile');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!prefersReducedMotion && card.classList.contains('bento-card')) {
        const cx   = rect.width  / 2;
        const cy   = rect.height / 2;
        const dx   = (x - cx) / cx;
        const dy   = (y - cy) / cy;
        const rotY =  dx * 5;
        const rotX = -dy * 5;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!prefersReducedMotion && card.classList.contains('bento-card')) {
        card.style.transition = 'transform 0.45s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        setTimeout(() => {
          card.style.transition = 'transform 0.12s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        }, 460);
      }
    });
  });


  /* ===================================================
     6. ANIMATED STATS COUNTER
     =================================================== */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCount = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOutCubic(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (statNumbers.length) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));
  }


  /* ===================================================
     7. PUBLICATIONS — FILTER & SEARCH
     =================================================== */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const pubRows      = document.querySelectorAll('#pub-container .pub-row');
  const searchInput  = document.getElementById('pub-search');
  const pubEmpty     = document.getElementById('pub-empty');

  let activeFilter = 'all';
  let searchQuery  = '';

  const applyFilter = () => {
    let visible = 0;
    pubRows.forEach((row) => {
      const cat      = row.dataset.category || '';
      const keywords = (row.dataset.keywords || '') + ' ' + (row.querySelector('.pub-heading')?.textContent || '') + ' ' + (row.querySelector('.pub-byline')?.textContent || '');
      const matchCat = activeFilter === 'all' || cat === activeFilter;
      const matchQ   = searchQuery === '' || keywords.toLowerCase().includes(searchQuery.toLowerCase());

      const show = matchCat && matchQ;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (pubEmpty) pubEmpty.style.display = visible === 0 ? 'block' : 'none';
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter || 'all';
      applyFilter();
    });
  });

  let searchDebounce;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      searchQuery = e.target.value.trim();
      applyFilter();
    }, 220);
  });


  /* ===================================================
     8. CITATION COPY
     =================================================== */
  const showToast = (msg) => {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  };

  document.querySelectorAll('.copy-cite-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.citation || '';
      navigator.clipboard.writeText(text)
        .then(() => showToast('✓ Citation copied to clipboard'))
        .catch(() => {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('✓ Citation copied');
        });
    });
  });


  /* ===================================================
     9. BIBTEX MODAL
     =================================================== */
  const bibtexOverlay = document.getElementById('bibtex-overlay');
  const bibtexContent = document.getElementById('bibtex-code-content');
  const bibtexClose   = document.getElementById('bibtex-close');
  const bibtexCopyBtn = document.getElementById('bibtex-copy-btn');

  document.querySelectorAll('.bibtex-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bib = btn.dataset.bibtex || '';
      if (bibtexContent) bibtexContent.textContent = bib;
      bibtexOverlay?.classList.add('visible');
    });
  });

  const closeBibtex = () => bibtexOverlay?.classList.remove('visible');

  bibtexClose?.addEventListener('click', closeBibtex);
  bibtexOverlay?.addEventListener('click', (e) => {
    if (e.target === bibtexOverlay) closeBibtex();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBibtex();
  });

  bibtexCopyBtn?.addEventListener('click', () => {
    const bib = bibtexContent?.textContent || '';
    navigator.clipboard.writeText(bib)
      .then(() => showToast('✓ BibTeX copied to clipboard'))
      .catch(() => showToast('Copy failed — please select and copy manually'));
  });


  /* ===================================================
     10. SCROLLSPY — Active nav link highlight
     =================================================== */
  const sections  = document.querySelectorAll('section[id], div[id="stats-section"]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((s) => spyObserver.observe(s));


  /* ===================================================
     11. HEADER — scroll shadow
     =================================================== */
  const header = document.getElementById('top-header');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ===================================================
     12. MOBILE NAV DRAWER
     =================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav      = document.getElementById('main-nav');

  mobileToggle?.addEventListener('click', () => {
    const isOpen = mainNav?.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav on link click (mobile)
  mainNav?.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (mainNav?.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !mobileToggle?.contains(e.target)) {
      mainNav.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
