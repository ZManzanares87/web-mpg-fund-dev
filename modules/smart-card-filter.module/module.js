document.addEventListener('DOMContentLoaded', ()=>{

/* ===========================
   VARS & CONSTANTES
=========================== */
let selectedTags = [];
let page = 0;
const PAGE_SIZE = 4;

/* ===========================
   HELPERS
=========================== */
const norm = str => str
  ?.toString()
  .toLowerCase()
  .trim()
  .replace(/\s+/g,' ')
  .normalize('NFD').replace(/\p{Diacritic}/gu,'')
  .replace(/^\[|\]$/g,'');

const scope    = () => document.querySelector('.filter-set.active');
const isMobile = () => window.matchMedia("(max-width:480px)").matches;

function getCardTags(card){
  const attr = card.getAttribute('data-tags');
  if(attr){
    return attr.split(',').map(norm).filter(Boolean);
  }
  let tags = Array.from(card.classList)
    .map(norm)
    .filter(c => !['card','filter-item','highlight','grayscale',''].includes(c));

  const matches = card.className.match(/\[([^\]]+)\]/g);
  if(matches){
    matches.forEach(m=>{
      m.replace(/^\[|\]$/g,'')
        .split(',')
        .forEach(t => tags.push(norm(t)));
    });
  }
  return [...new Set(tags)];
}

/* ===========================
   SWITCH ENTRE SETS
=========================== */
const switchCards = document.querySelectorAll('.switch-card');
const switchBtns  = document.querySelectorAll('.switch-wrapper .switch-btn'); // opcional si existen
const sets        = document.querySelectorAll('.filter-set');

function activateSet(id){
  id = norm(id);
  if(!id) return;

  console.log("🔁 Cambiar set:", id);

  // Estado visual de las tarjetas y (si hay) botones antiguos
  switchCards.forEach(c => c.classList.toggle('active', norm(c.dataset.set) === id));
  switchBtns.forEach(b => b.classList.toggle('active', norm(b.dataset.set) === id));

  // Mostrar/ocultar sets (el CSS hará display:none/block con .active)
  sets.forEach(s=>{
    const active = norm(s.dataset.set) === id;
    s.classList.toggle('active', active);
  });

  // Reset estado de filtros
  selectedTags = [];
  page = 0;

  bindSetEvents();
  filterCardsByTags();
  updateSelectedTagsUI();
  renderMobilePage();
}

// Click en tarjetas switch
switchCards.forEach(card=>{
  card.addEventListener('click', ()=> activateSet(card.dataset.set));
  const cta = card.querySelector('.switch-cta');
  if(cta){
    cta.addEventListener('click', e=>{
      e.stopPropagation();
      activateSet(card.dataset.set);
    });
  }
});

// Click en botones antiguos (si aún existen en el HTML)
switchBtns.forEach(btn=>{
  btn.addEventListener('click', ()=> activateSet(btn.dataset.set));
});

/* ===========================
   EVENTOS DENTRO DEL SET ACTIVO
=========================== */
function bindSetEvents(){
  const activeSet = scope();
  if(!activeSet) return;

  // Botones de filtro (desktop + mobile)
  const allBtns = Array.from(activeSet.querySelectorAll('.filter-btn'));
  allBtns.forEach(btn=>{
    btn.onclick = ()=>{
      const tag = norm(btn.value);
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

/* ===========================
   FILTRADO DE CARDS
=========================== */
function filterCardsByTags(){
  console.log("🔎 Ejecutando filtro con tags:", selectedTags);
  const activeSet = scope();
  if(!activeSet) return;

  const mobile = isMobile();
  const cards = activeSet.querySelectorAll('.filter-item');

  cards.forEach(card=>{
    const cardTags = getCardTags(card);

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

/* ===========================
   MENÚ MÓVIL
=========================== */
function openMenu(){
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

/* ===========================
   TAGS SELECCIONADOS (UI)
=========================== */
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

/* ===========================
   PAGINACIÓN MÓVIL
=========================== */
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

/* ===========================
   RESIZE
=========================== */
window.addEventListener('resize', ()=>{
  console.log("📏 Resize -> re-evaluar filtro");
  filterCardsByTags();
});

/* ===========================
   INIT
=========================== */
console.log("🚀 Inicializando módulo multi-set");

const firstId =
  (document.querySelector('.switch-card.active')?.dataset.set) ||
  (sets[0]?.dataset.set);

activateSet(firstId || ''); // activa el primero que exista

}); // DOMContentLoaded
