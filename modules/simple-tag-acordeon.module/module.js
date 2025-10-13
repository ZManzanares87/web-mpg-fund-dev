document.addEventListener('DOMContentLoaded', () => {
  // Detectar si es móvil
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

  // Scroll suave al pulsar una flecha
  const scrollSmooth = (content, direction = 'down') => {
    const amount = direction === 'down' ? 100 : -100;
    content.scrollBy({ top: amount, behavior: 'smooth' });
  };

  // Crear flecha SVG reutilizable
  const createArrowSVG = (direction = 'down') => {
    const rotation = direction === 'up' ? 'rotate(180 6.5 3.5)' : '';
    return `
      <svg width="13" height="23" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform-origin:center;">
        <path d="M6.27 4.83L10.67 0.43C10.84 0.27 11.06 0.18 11.3 0.19C11.53 0.19 11.75 0.28 11.92 0.45C12.08 0.61 12.17 0.83 12.18 1.07C12.18 1.3 12.09 1.52 11.93 1.69L6.9 6.72C6.73 6.89 6.51 6.98 6.27 6.98C6.03 6.98 5.81 6.89 5.64 6.72L0.61 1.69C0.45 1.52 0.36 1.3 0.36 1.07C0.37 0.83 0.46 0.61 0.62 0.45C0.79 0.28 1.01 0.19 1.24 0.19C1.48 0.18 1.7 0.27 1.87 0.43L6.27 4.83Z" fill="white" ${rotation ? `transform="${rotation}"` : ''}/>
      </svg>
    `;
  };

  // Configurar comportamiento de flechas
  document.querySelectorAll('.accordion__item').forEach(item => {
    const content = item.querySelector('.accordion__content');
    const links = content.querySelectorAll('a');
    const scrollIndicator = item.querySelector('.accordion__scroll-indicator');

    if (!scrollIndicator) return;

    // Si hay 5 o menos programas, no mostrar nada
    if (links.length <= 5) {
      scrollIndicator.style.display = 'none';
      return;
    }

    // Crear flechas: abajo (por defecto) y arriba (oculta)
    const downBtn = document.createElement('button');
    downBtn.className = 'accordion__scroll-button accordion__scroll-down';
    downBtn.innerHTML = createArrowSVG('down');

    const upBtn = document.createElement('button');
    upBtn.className = 'accordion__scroll-button accordion__scroll-up';
    upBtn.innerHTML = createArrowSVG('up');
    upBtn.style.display = 'none'; // inicia oculta

    // Añadir al DOM
    scrollIndicator.innerHTML = '';
    scrollIndicator.appendChild(downBtn);
    scrollIndicator.appendChild(upBtn);

    // Acciones al hacer clic
    downBtn.addEventListener('click', e => {
      e.stopPropagation();
      scrollSmooth(content, 'down');
    });
    upBtn.addEventListener('click', e => {
      e.stopPropagation();
      scrollSmooth(content, 'up');
    });

    // Mostrar flecha según posición de scroll
    const checkScroll = () => {
      const atTop = content.scrollTop <= 0;
      const atBottom = Math.ceil(content.scrollTop + content.clientHeight) >= content.scrollHeight - 2;

      downBtn.style.display = atBottom ? 'none' : 'flex';
      upBtn.style.display = atTop ? 'none' : 'flex';
    };

    // Escuchar scroll
    content.addEventListener('scroll', checkScroll);
    checkScroll(); // inicial
  });
});
