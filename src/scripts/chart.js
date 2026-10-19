for (const chart of document.querySelectorAll('[data-chart]')) {
  const cards = new Map(Array.from(chart.querySelectorAll('[data-card]'), card => [card.dataset.card, card]));
  const edges = [...chart.querySelectorAll('[data-from][data-to]')];
  let hovered = null;
  let focused = null;
  let pinned = null;

  function render() {
    const active = hovered ?? focused ?? pinned;
    const neighbors = new Set();
    for (const edge of edges) {
      const { from, to } = edge.dataset;
      const incident = active === from || active === to;
      edge.classList.toggle('is-neighbor', incident);
      if (incident) neighbors.add(active === from ? to : from);
    }
    for (const [id, card] of cards) {
      card.classList.toggle('is-active', id === active);
      card.classList.toggle('is-neighbor', neighbors.has(id));
      card.setAttribute('aria-pressed', String(id === pinned));
    }
    chart.classList.toggle('has-highlight', active !== null);
  }

  function clear() {
    hovered = focused = pinned = null;
    render();
  }

  for (const [id, card] of cards) {
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = id;
      render();
    });
    card.addEventListener('pointerleave', () => {
      if (hovered !== id) return;
      hovered = null;
      render();
    });
    card.addEventListener('focus', () => {
      if (!card.matches(':focus-visible')) return;
      focused = id;
      hovered = null;
      render();
    });
    card.addEventListener('blur', () => {
      if (focused !== id) return;
      focused = null;
      render();
    });
    card.addEventListener('click', () => {
      pinned = pinned === id ? null : id;
      render();
    });
  }

  chart.addEventListener('click', event => {
    if (!event.target.closest('[data-card]')) clear();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && chart.classList.contains('has-highlight')) clear();
  });

  const opening = cards.get(chart.dataset.entry);
  if (opening && !location.hash && chart.scrollLeft === 0) {
    const inset = Math.max(12, (chart.clientWidth - opening.offsetWidth) / 2);
    chart.scrollLeft = opening.offsetLeft - inset;
  }
}
