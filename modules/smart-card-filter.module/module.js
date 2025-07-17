let selectedTags = []; // Array para almacenar los tags seleccionados

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function () {
    console.log("Clic en botón:", button.textContent.trim());

    // Obtener el filtro del botón y normalizar
    const selectedTag = button.value.toLowerCase();
    console.log("🎯 Filtro seleccionado:", selectedTag);

    // Alternar la selección del botón
    const tagIndex = selectedTags.indexOf(selectedTag);
    if (tagIndex === -1) {
      console.log("✅ Agregando filtro:", selectedTag);
      selectedTags.push(selectedTag);
      button.classList.add('active');
    } else {
      console.log("❌ Quitando filtro:", selectedTag);
      selectedTags.splice(tagIndex, 1);
      button.classList.remove('active');
    }

    console.log("📌 Tags seleccionados actualmente:", selectedTags);
    filterCardsByTags(selectedTags);
  });
});

// 🔹 Función para filtrar las cards con transición suave
function filterCardsByTags(tags) {
  console.log("🔎 Ejecutando filtro con tags:", tags);

  const cards = document.querySelectorAll('.filter-item');
  cards.forEach(card => {
    const match = card.className.match(/\[(.*?)\]/);
    let cardTags = match ? match[1].split(',').map(tag => tag.trim().toLowerCase()) : [];

    // Si no hay filtros activos, mostrar todas las cards con una transición suave
    if (tags.length === 0) {
      card.style.transition = "filter 0.5s ease-in-out, opacity 0.5s ease-in-out";
      card.style.opacity = "1";
      card.classList.remove('grayscale');
      card.classList.add('highlight');
      return;
    }

    // Comparar con los tags seleccionados
    const matchFound = tags.some(tag => cardTags.includes(tag));

    if (matchFound) {
      card.style.transition = "filter 0.5s ease-in-out, opacity 0.5s ease-in-out";
      card.style.opacity = "1";
      card.classList.remove('grayscale');
      card.classList.add('highlight');
    } else {
card.style.transition = "opacity 0.5s ease-in-out, filter 0.5s ease-in-out";


setTimeout(() => {
  card.classList.add('grayscale');
  card.classList.remove('highlight');
  card.style.opacity = "1"; 
}, 300);

    }
  });
}