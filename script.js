const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

const themeBtn = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('dm-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
themeBtn?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('dm-theme', next);
});

const showBtn = document.querySelector('#show-more-pubs');
showBtn?.addEventListener('click', () => {
  const items = [...document.querySelectorAll('.more-pub')];
  const opening = items.some(el => el.classList.contains('hidden'));
  items.forEach(el => el.classList.toggle('hidden', !opening));
  showBtn.textContent = opening ? 'Show fewer publications' : 'Show all publications';
});

document.querySelector('#year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
