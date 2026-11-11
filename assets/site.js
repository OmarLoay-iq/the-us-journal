(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (menu && nav) {
    const closeMenu = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      nav.classList.toggle('is-open', expanded);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  }
  const search = document.querySelector('#article-search');
  const cards = [...document.querySelectorAll('.article-card')];
  const filters = [...document.querySelectorAll('.filter')];
  const tools = document.querySelector('.browse-tools');
  if (search && cards.length && tools) {
    tools.hidden = false;
    let category = 'all';
    const update = () => {
      const query = search.value.trim().toLowerCase();
      let count = 0;
      cards.forEach(card => {
        const show = (category === 'all' || card.dataset.category === category) && (!query || card.dataset.search.includes(query));
        card.hidden = !show;
        if (show) count++;
      });
      document.querySelector('#result-count').textContent = `${count} ${count === 1 ? 'read' : 'reads'}${query || category !== 'all' ? ' found' : ' in the collection'}`;
      document.querySelector('.no-results').hidden = count !== 0;
    };
    search.addEventListener('input', update);
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      filters.forEach(filter => { const active = filter === button; filter.classList.toggle('is-active', active); filter.setAttribute('aria-pressed', String(active)); });
      update();
    }));
    update();
  }
  const copy = document.querySelector('.copy-link');
  if (copy && navigator.clipboard && window.isSecureContext) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const status = document.querySelector('.copy-status');
      try { await navigator.clipboard.writeText(window.location.href); status.textContent = 'Link copied.'; }
      catch { status.textContent = 'Please copy the address from your browser.'; }
    });
  }
  const progress = document.querySelector('.reading-progress span');
  if (progress) {
    let pending = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 100}%`;
      pending = false;
    };
    window.addEventListener('scroll', () => { if (!pending) { pending = true; window.requestAnimationFrame(update); } }, {passive:true});
    window.addEventListener('resize', update);
    update();
  }
})();
