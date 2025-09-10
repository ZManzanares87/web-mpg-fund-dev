document.addEventListener('DOMContentLoaded', function () {
  /* ===== DETECCIÓN SOPORTE CSS MASK ===== */
  try {
    var supportsMask = CSS && (CSS.supports('mask-image','url()') || CSS.supports('-webkit-mask-image','url()'));
    if (!supportsMask) document.documentElement.classList.add('no-cssmask');
  } catch(e) {
    document.documentElement.classList.add('no-cssmask');
  }

  /* ===== DESKTOP ===== */
  var desktopParents = document.querySelectorAll('.menu--desktop .menu__item--has-submenu');

  function closeAllDesktop() {
    document.querySelectorAll('.menu--desktop .menu__item--has-submenu.menu__item--open').forEach(function(li){
      li.classList.remove('menu__item--open');
      var a = li.querySelector('a');
      var btn = li.querySelector('.menu__child-toggle');
      if (a) a.setAttribute('aria-expanded','false');
      if (btn) btn.setAttribute('aria-expanded','false');
    });
  }

  if (desktopParents && desktopParents.length){
    desktopParents.forEach(function(li){
      var btn = li.querySelector('.menu__child-toggle');
      if (btn){
        btn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          var isOpen = li.classList.contains('menu__item--open');
          closeAllDesktop();
          if (!isOpen){
            li.classList.add('menu__item--open');
            var a = li.querySelector('a');
            if (a) a.setAttribute('aria-expanded','true');
            btn.setAttribute('aria-expanded','true');
          }
        });
      }
    });
    document.addEventListener('click', function(e){
      var desktopNav = document.querySelector('.menu--desktop');
      if (desktopNav && !desktopNav.contains(e.target)) closeAllDesktop();
    });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAllDesktop(); });
  }

  /* ===== MÓVIL – solo botón abre/cierra ===== */
  var mobileMenu = document.querySelector('.menu--mobile');
  if (mobileMenu){
    mobileMenu.addEventListener('click', function(e){
      var toggle = e.target.closest('.menu__child-toggle');
      if (!toggle) return; // el texto del link navega normal

      e.preventDefault(); e.stopPropagation();

      var li = toggle.parentNode;
      var isOpen = li.classList.contains('menu__item--open');

      // cierre exclusivo
      mobileMenu.querySelectorAll('.menu__item--has-submenu.menu__item--open').forEach(function(openLi){
        if (openLi !== li){
          openLi.classList.remove('menu__item--open');
          var a2 = openLi.querySelector('a');
          var b2 = openLi.querySelector('.menu__child-toggle');
          if (a2) a2.setAttribute('aria-expanded','false');
          if (b2) b2.setAttribute('aria-expanded','false');
        }
      });

      li.classList.toggle('menu__item--open', !isOpen);
      var a = li.querySelector('a');
      if (a) a.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }
});
