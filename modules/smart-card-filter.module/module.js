let selectedTags = [];
  let page = 0;
  const mobileFilters = document.querySelector('.mobile-filters');
  const filterToggle = document.querySelector('.filter-toggle');
  const allMobileButtons = Array.from(document.querySelectorAll('.mobile-filters .filter-btn'));

  // Click en cualquier filtro
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.value.toLowerCase();
      console.log("Clic en botón:", tag);
      const idx = selectedTags.indexOf(tag);
      if (idx === -1) {
        selectedTags.push(tag);
        button.classList.add('active');
        console.log("✅ Agregando filtro:", tag);
      } else {
        selectedTags.splice(idx, 1);
        button.classList.remove('active');
        console.log("❌ Quitando filtro:", tag);
      }
      console.log("📌 Tags seleccionados actualmente:", selectedTags);
      filterCardsByTags();
      updateSelectedTagsUI();
      renderMobilePage();
    });
  });

  // Filtrar cards
  function filterCardsByTags() {
    console.log("🔎 Ejecutando filtro con tags:", selectedTags);
    document.querySelectorAll('.filter-item').forEach(card => {
      const hasTag = selectedTags.length === 0 ||
        selectedTags.some(t => card.className.toLowerCase().includes(t));
      if (hasTag) {
        card.classList.add('highlight');
        card.classList.remove('grayscale');
      } else {
        card.classList.remove('highlight');
        card.classList.add('grayscale');
      }
    });
  }

  // Toggle móvil: abre/cierra panel y anima logo
  filterToggle.addEventListener('click', () => {
    console.log("🔀 Toggle filtros móviles");
    filterToggle.classList.toggle('open');
    mobileFilters.classList.toggle('open');
  });

  // Actualizar UI de selected tags
  function updateSelectedTagsUI() {
    const container = document.querySelector('.selected-tags');
    container.innerHTML = '';
    selectedTags.forEach(tag => {
      const div = document.createElement('div');
      div.className = 'tag';
      div.textContent = tag;
      const span = document.createElement('span');
      span.className = 'remove-tag';
      span.textContent = 'x';
      span.addEventListener('click', () => {
        console.log("❌ Quitando filtro vía UI seleccionados:", tag);
        selectedTags = selectedTags.filter(t => t !== tag);
        document.querySelectorAll(`.filter-btn[value=\"${tag}\"]`).forEach(b => b.classList.remove('active'));
        filterCardsByTags();
        updateSelectedTagsUI();
        renderMobilePage();
      });
      div.appendChild(span);
      container.appendChild(div);
    });
  }

  // Paginación móvil
  function renderMobilePage() {
    const pageSize = 4;
    const start = page * pageSize;
    allMobileButtons.forEach(btn => btn.style.display = 'none');
    allMobileButtons.slice(start, start + pageSize).forEach(btn => btn.style.display = 'inline-flex');
    document.querySelector('.pagination .arrow-left').style.visibility = page === 0 ? 'hidden' : 'visible';
    document.querySelector('.pagination .arrow-right').style.visibility = start + pageSize >= allMobileButtons.length ? 'hidden' : 'visible';
  }
  document.querySelector('.pagination .arrow-left').addEventListener('click', () => {
    if (page > 0) { console.log("🔙 Página móvil:", page - 1); page--; renderMobilePage(); }
  });
  document.querySelector('.pagination .arrow-right').addEventListener('click', () => {
    if ((page + 1) * 4 < allMobileButtons.length) { console.log("🔜 Página móvil:", page + 1); page++; renderMobilePage(); }
  });
  console.log("🚀 Inicializando móvil");
  renderMobilePage();

  // Botón Ver menos
  document.querySelector('.less-button').addEventListener('click', () => {
    console.log("🔽 Cerrar filtros móviles");
    filterToggle.classList.remove('open');
    mobileFilters.classList.remove('open');
  });