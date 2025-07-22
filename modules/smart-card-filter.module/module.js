/* ======================
   JS con console.log
   ====================== */
let selectedTags = [];
let page = 0;
const PAGE_SIZE = 4; // 2 filas x 2

// Helpers
const normalizeTag = t => (t || "")
  .toLowerCase()
  .replace(/\s+/g, '')   // quita espacios/tabs nuevos
  .trim();

const extractCardTags = (card) => {
  // Busca formato [tag1, tag2]
  const m = card.className.match(/\[([^\]]+)\]/);
  if (m) {
    return m[1].split(',').map(x => normalizeTag(x));
  }
  // Fallback: usa classList filtrando utilitarias
  return Array.from(card.classList)
    .map(c => normalizeTag(c))
    .filter(c => !['card','filter-item','highlight','grayscale'].includes(c));
};

// ---- Selectores ----
const mobileFilters   = document.querySelector('.mobile-filters');
const headerClosed    = document.querySelector('.mobile-header-closed');
const filterToggle    = headerClosed.querySelector('.filter-toggle');
const tagsButton      = headerClosed.querySelector('.tags-button');
const lessButton      = document.querySelector('.less-button');

const arrowLeft       = document.querySelector('.tags-slider .arrow-left');
const arrowRight      = document.querySelector('.tags-slider .arrow-right');

const selectedTagsBox = document.querySelector('.selected-tags');

const allMobileBtns   = Array.from(document.querySelectorAll('.tags-slider .filter-btn'));
const allBtns         = Array.from(document.querySelectorAll('.filter-btn'));

// ---- Listeners filtros ----
allBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const raw = btn.value;
    const tag = normalizeTag(raw);
    console.log("Clic en botón:", raw, "-> normalizado:", tag);

    const idx = selectedTags.indexOf(tag);
    if(idx === -1){
      selectedTags.push(tag);
      btn.classList.add('active');
      console.log("✅ Agregando filtro:", tag);
    }else{
      selectedTags.splice(idx,1);
      btn.classList.remove('active');
      console.log("❌ Quitando filtro:", tag);
    }
    console.log("📌 Tags seleccionados:", selectedTags);
    filterCardsByTags();
    updateSelectedTagsUI();
    renderMobilePage();
  });
});

// ---- Filtrado cards ----
function filterCardsByTags(){
  console.log("🔎 Ejecutando filtro con tags:", selectedTags);

  const isMobile = window.matchMedia("(max-width:480px)").matches;

  document.querySelectorAll('.filter-item').forEach(card=>{
    const cardTags = extractCardTags(card);
    console.log("➡️ Card tags:", cardTags, "vs selected:", selectedTags);

    const noFilters = selectedTags.length === 0;
    const match = noFilters || selectedTags.some(t => cardTags.includes(t));

    if(match){
      card.classList.add('highlight');
      card.classList.remove('grayscale');
      if(isMobile) card.style.display = 'block';
    }else{
      card.classList.remove('highlight');
      card.classList.add('grayscale');
      if(isMobile) card.style.display = 'none';
    }
  });
}

// ---- Toggle menú móvil ----
function openMenu(){
  console.log("🔀 Abrir filtros móviles");
  filterToggle.classList.add('open');
  mobileFilters.classList.add('open');
  filterToggle.setAttribute('aria-expanded', true);
}
function closeMenu(){
  console.log("🔽 Cerrar filtros móviles");
  filterToggle.classList.remove('open');
  mobileFilters.classList.remove('open');
  filterToggle.setAttribute('aria-expanded', false);
}

filterToggle.addEventListener('click', ()=>{
  mobileFilters.classList.contains('open') ? closeMenu() : openMenu();
});
tagsButton.addEventListener('click', openMenu);
lessButton.addEventListener('click', closeMenu);

// ---- UI tags seleccionados ----
function updateSelectedTagsUI(){
  selectedTagsBox.innerHTML = '';
  selectedTags.forEach(tag=>{
    const div = document.createElement('div');
    div.className = 'tag';
    div.textContent = tag;

    const x = document.createElement('span');
    x.className = 'remove-tag';
    x.textContent = 'x';

    x.addEventListener('click', ()=>{
      console.log("❌ Quitando filtro desde UI seleccionados:", tag);
      selectedTags = selectedTags.filter(t => t !== tag);
      document.querySelectorAll(`.filter-btn`).forEach(b=>{
        if (normalizeTag(b.value) === tag) b.classList.remove('active');
      });
      filterCardsByTags();
      updateSelectedTagsUI();
      renderMobilePage();
    });

    div.appendChild(x);
    selectedTagsBox.appendChild(div);
  });
}

// ---- Paginación móvil ----
function renderMobilePage(){
  const start = page * PAGE_SIZE;
  allMobileBtns.forEach(b => b.style.display = 'none');
  allMobileBtns.slice(start, start + PAGE_SIZE).forEach(b => b.style.display = 'inline-flex');

  if(arrowLeft){
    const first = page === 0;
    arrowLeft.style.visibility = first ? 'hidden' : 'visible';
    arrowLeft.disabled = first;
  }
  if(arrowRight){
    const last = start + PAGE_SIZE >= allMobileBtns.length;
    arrowRight.style.visibility = last ? 'hidden' : 'visible';
    arrowRight.disabled = last;
  }
}

if(arrowLeft){
  arrowLeft.addEventListener('click', ()=>{
    if(page > 0){
      page--;
      renderMobilePage();
      console.log("🔙 Página móvil:", page);
    }
  });
}
if(arrowRight){
  arrowRight.addEventListener('click', ()=>{
    if((page + 1) * PAGE_SIZE < allMobileBtns.length){
      page++;
      renderMobilePage();
      console.log("🔜 Página móvil:", page);
    }
  });
}

// ---- Re-evaluar en resize (opcional)
window.addEventListener('resize', ()=>{
  console.log("📏 Resize -> re-evaluar filtro");
  filterCardsByTags();
});

// ---- Init ----
console.log("🚀 Inicializando módulo");
filterCardsByTags();    // Todas visibles por defecto
updateSelectedTagsUI(); // Limpia UI
renderMobilePage();     // Página 0
