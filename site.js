const siteThemes = ['light', 'dark', 'slate', 'parchment', 'midnight'];
let siteTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
try {
  const saved = localStorage.getItem('personal-site-theme');
  if (siteThemes.includes(saved)) siteTheme = saved;
} catch (_) { /* Storage may be unavailable for local files. */ }
document.documentElement.dataset.theme = siteTheme;

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

  function openDisclosureForHash() {
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target instanceof HTMLDetailsElement) target.open = true;
  }
  openDisclosureForHash();
  window.addEventListener('hashchange', openDisclosureForHash);

  // Dates sit beside their titles until any one in a group would wrap; then
  // every date in that group (same section and list type) moves below its title.
  const dateLists = [...document.querySelectorAll('ul')].filter((list) => list.querySelector(':scope > li .record-head .record-date'));
  function stackDatesConsistently() {
    const closed = [...document.querySelectorAll('main details:not([open])')];
    for (const list of dateLists) list.classList.remove('dates-stacked');
    for (const details of closed) details.open = true; // measure hidden lists too; restored before paint
    const groups = new Map();
    for (const list of dateLists) {
      const key = (list.closest('section')?.id || '') + '|' + list.className;
      const group = groups.get(key) || { lists: [], wrapped: false };
      group.lists.push(list);
      group.wrapped ||= [...list.querySelectorAll('.record-head')].some((head) => {
        const date = head.querySelector('.record-date');
        return date && date.getClientRects().length && date.getBoundingClientRect().top >= head.firstElementChild.getBoundingClientRect().bottom - 2;
      });
      groups.set(key, group);
    }
    for (const details of closed) details.open = false;
    for (const group of groups.values()) {
      if (group.wrapped) for (const list of group.lists) list.classList.add('dates-stacked');
    }
  }
  if (dateLists.length) {
    let frame = 0;
    new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(stackDatesConsistently); }).observe(document.body);
    document.fonts?.ready.then(stackDatesConsistently);
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  const picker = document.getElementById('theme-picker');
  picker.querySelector('input[value="' + siteTheme + '"]').checked = true;
  picker.hidden = false;
  picker.addEventListener('change', (event) => {
    siteTheme = event.target.value;
    document.documentElement.dataset.theme = siteTheme;
    try { localStorage.setItem('personal-site-theme', siteTheme); } catch (_) { /* Applies for this visit. */ }
  });
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && picker.open) {
      picker.open = false;
      picker.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });
});
