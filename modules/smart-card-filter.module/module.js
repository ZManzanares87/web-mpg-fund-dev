
/* ======================
   JS con console.log y multi-set (MATCH FIX)
   ====================== */

let selectedTags = [];
let page = 0;
const PAGE_SIZE = 4; // 2 filas x 2

// -------- Utils --------
const norm = str => str
  ?.toString()
  .toLowerCase()
  .trim()
  .replace(/\s+/g,' ')                          // colapsa espacios/tabs
  .normalize('NFD').replace(/\p{Diacritic}/gu,'')// quita acentos
  .replace(/^\[|\]$/g,'');                       // sin corchetes

function scope(){ return document.querySelector('.filter-set.active'); }
function isMobile(){ return window.matchMedia("(max-width:480px)").matches; }

function getCardTags(card){
  // 1) Si existe data-tags
  const attr = card.getAttribute('data-tags');
  if(attr){
    return attr.split(',').map(norm).filter(Boolean);
  }
  // 2) Parseo por clases + contenido con corchetes
  let tags = Array.from(card.classList)
    .map(norm)
    .filter(c => !['card','filter-item','highlight','grayscale',''].includes(c));

  // Extrae cualquier cosa entre corchetes en la cadena completa
  const matches = card.className.match(/\[([^\]]+)\]/g);
  if(matches){
    matches.forEach(m=>{
      const inside = m.replace(/^\[|\]$/g,'');
      inside.split(',').forEach(t=> tags.push(norm(t)));
    });
  }
  // Únicos
  return [...new Set(tags)];
}

// -------- Switch entre sets --------
const switchBtns = document.querySelectorAll('.switch-wrapper .switch-btn');
const sets = document.querySelectorAll('.filter-set');

switchBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.set;
    console.log("🔁 Cambiar set:", id);

    switchBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    sets.forEach(s=>{
      const active = s.dataset.set === id;
      if (active) {
        s.style.display = '';
        s.classList.add('active');
      } else {
        s.style.display = 'none';
        s.classList.remove('active');
      }
    });

    // Reset
    selectedTags = [];
    page = 0;

    bindSetEvents();
    filterCardsByTags();
    updateSelectedTagsUI();
    renderMobilePage();
  });
});

// -------- Bind eventos en set activo --------
function bindSetEvents(){
  const activeSet = scope();
  if(!activeSet) return;

  // Filtros
  const allBtns = Array.from(activeSet.querySelectorAll('.filter-btn'));
  allBtns.forEach(btn=>{
    btn.onclick = ()=>{
      const tag = norm(btn.value);
      console.log("Clic en botón:", tag);
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
    };
  });

  // Toggle móvil
  const filterToggle = activeSet.querySelector('.filter-toggle');
  const tagsButton   = activeSet.querySelector('.tags-button');
  const lessButton   = activeSet.querySelector('.less-button');

  if(filterToggle){
    filterToggle.onclick = ()=>{
      const mf = activeSet.querySelector('.mobile-filters');
      mf.classList.contains('open') ? closeMenu() : openMenu();
    };
  }
  if(tagsButton){ tagsButton.onclick = openMenu; }
  if(lessButton){ lessButton.onclick = closeMenu; }

  // Paginación móvil
  const arrowLeft  = activeSet.querySelector('.tags-slider .arrow-left');
  const arrowRight = activeSet.querySelector('.tags-slider .arrow-right');

  if(arrowLeft){
    arrowLeft.onclick = ()=>{
      if(page > 0){
        page--;
        renderMobilePage();
        console.log("🔙 Página móvil:", page);
      }
    };
  }
  if(arrowRight){
    arrowRight.onclick = ()=>{
      const total = activeSet.querySelectorAll('.tags-slider .filter-btn').length;
      if((page + 1) * PAGE_SIZE < total){
        page++;
        renderMobilePage();
        console.log("🔜 Página móvil:", page);
      }
    };
  }
}

// -------- Filtrado de cards --------
function filterCardsByTags(){
  console.log("🔎 Ejecutando filtro con tags:", selectedTags);
  const activeSet = scope();
  if(!activeSet) return;

  const mobile = isMobile();
  const cards = activeSet.querySelectorAll('.filter-item');

  cards.forEach(card=>{
    const cardTags = getCardTags(card);
    // console.log('CARD TAGS', card, cardTags); // debug extra si quieres

    if(selectedTags.length === 0){
      card.classList.add('highlight');
      card.classList.remove('grayscale');
      if(mobile) card.style.display = 'block';
      return;
    }

    const match = selectedTags.some(t => cardTags.includes(t));
    if(match){
      card.classList.add('highlight');
      card.classList.remove('grayscale');
      if(mobile) card.style.display = 'block';
    }else{
      card.classList.remove('highlight');
      card.classList.add('grayscale');
      if(mobile) card.style.display = 'none';
    }
  });
}

// -------- Toggle menú móvil --------
function openMenu(){
  console.log("🔀 Abrir filtros móviles");
  const activeSet = scope();
  if(!activeSet) return;
  const mf = activeSet.querySelector('.mobile-filters');
  const filterToggle = activeSet.querySelector('.filter-toggle');
  mf.classList.add('open');
  if(filterToggle){
    filterToggle.classList.add('open');
    filterToggle.setAttribute('aria-expanded', true);
  }
}
function closeMenu(){
  console.log("🔽 Cerrar filtros móviles");
  const activeSet = scope();
  if(!activeSet) return;
  const mf = activeSet.querySelector('.mobile-filters');
  const filterToggle = activeSet.querySelector('.filter-toggle');
  mf.classList.remove('open');
  if(filterToggle){
    filterToggle.classList.remove('open');
    filterToggle.setAttribute('aria-expanded', false);
  }
}

// -------- UI tags seleccionados --------
function updateSelectedTagsUI(){
  const activeSet = scope();
  if(!activeSet) return;
  const container = activeSet.querySelector('.selected-tags');
  if(!container) return;

  container.innerHTML = '';
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
      // Desactivar botones del set activo
      scope().querySelectorAll('.filter-btn').forEach(b=>{
        if(norm(b.value) === tag) b.classList.remove('active');
      });
      filterCardsByTags();
      updateSelectedTagsUI();
      renderMobilePage();
    });

    div.appendChild(x);
    container.appendChild(div);
  });
}

// -------- Paginación móvil --------
function renderMobilePage(){
  const activeSet = scope();
  if(!activeSet) return;
  const allMobileBtns = Array.from(activeSet.querySelectorAll('.tags-slider .filter-btn'));
  const arrowLeft     = activeSet.querySelector('.tags-slider .arrow-left');
  const arrowRight    = activeSet.querySelector('.tags-slider .arrow-right');

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

// -------- Resize re-eval --------
window.addEventListener('resize', ()=>{
  console.log("📏 Resize -> re-evaluar filtro");
  filterCardsByTags();
});

// -------- INIT --------
console.log("🚀 Inicializando módulo multi-set");
bindSetEvents();
filterCardsByTags();
updateSelectedTagsUI();
renderMobilePage();
