// Función para obtener proyectos con paginación y filtros
function getProjects(
  page = 1,
  status = "",
  projectType = "",
  projectsPerPage = 12
) {
  let filteredProjects = PROJECTS_DATABASE.results;

  if (status) {
    filteredProjects = filteredProjects.filter(
      (project) => project.status === status
    );
  }

  if (projectType) {
    filteredProjects = filteredProjects.filter(
      (project) =>
        project.project_type === projectType ||
        project.tipo_proyecto === projectType
    );
  }

  const startIndex = (page - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  return {
    count: filteredProjects.length,
    results: paginatedProjects,
  };
}

// Función para obtener tipos de proyecto únicos
function getUniqueProjectTypes(isEnglish) {
  const field = isEnglish ? "project_type" : "tipo_proyecto";
  const types = PROJECTS_DATABASE.results
    .map((project) => project[field])
    .filter((type, index, self) => type && self.indexOf(type) === index)
    .sort();
  return types;
}

// Project Manager

class ProjectManager {
  constructor() {
    this.projectsPerPage = 12;
    this.currentPage = 1;
    this.totalPages = 1;
    this.currentFilter = "";
    this.currentTypeFilter = "";

    // Language detection
    const currentPage = window.location.pathname;
    this.isEnglish = currentPage.includes("/en/");

    // Language-specific messages
    this.messages = {
      en: {
        noProjects: "No projects found.",
        inProgress: "In Progress",
        completed: "Completed",
        moreInfo: "More Information",
        projectDescription:
          "{type} project with an estimated investment of {cost}€.",
        completedProjectDescription:
          "{type} project with a margin of {margin}€ and an IRR of {irr}%.",
        projectTypeField: "project_type",
        toDetermine: "Pending",
        allTypes: "All Types",
      },
      es: {
        noProjects: "No se encontraron proyectos.",
        inProgress: "En Curso",
        completed: "Finalizado",
        moreInfo: "Más Información",
        projectDescription:
          "Proyecto de {type} con una inversión estimada de {cost}€.",
        completedProjectDescription:
          "Proyecto de {type} con un margen de {margin}€ y una TIR de {irr}%.",
        projectTypeField: "tipo_proyecto",
        toDetermine: "Pendiente",
        allTypes: "Todos los Tipos",
      },
    };

    this.container = document.getElementById("projects-container");
    this.filter = document.getElementById("projects-filter");
    this.typeFilter = document.getElementById("projects-type-filter");

    this.init();
  }

  init() {
    this.populateTypeFilter();
    this.loadProjects();
    this.filter?.addEventListener("change", (e) => {
      this.currentFilter = e.target.value;
      this.loadProjects(1);
    });
    this.typeFilter?.addEventListener("change", (e) => {
      this.currentTypeFilter = e.target.value;
      this.loadProjects(1);
    });
  }

  populateTypeFilter() {
    if (!this.typeFilter) return;

    const types = getUniqueProjectTypes(this.isEnglish);
    const allTypesText = this.messages[this.isEnglish ? "en" : "es"].allTypes;

    // Clear existing options except the first one
    this.typeFilter.innerHTML = `<option value="">${allTypesText}</option>`;

    // Add options for each type
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      this.typeFilter.appendChild(option);
    });
  }

  loadProjects(page = 1) {
    this.currentPage = page;
    this.container.innerHTML = "";

    const data = getProjects(
      page,
      this.currentFilter,
      this.currentTypeFilter,
      this.projectsPerPage
    );

    this.totalPages = Math.ceil(data.count / this.projectsPerPage);

    if (data.results.length === 0) {
      this.container.innerHTML = `<div class="alert alert-info">${
        this.messages[this.isEnglish ? "en" : "es"].noProjects
      }</div>`;
      return;
    }

    this.renderContent(data.results);
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

      // Get the appropriate project type field based on language
      const projectTypeField =
        this.messages[this.isEnglish ? "en" : "es"].projectTypeField;
      const projectType =
        project[projectTypeField] ||
        project.project_type ||
        project.tipo_proyecto ||
        "";

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
              ${
                isCurrent
                  ? this.messages[this.isEnglish ? "en" : "es"].inProgress
                  : this.messages[this.isEnglish ? "en" : "es"].completed
              }
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
              <p class="mt-3">${
                isCurrent
                  ? this.messages[
                      this.isEnglish ? "en" : "es"
                    ].projectDescription
                      .replace("{type}", projectType)
                      .replace(
                        "{cost}",
                        project.cost === "N/A" || !project.cost
                          ? this.messages[this.isEnglish ? "en" : "es"]
                              .toDetermine
                          : parseFloat(project.cost).toLocaleString("es-ES", {
                              maximumFractionDigits: 0,
                            })
                      )
                  : this.messages[
                      this.isEnglish ? "en" : "es"
                    ].completedProjectDescription
                      .replace("{type}", projectType)
                      .replace("{margin}", margin)
                      .replace("{irr}", irr)
              }</p>
            </div>
                          <div class="overflow-hidden" style="margin-top: auto;">
              <div class="d-inline-block">
                <a class="d-flex align-items-center" href="project.html?id=${
                  project.id
                }">
                  ${this.messages[this.isEnglish ? "en" : "es"].moreInfo}
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
