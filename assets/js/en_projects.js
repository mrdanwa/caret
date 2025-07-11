// Script unificado para cargar dinámicamente todos los proyectos (past and current)

document.addEventListener("DOMContentLoaded", function () {
  // Array to store all projects
  let allProjects = [];

  // Function to fetch all projects of a given status (recursive for pagination)
  async function fetchProjectsByStatus(status, url = null) {
    const baseUrl = `https://caret-ek3gf.ondigitalocean.app/api/projects/?status=${status}`;
    const fetchUrl = url || baseUrl;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error("Error loading the projects");
      }
      const data = await response.json();
      allProjects = allProjects.concat(data.results);
      if (data.next) {
        await fetchProjectsByStatus(status, data.next);
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("loading-indicator").innerHTML = `
            <div class="alert alert-danger" role="alert">
              Error loading the projects. Please try again later.
            </div>
          `;
    }
  }

  // Function to fetch both types of projects and display them together
  async function fetchAllProjects() {
    await Promise.all([
      fetchProjectsByStatus("current"),
      fetchProjectsByStatus("past"),
    ]);
    displayProjects();
  }

  // Function to display projects
  function displayProjects() {
    if (allProjects.length === 0) {
      document.getElementById("loading-indicator").innerHTML = `
          <div class="alert alert-info" role="alert">
            No projects found.
          </div>
          `;
      return;
    }

    document.getElementById("loading-indicator").style.display = "none";
    const projectsContainer = document.getElementById("projects-container");
    const row = document.createElement("div");
    row.className = "row";
    projectsContainer.appendChild(row);

    allProjects.forEach((project) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 py-0 mt-4";
      col.innerHTML = createProjectHTML(project);
      row.appendChild(col);
    });

    if (typeof window.reInitializeComponents === "function") {
      window.reInitializeComponents();
    }
  }

  // Function to create HTML for a project
  function createProjectHTML(project) {
    // Format margin and IRR for Spanish locale (for consistency)
    const formattedMargin = parseFloat(project.margin).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const formattedIRR = parseFloat(project.irr).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Conditional text based on project type
    let returnText;
    if (project.status === "current") {
      returnText = `Project of ${project.project_type_en.toLowerCase()} with an estimated margin of €${formattedMargin} and estimated IRR of ${formattedIRR}%.`;
    } else {
      returnText = `Project of ${project.project_type_en.toLowerCase()} with a margin of €${formattedMargin} and IRR of ${formattedIRR}%.`;
    }

    return `
        <div class="background-white pb-4 h-100 radius-secondary" style="display: flex; flex-direction: column;">
          <img
            class="w-100 radius-tr-secondary radius-tl-secondary"
            src="${
              project.image
                ? project.image
                : "../assets/images/images/caret.webp"
            }"
            alt="${project.name}"
            onerror="this.src='../assets/images/images/caret.webp';"
            style="height: 225px; object-fit: cover;"
          />
          <div class="px-4 pt-4" style="flex-grow: 1; display: flex; flex-direction: column;">
            <div class="overflow-hidden">
              <a href="project.html?id=${project.id}">
                <h5>${project.name}</h5>
              </a>
            </div>
            <div class="overflow-hidden">
              <p class="color-7">${project.location}</p>
            </div>
            <div class="overflow-hidden">
              <p class="mt-3">
                ${returnText}
              </p>
            </div>
            <div class="overflow-hidden" style="margin-top: auto;">
              <div class="d-inline-block">
                <a class="d-flex align-items-center" href="project.html?id=${
                  project.id
                }"
                  >More Information
                  <div class="overflow-hidden ml-2">
                    <span class="d-inline-block">&xrarr;</span>
                  </div></a
                >
              </div>
            </div>
          </div>
        </div>
      `;
  }

  // Start loading projects
  fetchAllProjects();
});
