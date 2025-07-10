// home-testimonials.module.js
(function() {
  const cards = document.querySelectorAll('.home-testimonials__card');
  let idx = 0;

  function showCard(i) {
    cards.forEach((c, j) => c.classList.toggle('active', j === i));
  }

  document.querySelector('.home-testimonials__arrow--prev')
    .addEventListener('click', () => {
      idx = (idx - 1 + cards.length) % cards.length;
      showCard(idx);
    });

  document.querySelector('.home-testimonials__arrow--next')
    .addEventListener('click', () => {
      idx = (idx + 1) % cards.length;
      showCard(idx);
    });
})();
