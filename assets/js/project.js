// Script para cargar datos del proyecto
document.addEventListener("DOMContentLoaded", function () {
  // Obtener ID del proyecto de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  if (!projectId) {
    // Si no hay ID de proyecto, mostrar mensaje de error
    document.getElementById("loading-indicator").innerHTML = `
  <div class="alert alert-danger" role="alert">
    No se ha especificado un proyecto. Por favor, vuelva a la <a href="projects.html">lista de proyectos</a>.
  </div>
  `;
    return;
  }

  // URL de la API
  const apiUrl = `https://caret-ek3gf.ondigitalocean.app/api/projects/${projectId}/`;

  // Cargar datos del proyecto
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar el proyecto");
      }
      return response.json();
    })
    .then((project) => {
      // Actualizar título y breadcrumb
      document.getElementById("project-title").textContent = project.name;
      document.getElementById("breadcrumb-project-name").textContent =
        project.name;
      document.title = `Caret Capital | ${project.name}`;

      // Actualizar detalles del proyecto
      document.getElementById("detail-project-name").textContent = project.name;
      document.getElementById("project-location").textContent =
        project.location;
      document.getElementById("project-type").textContent =
        project.project_type;
      document.getElementById("project-area").textContent = `${parseFloat(
        project.area
      ).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      })} m²`;

      // Establecer la descripción del proyecto
      if (project.description) {
        document.getElementById("project-description").textContent =
          project.description;
      } else {
        document.getElementById("project-description").style.display = "none";
      }

      // Establecer fecha de compra
      const buyDate = formatDate(project.buy_year, project.buy_month);
      document.getElementById("project-buy-date").textContent = buyDate;

      // Formatear valores numéricos
      const buyPrice = parseFloat(project.buy_price).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      });
      document.getElementById(
        "project-buy-price"
      ).textContent = `${buyPrice} €`;

      // Calcular y mostrar gastos totales
      let expenses = 0;

      // Gastos de compra si existen
      if (project.buy_expenses) {
        expenses += parseFloat(project.buy_expenses);
      }

      // Gastos de venta si existen
      if (project.sell_expenses) {
        expenses += parseFloat(project.sell_expenses);
      }

      // Otros gastos si existen
      if (project.other_expenses) {
        expenses += parseFloat(project.other_expenses);
      }

      // Gastos de financiación si existen
      if (project.financing_expenses) {
        expenses += parseFloat(project.financing_expenses);
      }

      expenses = expenses.toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      });

      document.getElementById("project-expenses").textContent = `${expenses} €`;

      // Formatear precio de venta
      const sellPrice = parseFloat(project.sell_price).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      });
      document.getElementById(
        "project-sell-price"
      ).textContent = `${sellPrice} €`;

      // Establecer fecha de venta si existe
      if (project.sell_year && project.sell_month) {
        const sellDate = formatDate(project.sell_year, project.sell_month);
        document.getElementById("project-sell-date").textContent = sellDate;
      } else if (!project.sell_month) {
        document.getElementById("project-sell-date").textContent =
          project.sell_year;
      } else {
        document.getElementById("project-sell-date").textContent = "";
      }

      // Formatear margen e IRR
      document.getElementById("project-margin").textContent = `${parseFloat(
        project.margin
      ).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      })} €`;

      document.getElementById("project-irr").textContent = `${parseFloat(
        project.irr
      ).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;

      // Establecer clase de estado
      const statusElement = document.getElementById("project-status");
      if (project.status === "current") {
        statusElement.classList.add("status-current");
        statusElement.textContent = "En Curso";
      } else {
        statusElement.classList.add("status-past");
        statusElement.textContent = "Finalizado";
      }

      // Cargar imágenes en el carrusel
      const carouselInner = document.getElementById("carousel-items");
      const carouselIndicators = document.getElementById("carousel-indicators");
      let carouselItems = "";
      let indicators = "";

      // Añadir la imagen principal
      const mainImage = project.image
        ? project.image
        : "../assets/images/images/caret.webp";
      carouselItems += `
    <div class="carousel-item active">
      <img src="${mainImage}" class="d-block w-100" alt="${project.name}">
    </div>
  `;

      // Añadir el primer indicador (activo)
      indicators += `<li data-target="#project-carousel" data-slide-to="0" class="active"></li>`;

      // Añadir imágenes adicionales
      if (project.additional_images && project.additional_images.length > 0) {
        project.additional_images.forEach((imgObj, index) => {
          carouselItems += `
        <div class="carousel-item">
          <img src="${imgObj.image}" class="d-block w-100" alt="${project.name} - Imagen adicional">
        </div>
      `;

          // Añadir indicadores para imágenes adicionales
          indicators += `<li data-target="#project-carousel" data-slide-to="${
            index + 1
          }"></li>`;
        });
      }

      carouselInner.innerHTML = carouselItems;
      carouselIndicators.innerHTML = indicators;

      // Mostrar el contenido y ocultar el indicador de carga
      document.getElementById("loading-indicator").style.display = "none";
      document.getElementById("project-content").style.display = "block";

      // Inicializar el carrusel con todas las imágenes
      initializeCarousel();
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("loading-indicator").innerHTML = `
    <div class="alert alert-danger" role="alert">
      Error al cargar los detalles del proyecto. Por favor, intente nuevamente más tarde o vuelva a la <a href="projects.html">lista de proyectos</a>.
    </div>
  `;
    });
});

// Función para formatear fecha (año y mes)
function formatDate(year, month) {
  if (!year || !month) return "N/A";

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Ajustar el mes (si viene en formato 1-12)
  const monthIndex = parseInt(month) - 1;
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${months[monthIndex]} ${year}`;
  }

  return `${month} ${year}`;
}

// Inicializar el carrusel
function initializeCarousel() {
  // Asegurar que las imágenes están cargadas antes de inicializar el carrusel
  const carouselImages = document.querySelectorAll("#carousel-items img");
  let imagesLoaded = 0;

  function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === carouselImages.length) {
      // Todas las imágenes están cargadas, ahora inicializamos el carrusel
      $("#project-carousel").carousel();

      // Asegurar que los botones de navegación funcionen
      const prevButton = document.querySelector(".carousel-control-prev");
      const nextButton = document.querySelector(".carousel-control-next");

      // Quitar los atributos href que causan el desplazamiento
      prevButton.removeAttribute("href");
      nextButton.removeAttribute("href");

      // Agregar listeners para los botones manualmente
      prevButton.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // Detener la propagación del evento
        $("#project-carousel").carousel("prev");
      });

      nextButton.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // Detener la propagación del evento
        $("#project-carousel").carousel("next");
      });

      // Reinicializar animaciones si es necesario
      if (typeof window.reInitializeComponents === "function") {
        window.reInitializeComponents();
      }
    }
  }

  // Si no hay imágenes, inicializar de todos modos
  if (carouselImages.length === 0) {
    $("#project-carousel").carousel();
  } else {
    // Esperar a que cada imagen se cargue
    carouselImages.forEach((img) => {
      if (img.complete) {
        checkAllImagesLoaded();
      } else {
        img.addEventListener("load", checkAllImagesLoaded);
        img.addEventListener("error", checkAllImagesLoaded); // Manejar errores de carga
      }
    });
  }
}
