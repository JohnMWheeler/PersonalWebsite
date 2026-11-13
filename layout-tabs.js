// Tabbed layout: shows one section at a time instead of one long scroll.
// Add ?layout=classic to the URL to see the original single-page layout.
(() => {
  if (new URLSearchParams(window.location.search).get('layout') === 'classic') return;
  document.documentElement.classList.add('tabbed');

  document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    // Contact is not a tab; it stays at the bottom under every tab.
    const sections = [...main.querySelectorAll(':scope > section.section[id]:not(.contact)')];
    const hero = main.querySelector(':scope > .hero');
    if (!sections.length || !hero) return;

    // Each diagram interlude belongs to the section just above it, or the one
    // below it when it comes before every section.
    const interludes = new Map();
    for (const figure of main.querySelectorAll(':scope > .interlude')) {
      const previous = figure.previousElementSibling;
      const next = figure.nextElementSibling;
      if (sections.includes(previous)) interludes.set(figure, previous);
      else if (sections.includes(next)) interludes.set(figure, next);
    }

    const tabs = document.createElement('nav');
    tabs.className = 'panel-tabs';
    tabs.setAttribute('aria-label', 'Page sections');
    for (const section of sections) {
      const label = section.querySelector('.section-label');
      const number = label?.querySelector('span')?.textContent.trim() || '';
      const name = (label?.textContent || section.id).replace(number, '').trim();
      const link = document.createElement('a');
      link.href = '#' + section.id;
      link.innerHTML = '<span></span>';
      link.firstChild.textContent = number;
      link.append(name);
      tabs.append(link);
    }
    hero.after(tabs);

    function panelFor(element) {
      if (!element) return null;
      if (interludes.has(element)) return interludes.get(element);
      const section = element.closest('section.section');
      return sections.includes(section) ? section : null;
    }

    function activate(section) {
      for (const s of sections) s.classList.toggle('is-active', s === section);
      for (const [figure, owner] of interludes) figure.classList.toggle('is-active', owner === section);
      for (const link of tabs.querySelectorAll('a')) {
        link.setAttribute('aria-current', link.getAttribute('href') === '#' + section.id ? 'true' : 'false');
      }
      // A chosen tab should show its content, so expand collapsible sections.
      const disclosure = section.querySelector('.section-disclosure');
      if (disclosure) disclosure.open = true;
    }

    function show(id, { scroll, fromTabs }) {
      const target = id && document.getElementById(id);
      const section = panelFor(target);
      if (!section) return false;
      activate(section);
      if (target instanceof HTMLDetailsElement) target.open = true;
      if (!scroll) return true;
      if (target === section) {
        if (!fromTabs || tabs.getBoundingClientRect().top < 0) tabs.scrollIntoView({ block: 'start' });
      } else {
        target.scrollIntoView({ block: 'start' });
      }
      return true;
    }

    if (!show(window.location.hash.slice(1), { scroll: true })) activate(sections[0]);

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const id = link.getAttribute('href').slice(1);
      if (!show(id, { scroll: true, fromTabs: tabs.contains(link) })) return;
      event.preventDefault();
      if (window.location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    });

    window.addEventListener('popstate', () => {
      if (!show(window.location.hash.slice(1), { scroll: false })) activate(sections[0]);
    });
  });
})();
