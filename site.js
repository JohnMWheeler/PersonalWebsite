// Theme is a visitor preference; storage may be unavailable for local files.
try {
  const saved = localStorage.getItem('personal-site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light';
} catch (_) { /* The default light theme remains usable. */ }

document.addEventListener('DOMContentLoaded', () => {
  for (const disclosure of document.querySelectorAll('.section-disclosure')) {
    const fragment = '#' + disclosure.closest('section').id;
    const link = document.querySelector('nav a[href="' + fragment + '"]');

    function openLinkedSection() {
      if (window.location.hash === fragment) disclosure.open = true;
    }

    openLinkedSection();
    window.addEventListener('hashchange', openLinkedSection);
    link?.addEventListener('click', openLinkedSection);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  const toggle = document.getElementById('theme-toggle');
  function updateThemeLabel() {
    toggle.setAttribute('aria-label', 'Switch to ' + (document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark') + ' theme');
  }
  toggle.hidden = false;
  updateThemeLabel();
  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('personal-site-theme', next); } catch (_) { /* Preference lasts for this visit. */ }
    updateThemeLabel();
  });
});
