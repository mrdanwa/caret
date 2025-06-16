// Preloader
$.holdReady(true);

$("body").imagesLoaded({ background: ".background-holder" }, function () {
  $("#preloader").removeClass("loading");
  $.holdReady(false);
  setTimeout(function () {
    $("#preloader").remove();
  }, 800);
});

// Zanimation
$(window).on("load", function () {
  $("*[data-inertia]").each(function () {
    $(this).inertia();
  });
});

// Navbar dropdown
$(document).ready(function () {
  // Make the navbar fixed position from the start
  $(".navbar-elixir").addClass("fixed-navbar");

  // Handle dropdown menu opening without pushing content
  $(".navbar-toggler").on("click", function () {
    if (!$(".navbar-elixir").hasClass("scrolled")) {
      $(".navbar-elixir").addClass("open-dropdown");
    }
  });
});

// Script para el botón de cambio de idioma
document.addEventListener("DOMContentLoaded", function () {
  const languageToggle = document.getElementById("language-toggle");
  const languageOptions = document.getElementById("language-options");

  // Mostrar/ocultar opciones de idioma
  languageToggle.addEventListener("click", function () {
    languageOptions.classList.toggle("show");
  });

  // Cerrar el menú al hacer clic fuera
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".language-switcher")) {
      languageOptions.classList.remove("show");
    }
  });
});

// Script para cambiar la apariencia del header al hacer scroll
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar-elixir");
  const logoIcon1 = document.getElementById("logo-icon1");
  const logoIcon2 = document.getElementById("logo-icon2");

  // Get the base URL from a base tag if it exists, or construct a relative path
  const getBasePath = function () {
    // Check if base tag exists
    const baseTag = document.querySelector("base");
    if (baseTag && baseTag.href) {
      return baseTag.href;
    }

    // If no base tag, try to determine from script location
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src.includes("/assets/js/")) {
        return src.split("/assets/js/")[0] + "/";
      }
    }

    // Fallback to relative path
    return "../";
  };

  const basePath = getBasePath();

  // Set initial logo state (white when at top)
  if (logoIcon1) {
    logoIcon1.setAttribute("src", basePath + "assets/images/logo/logo5.webp");
  }
  if (logoIcon2) {
    logoIcon2.setAttribute("src", basePath + "assets/images/logo/logo8.webp");
  }

  function checkScroll() {
    const headerHeight = navbar.offsetHeight;
    let heroSection;

    if (document.querySelector(".flexslider")) {
      heroSection = document.querySelector(".flexslider");
    } else if (document.querySelector(".background-holder.overlay")) {
      heroSection = document.querySelector("section:first-of-type");
    }

    const threshold = heroSection
      ? heroSection.offsetHeight - headerHeight
      : 100;

    if (window.scrollY > threshold) {
      navbar.classList.add("scrolled");
      // Change logo to colored version when scrolled
      if (logoIcon1) {
        logoIcon1.setAttribute(
          "src",
          basePath + "assets/images/logo/logo4.webp"
        );
      }
      if (logoIcon2) {
        logoIcon2.setAttribute(
          "src",
          basePath + "assets/images/logo/logo7.webp"
        );
      }
    } else {
      navbar.classList.remove("scrolled");
      // Change logo to white version when at top
      if (logoIcon1) {
        logoIcon1.setAttribute(
          "src",
          basePath + "assets/images/logo/logo5.webp"
        );
      }
      if (logoIcon2) {
        logoIcon2.setAttribute(
          "src",
          basePath + "assets/images/logo/logo8.webp"
        );
      }
    }
  }

  // Run on page load
  checkScroll();

  // Add event listeners
  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);
});

// Handle hamburger menu and scrolling behaviors with consistent logo states
$(document).ready(function () {
  const navbar = $(".navbar-elixir");
  const navbarCollapse = $(".navbar-collapse");
  const logoIcon1 = $("#logo-icon1");
  const logoIcon2 = $("#logo-icon2");

  // Get the base URL from a base tag if it exists, or construct a relative path
  const getBasePath = function () {
    // Check if base tag exists
    const baseTag = document.querySelector("base");
    if (baseTag && baseTag.href) {
      return baseTag.href;
    }

    // If no base tag, try to determine from script location
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src.includes("/assets/js/")) {
        return src.split("/assets/js/")[0] + "/";
      }
    }

    // Fallback to relative path
    return "../";
  };

  const basePath = getBasePath();

  // Define logo paths
  const whiteLogo1 = basePath + "assets/images/logo/logo5.webp";
  const whiteLogo2 = basePath + "assets/images/logo/logo8.webp";
  const coloredLogo1 = basePath + "assets/images/logo/logo4.webp";
  const coloredLogo2 = basePath + "assets/images/logo/logo7.webp";

  let isNavbarOpen = false;

  // Set logos to colored version
  function setColoredLogos() {
    logoIcon1.attr("src", coloredLogo1);
    logoIcon2.attr("src", coloredLogo2);
  }

  // Set logos to white version
  function setWhiteLogos() {
    logoIcon1.attr("src", whiteLogo1);
    logoIcon2.attr("src", whiteLogo2);
  }

  // When hamburger is clicked
  $(".navbar-toggler").on("click", function () {
    isNavbarOpen = !navbarCollapse.hasClass("show");

    if (isNavbarOpen) {
      // Menu is being opened - always add scrolled class and use colored logos
      navbar.addClass("scrolled");
      setColoredLogos();
    } else {
      // Menu is being closed
      // Only remove scrolled class if we're at the top of the page
      if (window.scrollY <= 100) {
        navbar.removeClass("scrolled");
        setWhiteLogos();
      }
    }
  });

  // Handle scrolling - this will be ignored when dropdown is open
  let originalScrollHandler = function () {
    // Skip this logic if the navbar is open
    if (isNavbarOpen) {
      return;
    }

    const headerHeight = navbar.outerHeight();
    let heroSection;

    if ($(".flexslider").length) {
      heroSection = $(".flexslider");
    } else if ($(".background-holder.overlay").length) {
      heroSection = $("section:first-of-type");
    }

    const threshold = heroSection
      ? heroSection.outerHeight() - headerHeight
      : 100;

    if (window.scrollY > threshold) {
      navbar.addClass("scrolled");
      setColoredLogos();
    } else {
      navbar.removeClass("scrolled");
      setWhiteLogos();
    }
  };

  // Create a debounced version of the scroll handler to improve performance
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  const debouncedScrollHandler = debounce(function () {
    if (!isNavbarOpen) {
      originalScrollHandler();
    }
  }, 10);

  // Apply the scroll handler
  $(window).on("scroll", function () {
    // Always maintain scrolled state when navbar is open
    if (isNavbarOpen) {
      navbar.addClass("scrolled");
      setColoredLogos();
    } else {
      debouncedScrollHandler();
    }
  });

  // Handle resize events
  $(window).on("resize", function () {
    if (window.innerWidth > 991) {
      // Bootstrap's lg breakpoint
      // If we resize to desktop view and the dropdown was open, reset state
      if (isNavbarOpen) {
        isNavbarOpen = false;

        // Apply normal scroll logic
        if (window.scrollY <= 100) {
          navbar.removeClass("scrolled");
          setWhiteLogos();
        }
      }
    }
  });

  // Run on page load
  if (navbarCollapse.hasClass("show")) {
    isNavbarOpen = true;
    navbar.addClass("scrolled");
    setColoredLogos();
  } else {
    // Initial scroll check
    originalScrollHandler();
  }
});
