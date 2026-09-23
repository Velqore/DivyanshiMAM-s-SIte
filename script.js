/**
 * Dr. Divyanshi Mangla - Academic Portfolio Scripts
 * Handles: Theme toggle, stats counter, publication search & filtering,
 * citation copy, BibTeX modal, scrollspy, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. THEME TOGGLE (DARK / LIGHT) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or use system preference
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

  // --- 2. MOBILE NAVIGATION DRAWER ---
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

  // --- 3. ANIMATED METRICS COUNTER ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic formula
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

  // --- 4. PUBLICATIONS SEARCH & FILTERING ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('pub-search');
  const pubCards = document.querySelectorAll('.pub-card');
  const pubContainer = document.getElementById('pub-container');

  let activeCategory = 'all';
  let searchQuery = '';

  const filterPublications = () => {
    let visibleCount = 0;

    pubCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('.pub-title')?.textContent || '').toLowerCase();
      const authors = (card.querySelector('.pub-authors')?.textContent || '').toLowerCase();
      const venue = (card.querySelector('.pub-venue')?.textContent || '').toLowerCase();
      const year = card.getAttribute('data-year') || '';

      const contentString = `${title} ${keywords} ${authors} ${venue} ${year}`.toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !searchQuery || contentString.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'grid';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle "no results" state
    let emptyState = document.getElementById('pub-empty-state');
    if (visibleCount === 0) {
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = 'pub-empty-state';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = '40px 20px';
        emptyState.style.color = 'var(--text-muted)';
        emptyState.style.background = 'var(--bg-card)';
        emptyState.style.borderRadius = 'var(--radius-lg)';
        emptyState.style.border = '1px solid var(--border-card)';
        emptyState.innerHTML = '<p style="font-size: 1.1rem; font-weight: 600;">No publications match your filter or search query.</p><p style="margin-top: 8px; font-size: 0.9rem;">Try clearing your search terms or selecting "All Works".</p>';
        pubContainer.appendChild(emptyState);
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

  // --- 5. CITATION COPY TO CLIPBOARD ---
  document.querySelectorAll('.copy-cite-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-citation');
      if (citation) {
        navigator.clipboard.writeText(citation).then(() => {
          showToast('Citation copied to clipboard!');
        }).catch(() => {
          // Fallback
          prompt('Copy citation:', citation);
        });
      }
    });
  });

  // --- 6. BIBTEX MODAL & COPY ---
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

  // --- 7. EMAIL COPY HELPER ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  copyEmailBtn?.addEventListener('click', () => {
    const email = copyEmailBtn.getAttribute('data-email');
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied!');
      });
    }
  });

  // --- 8. TOAST NOTIFICATION UTILITY ---
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // --- 9. ACTIVE LINK SCROLLSPY ---
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

  // Update current year
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
