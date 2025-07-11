// home-testimonial-slider.module.js
(function() {
  const slides = document.querySelectorAll('.home-testimonial-slider__slide');
  const prev = document.querySelector('.home-testimonial-slider__arrow--prev');
  const next = document.querySelector('.home-testimonial-slider__arrow--next');
  let idx = 0;

  function show(i) {
    slides.forEach((sl, j) => sl.classList.toggle('active', j === i));
  }

  prev.addEventListener('click', () => {
    idx = (idx - 1 + slides.length) % slides.length;
    show(idx);
  });
  next.addEventListener('click', () => {
    idx = (idx + 1) % slides.length;
    show(idx);
  });

  // Init
  show(idx);
})();
