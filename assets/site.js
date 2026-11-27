(() => {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('a[data-path]').forEach(a => {
    const p = a.getAttribute('data-path');
    if (p === path || (p !== '/' && path.endsWith(p))) a.classList.add('active');
  });
})();