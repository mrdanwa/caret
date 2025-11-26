// Gestor de Detalle de Proyecto

// Función para obtener un proyecto específico por ID
function getProjectById(id) {
  return PROJECTS_DATABASE.results.find(
    (project) => project.id === parseInt(id)
  );
}

class ProjectDetailManager {
  constructor() {
    this.projectId = this.getProjectIdFromUrl();

    // Language detection
    const currentPage = window.location.pathname;
    this.isEnglish = currentPage.includes("/en/");

    // Language-specific messages
    this.messages = {
      en: {
        noProjectSpecified:
          'No project has been specified. Please return to the <a href="projects.html">project list</a>.',
        projectNotFound:
          'Project not found. Please return to the <a href="projects.html">project list</a>.',
        inProgress: "In Progress",
        completed: "Completed",
        estimatedFinancialInfo: "Estimated Financial Information",
        estimatedAcquisitionSale: "Estimated Acquisition and Sale",
        toDetermine: "Pending",
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
      es: {
        noProjectSpecified:
          'No se ha especificado un proyecto. Por favor, vuelva a la <a href="projects.html">lista de proyectos</a>.',
        projectNotFound:
          'Proyecto no encontrado. Por favor, vuelva a la <a href="projects.html">lista de proyectos</a>.',
        inProgress: "En Curso",
        completed: "Finalizado",
        estimatedFinancialInfo: "Información Financiera Estimada",
        estimatedAcquisitionSale: "Adquisición y Venta Estimada",
        toDetermine: "Pendiente",
        months: [
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
        ],
      },
    };

    this.content = document.getElementById("project-content");
    this.setupLanguageSwitcher();
    this.init();
  }

  getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  init() {
    if (!this.projectId) {
      this.loading.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${this.messages[this.isEnglish ? "en" : "es"].noProjectSpecified}
        </div>
      `;
      return;
    }
    this.loadProject();
  }

  loadProject() {
    // Usar la base de datos local en lugar de la API
    const project = getProjectById(this.projectId);

    if (!project) {
      this.content.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${this.messages[this.isEnglish ? "en" : "es"].projectNotFound}
        </div>
      `;
      return;
    }

    this.renderProject(project);
  }

  renderProject(project) {
    // Título y breadcrumb
    document.getElementById("project-title").textContent = project.name;
    document.getElementById("breadcrumb-project-name").textContent =
      project.name;
    document.title = `Caret Capital | ${project.name}`;

    // Detalles
    document.getElementById("detail-project-name").textContent = project.name;
    document.getElementById("project-location").textContent = project.location;

    // Project type - language specific
    const projectTypeField = this.isEnglish ? "project_type" : "tipo_proyecto";
    document.getElementById("project-type").textContent =
      project[projectTypeField] ||
      project.project_type ||
      project.tipo_proyecto ||
      "";

    document.getElementById("project-area").textContent = `${parseFloat(
      project.area
    ).toLocaleString("es-ES", { maximumFractionDigits: 0 })} m²`;

    // Descripción
    const descriptionField = this.isEnglish ? "description" : "descripcion";
    if (project[descriptionField]) {
      document.getElementById("project-description").textContent =
        project[descriptionField];
      document.getElementById("project-description").style.display = "";
    } else {
      document.getElementById("project-description").style.display = "none";
    }

    // Fecha de compra
    if (project.buy_year && project.buy_month) {
      const buyDate = this.formatDate(project.buy_year, project.buy_month);
      document.getElementById("project-buy-date").textContent = buyDate;
    } else if (project.buy_year && !project.buy_month) {
      document.getElementById("project-buy-date").textContent =
        project.buy_year;
    } else {
      document.getElementById("project-buy-date").textContent = "";
    }

    const cost =
      project.cost === "N/A" || !project.cost
        ? this.messages[this.isEnglish ? "en" : "es"].toDetermine
        : parseFloat(project.cost).toLocaleString("es-ES", {
            maximumFractionDigits: 0,
          }) + " €";

    const revenue =
      project.revenue === "N/A" || !project.revenue
        ? this.messages[this.isEnglish ? "en" : "es"].toDetermine
        : parseFloat(project.revenue).toLocaleString("es-ES", {
            maximumFractionDigits: 0,
          }) + " €";

    document.getElementById("project-cost").textContent = cost;

    document.getElementById("project-sell-price").textContent = revenue;

    // Fecha de venta
    if (project.sell_year === "N/A" || !project.sell_year) {
      document.getElementById("project-sell-date").textContent =
        this.messages[this.isEnglish ? "en" : "es"].toDetermine;
    } else if (project.sell_year && project.sell_month) {
      const sellDate = this.formatDate(project.sell_year, project.sell_month);
      document.getElementById("project-sell-date").textContent = sellDate;
    } else if (!project.sell_month) {
      document.getElementById("project-sell-date").textContent =
        project.sell_year;
    } else {
      document.getElementById("project-sell-date").textContent = "";
    }

    // Margen e IRR
    const margin =
      project.margin === "N/A" || !project.margin
        ? this.messages[this.isEnglish ? "en" : "es"].toDetermine
        : parseFloat(project.margin).toLocaleString("es-ES", {
            maximumFractionDigits: 0,
          }) + " €";

    const irr =
      project.irr === "N/A" || !project.irr
        ? this.messages[this.isEnglish ? "en" : "es"].toDetermine
        : parseFloat(project.irr).toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + "%";

    document.getElementById("project-margin").textContent = margin;
    document.getElementById("project-irr").textContent = irr;

    // Estado
    const statusElement = document.getElementById("project-status");
    statusElement.classList.remove("status-current", "status-past");
    if (project.status === "current") {
      statusElement.classList.add("status-current");
      statusElement.textContent =
        this.messages[this.isEnglish ? "en" : "es"].inProgress;

      // Cambiar título de la sección financiera para proyectos en curso
      const financialTitle = document.getElementById("financial-section-title");
      if (financialTitle) {
        financialTitle.textContent =
          this.messages[this.isEnglish ? "en" : "es"].estimatedFinancialInfo;
      }
      const acquisitionSale = document.getElementById("acquisition-sale");
      if (acquisitionSale) {
        acquisitionSale.textContent =
          this.messages[this.isEnglish ? "en" : "es"].estimatedAcquisitionSale;
      }
    } else {
      statusElement.classList.add("status-past");
      statusElement.textContent =
        this.messages[this.isEnglish ? "en" : "es"].completed;
    }

    // Carrusel
    this.renderCarousel(project);

    // Inicializar carrusel
    this.initializeCarousel();
  }

  renderCarousel(project) {
    const carouselInner = document.getElementById("carousel-items");
    const carouselIndicators = document.getElementById("carousel-indicators");
    let carouselItems = "";
    let indicators = "";

    // Imagen principal
    const mainImage = project.image
      ? project.image
      : "../assets/images/images/caret.webp";
    carouselItems += `
      <div class="carousel-item active">
        <img src="${mainImage}" class="d-block w-100" alt="${project.name}">
      </div>
    `;
    indicators += `<li data-target="#project-carousel" data-slide-to="0" class="active"></li>`;

    // Imágenes adicionales
    if (project.additional_images && project.additional_images.length > 0) {
      project.additional_images.forEach((imgObj, index) => {
        carouselItems += `
          <div class="carousel-item">
            <img src="${imgObj.image}" class="d-block w-100" alt="${project.name} - Imagen adicional">
          </div>
        `;
        indicators += `<li data-target="#project-carousel" data-slide-to="${
          index + 1
        }"></li>`;
      });
    }
    carouselInner.innerHTML = carouselItems;
    carouselIndicators.innerHTML = indicators;
  }

  formatDate(year, month) {
    if (!year || !month) return "N/A";
    const months = this.messages[this.isEnglish ? "en" : "es"].months;
    const monthIndex = parseInt(month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]} ${year}`;
    }
    return `${month} ${year}`;
  }

  initializeCarousel() {
    const carouselImages = document.querySelectorAll("#carousel-items img");
    let imagesLoaded = 0;
    const checkAllImagesLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === carouselImages.length) {
        $("#project-carousel").carousel();
        const prevButton = document.querySelector(".carousel-control-prev");
        const nextButton = document.querySelector(".carousel-control-next");
        prevButton?.removeAttribute("href");
        nextButton?.removeAttribute("href");
        prevButton?.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          $("#project-carousel").carousel("prev");
        });
        nextButton?.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          $("#project-carousel").carousel("next");
        });
        if (typeof window.reInitializeComponents === "function") {
          window.reInitializeComponents();
        }
      }
    };
    if (carouselImages.length === 0) {
      $("#project-carousel").carousel();
    } else {
      carouselImages.forEach((img) => {
        if (img.complete) {
          checkAllImagesLoaded();
        } else {
          img.addEventListener("load", checkAllImagesLoaded);
          img.addEventListener("error", checkAllImagesLoaded);
        }
      });
    }
  }

  setupLanguageSwitcher() {
    // Update language switcher links to preserve project ID
    const languageOptions = document.querySelectorAll(".language-option");

    languageOptions.forEach((option) => {
      const lang = option.getAttribute("data-lang");

      // Update href to include current project ID
      if (this.projectId) {
        let newUrl;
        if (lang === "en") {
          newUrl = `../en/project.html?id=${this.projectId}`;
        } else {
          newUrl = `../es/project.html?id=${this.projectId}`;
        }
        option.setAttribute("href", newUrl);
      }
    });
  }

  setupProjectNavigation() {
    const prevBtn = document.getElementById("prev-project-btn");
    const nextBtn = document.getElementById("next-project-btn");

    if (!prevBtn || !nextBtn) return;

    const allProjects = PROJECTS_DATABASE.results;
    const currentProjectId = parseInt(this.projectId);
    const currentIndex = allProjects.findIndex(
      (p) => p.id === currentProjectId
    );

    if (currentIndex === -1) return;

    // Previous button (circular: if first, go to last)
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : allProjects.length - 1;
    prevBtn.onclick = () => {
      window.location.href = `project.html?id=${allProjects[prevIndex].id}`;
    };

    // Next button (circular: if last, go to first)
    const nextIndex =
      currentIndex < allProjects.length - 1 ? currentIndex + 1 : 0;
    nextBtn.onclick = () => {
      window.location.href = `project.html?id=${allProjects[nextIndex].id}`;
    };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const projectDetailManager = new ProjectDetailManager();
  await projectDetailManager.init();
  projectDetailManager.setupProjectNavigation();
});
