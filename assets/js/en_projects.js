// Simplified Project Manager
class ProjectManager {
  constructor() {
    this.apiUrl = "https://caret-ek3gf.ondigitalocean.app/api/projects/";
    this.projectsPerPage = 12;
    this.currentPage = 1;
    this.totalPages = 1;
    this.currentFilter = "";

    this.container = document.getElementById("projects-container");
    this.loading = document.getElementById("loading-indicator");
    this.filter = document.getElementById("projects-filter");

    this.init();
  }

  init() {
    this.loadProjects();
    this.filter?.addEventListener("change", (e) => {
      this.currentFilter = e.target.value;
      this.loadProjects(1);
    });
  }

  async loadProjects(page = 1) {
    this.currentPage = page;
    this.container.innerHTML = "";
    this.loading.style.display = "block";

    try {
      const params = new URLSearchParams({ page });
      if (this.currentFilter) params.append("status", this.currentFilter);

      const response = await fetch(`${this.apiUrl}?${params}`);
      const data = await response.json();

      this.totalPages = Math.ceil(data.count / this.projectsPerPage);
      this.loading.style.display = "none";

      if (data.results.length === 0) {
        this.container.innerHTML =
          '<div class="alert alert-info">No projects found.</div>';
        return;
      }

      this.renderContent(data.results);
    } catch (error) {
      this.loading.style.display = "none";
      this.container.innerHTML =
        '<div class="alert alert-danger">Error loading projects.</div>';
    }
  }

  renderContent(projects) {
    // Render projects
    const row = document.createElement("div");
    row.className = "row";

    projects.forEach((project) => {
      const isCurrent = project.status === "current";
      const margin = parseFloat(project.margin).toLocaleString("es-ES", {
        maximumFractionDigits: 0,
      });
      const irr = parseFloat(project.irr).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 py-0 mt-4";
      col.innerHTML = `
        <div class="background-white pb-4 h-100 radius-secondary" style="display: flex; flex-direction: column;">
          <div style="position: relative;">
            <img class="w-100 radius-tr-secondary radius-tl-secondary" 
                 src="${project.image || "../assets/images/images/caret.webp"}" 
                 alt="${project.name}" 
                 onerror="this.src='../assets/images/images/caret.webp';" 
                 style="height: 225px; object-fit: cover;" />
            <span class="badge badge-pill" style="position: absolute; top: 12px; left: 12px; background: ${
              isCurrent ? "#004225" : "#949494"
            }; color: #fff; font-size: 0.85rem; z-index: 2;">
              ${isCurrent ? "In Progress" : "Completed"}
            </span>
          </div>
          <div class="px-4 pt-4" style="flex-grow: 1; display: flex; flex-direction: column;">
            <div class="overflow-hidden">
              <a href="project.html?id=${project.id}"><h5>${
        project.name
      }</h5></a>
            </div>
            <div class="overflow-hidden">
              <p class="color-7">${project.location}</p>
            </div>
            <div class="overflow-hidden">
              <p class="mt-3">${project.project_type.toLowerCase()} project with ${
        isCurrent ? "estimated" : ""
      } margin of ${margin} € and ${
        isCurrent ? "estimated" : ""
      } IRR of ${irr}%.</p>
            </div>
                          <div class="overflow-hidden" style="margin-top: auto;">
              <div class="d-inline-block">
                <a class="d-flex align-items-center" href="project.html?id=${
                  project.id
                }">
                  More Information
                  <div class="overflow-hidden ml-2">
                    <span class="d-inline-block">&xrarr;</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      row.appendChild(col);
    });

    this.container.appendChild(row);

    // Render pagination if needed
    if (this.totalPages > 1) {
      const pager = document.createElement("div");
      pager.className = "pager-container";

      const buttons = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);

      // Previous button
      buttons.push(`<li class="pager-item ${
        this.currentPage === 1 ? "disabled" : ""
      }">
        <button class="pager-btn" data-page="${this.currentPage - 1}" ${
        this.currentPage === 1 ? "disabled" : ""
      }>
          <i class="fa fa-chevron-left"></i>
        </button>
      </li>`);

      // Page numbers
      if (start > 1) {
        buttons.push(
          '<li class="pager-item"><button class="pager-btn" data-page="1">1</button></li>'
        );
        if (start > 2)
          buttons.push(
            '<li class="pager-item"><span class="pager-ellipsis">...</span></li>'
          );
      }

      for (let i = start; i <= end; i++) {
        buttons.push(`<li class="pager-item">
          <button class="pager-btn ${
            i === this.currentPage ? "active" : ""
          }" data-page="${i}">${i}</button>
        </li>`);
      }

      if (end < this.totalPages) {
        if (end < this.totalPages - 1)
          buttons.push(
            '<li class="pager-item"><span class="pager-ellipsis">...</span></li>'
          );
        buttons.push(
          `<li class="pager-item"><button class="pager-btn" data-page="${this.totalPages}">${this.totalPages}</button></li>`
        );
      }

      // Next button
      buttons.push(`<li class="pager-item ${
        this.currentPage === this.totalPages ? "disabled" : ""
      }">
        <button class="pager-btn" data-page="${this.currentPage + 1}" ${
        this.currentPage === this.totalPages ? "disabled" : ""
      }>
          <i class="fa fa-chevron-right"></i>
        </button>
      </li>`);

      pager.innerHTML = `<div class="pager-wrapper"><ul class="pager-list">${buttons.join(
        ""
      )}</ul></div>`;
      this.container.appendChild(pager);

      // Add click events
      pager.querySelectorAll(".pager-btn:not([disabled])").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const page = parseInt(e.target.dataset.page);
          if (page && page !== this.currentPage) {
            this.loadProjects(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      });
    }

    // Reinitialize components if needed
    if (typeof window.reInitializeComponents === "function") {
      window.reInitializeComponents();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => new ProjectManager());
