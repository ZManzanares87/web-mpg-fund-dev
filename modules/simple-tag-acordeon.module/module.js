document.addEventListener('DOMContentLoaded', () => {
  const isMobile = () => window.matchMedia("(max-width:600px)").matches;
  const items = document.querySelectorAll('.accordion__item');
  items.forEach(item => item.addEventListener('click', () => {
    if (!isMobile()) return;
    const open = item.classList.contains('accordion__item--expanded');
    items.forEach(x => x.classList.remove('accordion__item--expanded'));
    if (!open) item.classList.add('accordion__item--expanded');
  }));
});
