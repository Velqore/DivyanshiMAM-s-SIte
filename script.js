/**
 * Dr. Divyanshi Mangla - Academic Portfolio Scripts
 * - Dynamic Hero Text Rotation Animation
 * - Scientific Preloader
 * - Ambient Molecular Particle Canvas
 * - Theme Switcher (Dark/Light)
 * - Animated Stats Counter
 * - Publications Search & Category Filter
 * - 1-Click Citation & BibTeX Modal
 * - Scrollspy & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. SCIENTIFIC PRELOADER ANIMATION
  // ========================================================
  const preloader = document.getElementById('site-preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderStatus = document.getElementById('preloader-status');

  const statusMessages = [
    'Synthesizing Bio-Polymer Framework...',
    'Calibrating Adsorption Models...',
    'Indexing 870+ Scholarly Citations...',
    'Academic Profile Ready!'
  ];

  let progress = 0;
  let statusIndex = 0;

  const preloaderInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if (progress > 100) progress = 100;

    if (preloaderBar) {
      preloaderBar.style.width = `${progress}%`;
    }

    if (preloaderStatus && progress < 90) {
      const nextIndex = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
      if (nextIndex !== statusIndex) {
        statusIndex = nextIndex;
        preloaderStatus.textContent = statusMessages[statusIndex];
      }
    }

    if (progress >= 100) {
      clearInterval(preloaderInterval);
      if (preloaderStatus) preloaderStatus.textContent = 'Academic Profile Ready!';
      setTimeout(() => {
        preloader?.classList.add('fade-out');
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 500);
      }, 250);
    }
  }, 100);

  // ========================================================
  // 2. DYNAMIC TEXT ANIMATION IN HERO SUBTITLE
  // ========================================================
  const dynamicTextEl = document.getElementById('role-dynamic-text');
  const researchDomains = [
    'Sustainable Materials',
    'Wastewater Remediation',
    'Biopolymer Composites',
    'Antibiotic Decontamination',
    'Magnetic Bio-adsorbents',
    'Green Nanotechnology'
  ];

  let currentDomainIndex = 0;

  if (dynamicTextEl) {
    setInterval(() => {
      // Fade out
      dynamicTextEl.style.opacity = '0';
      dynamicTextEl.style.transform = 'translateY(6px)';

      setTimeout(() => {
        currentDomainIndex = (currentDomainIndex + 1) % researchDomains.length;
        dynamicTextEl.textContent = researchDomains[currentDomainIndex];
        // Fade in
        dynamicTextEl.style.opacity = '1';
        dynamicTextEl.style.transform = 'translateY(0)';
      }, 260);
    }, 2800);
  }

  // ========================================================
  // 3. SUBTLE MOLECULAR PARTICLE CANVAS
  // ========================================================
  const canvas = document.getElementById('molecular-canvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = Math.min(Math.floor((width * height) / 28000), 40);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#06b6d4' : '#f59e0b',
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle covalent connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.14;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  // ========================================================
  // 4. THEME TOGGLE (DARK / LIGHT)
  // ========================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('dm-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  htmlElement.setAttribute('data-theme', initialTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dm-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });

  // ========================================================
  // 5. MOBILE NAVIGATION DRAWER
  // ========================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('main-nav');

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // ========================================================
  // 6. ANIMATED STATS COUNTER
  // ========================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      const duration = 1400;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * target);

        el.textContent = currentCount.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsStrip = document.getElementById('stats-counter-strip');
  if (statsStrip) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animateCounters();
            animated = true;
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsStrip);
  }

  // ========================================================
  // 7. PUBLICATIONS SEARCH & FILTERING
  // ========================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('pub-search');
  const pubRows = document.querySelectorAll('.pub-row');
  const pubContainer = document.getElementById('pub-container');

  let activeCategory = 'all';
  let searchQuery = '';

  const filterPublications = () => {
    let visibleCount = 0;

    pubRows.forEach((row) => {
      const category = row.getAttribute('data-category');
      const keywords = (row.getAttribute('data-keywords') || '').toLowerCase();
      const title = (row.querySelector('.pub-heading')?.textContent || '').toLowerCase();
      const authors = (row.querySelector('.pub-byline')?.textContent || '').toLowerCase();
      const venue = (row.querySelector('.pub-venue-line')?.textContent || '').toLowerCase();
      const year = row.getAttribute('data-year') || '';

      const contentString = `${title} ${keywords} ${authors} ${venue} ${year}`.toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !searchQuery || contentString.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        row.style.display = 'grid';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    let emptyState = document.getElementById('pub-empty-state');
    if (visibleCount === 0) {
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = 'pub-empty-state';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = '36px 20px';
        emptyState.style.color = 'var(--text-muted)';
        emptyState.style.background = 'var(--bg-surface)';
        emptyState.style.borderRadius = 'var(--radius-md)';
        emptyState.style.border = '1px solid var(--border-card)';
        emptyState.innerHTML = '<p style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">No publications found.</p><p style="margin-top: 6px; font-size: 0.88rem;">Try clearing your search query or selecting "All Works".</p>';
        pubContainer?.appendChild(emptyState);
      }
      emptyState.style.display = 'block';
    } else if (emptyState) {
      emptyState.style.display = 'none';
    }
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterPublications();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    filterPublications();
  });

  // ========================================================
  // 8. CITATION COPY TO CLIPBOARD
  // ========================================================
  document.querySelectorAll('.copy-cite-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-citation');
      if (citation) {
        navigator.clipboard.writeText(citation).then(() => {
          showToast('Citation copied to clipboard!');
        }).catch(() => {
          prompt('Copy citation:', citation);
        });
      }
    });
  });

  // ========================================================
  // 9. BIBTEX MODAL & COPY
  // ========================================================
  const bibtexModal = document.getElementById('bibtex-modal');
  const bibtexCodeEl = document.getElementById('bibtex-code');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const copyBibtexBtn = document.getElementById('copy-bibtex-btn');

  let currentBibtex = '';

  const openBibtexModal = (bibtexText) => {
    currentBibtex = bibtexText;
    if (bibtexCodeEl) bibtexCodeEl.textContent = bibtexText;
    bibtexModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeBibtexModal = () => {
    bibtexModal?.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.bibtex-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bibtex = btn.getAttribute('data-bibtex');
      if (bibtex) openBibtexModal(bibtex);
    });
  });

  modalCloseBtn?.addEventListener('click', closeBibtexModal);
  modalDismissBtn?.addEventListener('click', closeBibtexModal);

  bibtexModal?.addEventListener('click', (e) => {
    if (e.target === bibtexModal) closeBibtexModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bibtexModal?.classList.contains('open')) {
      closeBibtexModal();
    }
  });

  copyBibtexBtn?.addEventListener('click', () => {
    if (currentBibtex) {
      navigator.clipboard.writeText(currentBibtex).then(() => {
        showToast('BibTeX copied to clipboard!');
        closeBibtexModal();
      }).catch(() => {
        prompt('Copy BibTeX:', currentBibtex);
      });
    }
  });

  // ========================================================
  // 10. EMAIL COPY HELPER
  // ========================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  copyEmailBtn?.addEventListener('click', () => {
    const email = copyEmailBtn.getAttribute('data-email');
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied!');
      });
    }
  });

  // ========================================================
  // 11. TOAST NOTIFICATION UTILITY
  // ========================================================
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  // ========================================================
  // 12. ACTIVE LINK SCROLLSPY
  // ========================================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchorLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
