document.addEventListener('DOMContentLoaded', () => {
  // Detecta si es móvil
  const isMobile = () => window.matchMedia("(max-width: 600px)").matches;

  // Expandir/colapsar en móvil
  const items = document.querySelectorAll('.accordion__item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (!isMobile()) return;
      const open = item.classList.contains('accordion__item--expanded');
      items.forEach(x => x.classList.remove('accordion__item--expanded'));
      if (!open) item.classList.add('accordion__item--expanded');
    });
  });

  // Scroll suave al pulsar la flecha
  document.querySelectorAll('.accordion__scroll-button').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation(); // evita que se dispare el toggle del accordion
      const wrapper = button.closest('.accordion__content-wrapper');
      const content = wrapper.querySelector('.accordion__content');
      content.scrollBy({
        top: 100,
        behavior: 'smooth'
      });
    });
  });
});
