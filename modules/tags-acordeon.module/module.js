function isMobile() {
  return window.matchMedia("(max-width: 600px)").matches;
}
function closeAllBlocks(blocks) {
  blocks.forEach(block => block.classList.remove("expanded"));
}
document.querySelectorAll('.acordeon-block').forEach(block => {
  block.addEventListener('click', function (e) {
    if (isMobile()) {
      const isActive = this.classList.contains('expanded');
      closeAllBlocks(document.querySelectorAll('.acordeon-block'));
      if (!isActive) this.classList.add('expanded');
    }
  });
});
