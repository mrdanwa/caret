// Project Detail Manager
class ProjectDetailManager {
  constructor() {
    this.projectId = this.getProjectIdFromUrl();
    this.loading = document.getElementById("loading-indicator");
    this.content = document.getElementById("project-content");
    this.apiBase = "https://caret-ek3gf.ondigitalocean.app/api/projects/";
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
          No project specified. Please return to the <a href="projects.html">project list</a>.
        </div>
      `;
      return;
    }
    this.loadProject();
  }

  async loadProject() {
    const apiUrl = `${this.apiBase}${this.projectId}/`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to load project");
      const project = await response.json();
      this.renderProject(project);
    } catch (error) {
      console.error("Error:", error);
      this.loading.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed loading project details. Please try again later or return to the <a href="projects.html">project list</a>.
        </div>
      `;
    }
  }

  renderProject(project) {
    // Title and breadcrumb
    document.getElementById("project-title").textContent = project.name;
    document.getElementById("breadcrumb-project-name").textContent =
      project.name;
    document.title = `Caret Capital | ${project.name}`;

    // Details
    document.getElementById("detail-project-name").textContent = project.name;
    document.getElementById("project-location").textContent = project.location;
    document.getElementById("project-type").textContent =
      project.project_type_en;
    document.getElementById("project-area").textContent = `${parseFloat(
      project.area
    ).toLocaleString("es-ES", { maximumFractionDigits: 0 })} m²`;

    // Description
    if (project.description_en) {
      document.getElementById("project-description").textContent =
        project.description_en;
      document.getElementById("project-description").style.display = "";
    } else {
      document.getElementById("project-description").style.display = "none";
    }

    // Buy date
    const buyDate = ProjectDetailManager.formatDate(
      project.buy_year,
      project.buy_month
    );
    document.getElementById("project-buy-date").textContent = buyDate;

    // Total cost
    let cost = 0;
    if (project.buy_price) cost += parseFloat(project.buy_price);
    if (project.buy_expenses) cost += parseFloat(project.buy_expenses);
    if (project.sell_expenses) cost += parseFloat(project.sell_expenses);
    if (project.other_expenses) cost += parseFloat(project.other_expenses);
    if (project.financing_expenses)
      cost += parseFloat(project.financing_expenses);
    const costFormatted = cost.toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    document.getElementById("project-cost").textContent = `${costFormatted} €`;

    // Sell price
    const sellPrice = parseFloat(project.sell_price).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    document.getElementById(
      "project-sell-price"
    ).textContent = `${sellPrice} €`;

    // Sell date
    if (project.sell_year && project.sell_month) {
      const sellDate = ProjectDetailManager.formatDate(
        project.sell_year,
        project.sell_month
      );
      document.getElementById("project-sell-date").textContent = sellDate;
    } else if (!project.sell_month) {
      document.getElementById("project-sell-date").textContent =
        project.sell_year;
    } else {
      document.getElementById("project-sell-date").textContent = "";
    }

    // Margin and IRR
    document.getElementById("project-margin").textContent = `${parseFloat(
      project.margin
    ).toLocaleString("es-ES", { maximumFractionDigits: 0 })} €`;
    document.getElementById("project-irr").textContent = `${parseFloat(
      project.irr
    ).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;

    // Status
    const statusElement = document.getElementById("project-status");
    statusElement.classList.remove("status-current", "status-past");
    if (project.status === "current") {
      statusElement.classList.add("status-current");
      statusElement.textContent = "In Progress";
    } else {
      statusElement.classList.add("status-past");
      statusElement.textContent = "Completed";
    }

    // Carousel
    this.renderCarousel(project);

    // Show content, hide loading
    this.loading.style.display = "none";
    this.content.style.display = "block";

    // Initialize carousel
    this.initializeCarousel();
  }

  renderCarousel(project) {
    const carouselInner = document.getElementById("carousel-items");
    const carouselIndicators = document.getElementById("carousel-indicators");
    let carouselItems = "";
    let indicators = "";

    // Main image
    const mainImage = project.image
      ? project.image
      : "../assets/images/images/caret.webp";
    carouselItems += `
      <div class="carousel-item active">
        <img src="${mainImage}" class="d-block w-100" alt="${project.name}">
      </div>
    `;
    indicators += `<li data-target="#project-carousel" data-slide-to="0" class="active"></li>`;

    // Additional images
    if (project.additional_images && project.additional_images.length > 0) {
      project.additional_images.forEach((imgObj, index) => {
        carouselItems += `
          <div class="carousel-item">
            <img src="${imgObj.image}" class="d-block w-100" alt="${project.name} - Additional Image">
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

  static formatDate(year, month) {
    if (!year || !month) return "N/A";
    const months = [
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
    ];
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
}

document.addEventListener("DOMContentLoaded", () => new ProjectDetailManager());
