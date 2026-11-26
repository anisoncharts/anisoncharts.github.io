function fitTopNav() {
  var nav = document.getElementById("myTopnav");
  if (!nav) {
      return;
  }

  var container = nav.querySelector(".topnav-container");
  var heading = nav.querySelector(".topnav-heading");
  var icon = nav.querySelector(".topnav-container > .icon");
  var dropdown = nav.querySelector(".topnav-dropdown");
  if (!container || !heading || !icon || !dropdown) {
      return;
  }

  var seasonLinks = Array.prototype.slice.call(nav.querySelectorAll(".topnav-centered > a"));
  var secondaryLinks = Array.prototype.slice.call(nav.querySelectorAll(".topnav-right > a:not(.icon)"));
  var navLinks = seasonLinks.concat(secondaryLinks);
  var wasResponsive = nav.classList.contains("responsive");
  var availableWidth = container.clientWidth;

  nav.classList.remove("responsive", "compact");
  navLinks.forEach(function(link) {
      link.classList.remove("nav-hidden");
  });

  function requiredWidth() {
      var width = heading.getBoundingClientRect().width;
      navLinks.forEach(function(link) {
          if (!link.classList.contains("nav-hidden")) {
              width += link.getBoundingClientRect().width;
          }
      });
      if (nav.classList.contains("compact")) {
          width += icon.getBoundingClientRect().width;
      }
      return width;
  }

  if (requiredWidth() > availableWidth) {
      nav.classList.add("compact");

      for (var i = 0; i < secondaryLinks.length && requiredWidth() > availableWidth; i++) {
          secondaryLinks[i].classList.add("nav-hidden");
      }

      if (requiredWidth() > availableWidth) {
          seasonLinks.forEach(function(link) {
              link.classList.add("nav-hidden");
          });
      }

      if (wasResponsive) {
          nav.classList.add("responsive");
      }
  }

  dropdown.innerHTML = "";
  navLinks.forEach(function(link) {
      if (link.classList.contains("nav-hidden")) {
          var menuLink = link.cloneNode(true);
          menuLink.classList.remove("nav-hidden");
          dropdown.appendChild(menuLink);
      }
  });
}

function collapseTopNav() {
  var nav = document.getElementById("myTopnav");
  nav.classList.toggle("responsive");
}

var topnavContainer = document.querySelector("#myTopnav .topnav-container");
if (topnavContainer) {
  fitTopNav();
  window.addEventListener("load", fitTopNav);

  if (typeof ResizeObserver !== "undefined") {
      var lastTopnavWidth = topnavContainer.clientWidth;
      var topnavResizeObserver = new ResizeObserver(function() {
          var width = topnavContainer.clientWidth;
          if (width !== lastTopnavWidth) {
              lastTopnavWidth = width;
              fitTopNav();
          }
      });
      topnavResizeObserver.observe(topnavContainer);
  } else {
      window.addEventListener("resize", fitTopNav);
  }
}
