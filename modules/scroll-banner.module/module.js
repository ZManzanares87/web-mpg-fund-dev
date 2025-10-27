window.addEventListener('load', () => {
  const section = document.querySelector('.horizontal-scroll-section');
  if (!section) return;

  const wrapper = section.querySelector('.horizontal-scroll-wrapper');
  let scrollX = 0;
  let maxScroll = 0;

  const updateScrollLimits = () => {
    maxScroll = wrapper.scrollWidth - section.clientWidth;
    if (maxScroll < 0) maxScroll = 0;
  };

  updateScrollLimits();
  window.addEventListener('resize', updateScrollLimits);

  section.addEventListener('wheel', (e) => {
    // Solo vertical → convertimos en horizontal
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    e.preventDefault();
    scrollX += e.deltaY;
    scrollX = Math.max(0, Math.min(scrollX, maxScroll));
    wrapper.style.transform = `translateX(-${scrollX}px)`;
  }, { passive: false });

  // Scroll táctil
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

  // Recalcular si HubSpot edita dinámicamente
  const observer = new MutationObserver(updateScrollLimits);
  observer.observe(wrapper, { childList: true, subtree: true });
});
