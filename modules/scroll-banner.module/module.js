  const section = document.querySelector('.horizontal-scroll-section');
  const wrapper = section.querySelector('.horizontal-scroll-wrapper');

  let scrollX = 0;
  let maxScroll;

  const updateScrollLimits = () => {
    maxScroll = wrapper.scrollWidth - section.clientWidth;
  };

  updateScrollLimits();
  window.addEventListener('resize', updateScrollLimits);

  section.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // ignorar scrolls diagonales

    e.preventDefault();
    scrollX += e.deltaY;
    scrollX = Math.max(0, Math.min(scrollX, maxScroll));
    wrapper.style.transform = `translateX(-${scrollX}px)`;
  }, { passive: false });

  // Opcional: scroll táctil en mobile
  let startY = 0;
  section.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });

  section.addEventListener('touchmove', (e) => {
    const deltaY = startY - e.touches[0].clientY;
    if (Math.abs(deltaY) > 2) {
      e.preventDefault();
      scrollX += deltaY;
      scrollX = Math.max(0, Math.min(scrollX, maxScroll));
      wrapper.style.transform = `translateX(-${scrollX}px)`;
    }
  }, { passive: false });