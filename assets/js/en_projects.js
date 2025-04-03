// Script unificado para cargar dinámicamente los proyectos (pasados y actuales)

document.addEventListener("DOMContentLoaded", function () {
  // Determinar qué tipo de proyectos cargar basado en la página actual
  const currentPage = window.location.pathname.split("/").pop();
  const isCurrentProjects = currentPage.includes("current");
  const projectStatus = isCurrentProjects ? "current" : "past";
  const detailPagePrefix = isCurrentProjects ? "currentproject" : "pastproject";

  // Array para almacenar todos los proyectos
  let allProjects = [];

  // Función para obtener todos los proyectos (recursiva para manejar paginación)
  async function fetchAllProjects(
    url = `https://caret-u6dxo.ondigitalocean.app/api/projects/?status=${projectStatus}`
  ) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al obtener los proyectos");
      }

      const data = await response.json();

      // Añadir los resultados actuales al array de todos los proyectos
      allProjects = allProjects.concat(data.results);

      // Si hay una página siguiente, seguir obteniendo proyectos
      if (data.next) {
        await fetchAllProjects(data.next);
      } else {
        // Una vez que se han cargado todos los proyectos, mostrarlos
        displayProjects();
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

  // Función para mostrar los proyectos
  function displayProjects() {
    // Si no hay proyectos, mostrar mensaje
    if (allProjects.length === 0) {
      document.getElementById("loading-indicator").innerHTML = `
          <div class="alert alert-info" role="alert">
            No ${isCurrentProjects ? "current" : "past"} projects found.
          </div>
          `;
      return;
    }

    // Ocultar el indicador de carga
    document.getElementById("loading-indicator").style.display = "none";

    // Contenedor de proyectos
    const projectsContainer = document.getElementById("projects-container");

    // En lugar de crear filas manualmente, dejar que Bootstrap maneje el flujo de columnas
    const row = document.createElement("div");
    row.className = "row";
    projectsContainer.appendChild(row);

    // Añadir todos los proyectos a una única fila
    allProjects.forEach((project) => {
      // Crear elemento de columna para cada proyecto
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 py-0 mt-4";

      // Añadir el HTML del proyecto a la columna
      col.innerHTML = createProjectHTML(project);

      // Añadir la columna a la fila
      row.appendChild(col);
    });

    // Reinicializar animaciones y otros componentes del tema
    if (typeof window.reInitializeComponents === "function") {
      window.reInitializeComponents();
    }
  }

  // Función para crear HTML de un proyecto
  function createProjectHTML(project) {
    // Formatear los valores numéricos con puntos y comas apropiados para español
    const formattedArea = parseFloat(project.area).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const formattedBuyPrice = parseFloat(project.buy_price).toLocaleString(
      "es-ES",
      {
        maximumFractionDigits: 0,
      }
    );
    const formattedSellPrice = parseFloat(project.sell_price).toLocaleString(
      "es-ES",
      {
        maximumFractionDigits: 0,
      }
    );
    const formattedMargin = parseFloat(project.margin).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const formattedIRR = parseFloat(project.irr).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedBuyExpenses = parseFloat(
      project.buy_expenses
    ).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const formattedSellExpenses = parseFloat(
      project.sell_expenses
    ).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const formattedOtherExpenses = parseFloat(
      project.other_expenses
    ).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const totalExpenses = (
      parseFloat(project.buy_expenses) +
      parseFloat(project.sell_expenses) +
      parseFloat(project.other_expenses) +
      parseFloat(project.financing_expenses)
    ).toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
    const buyDate = `${project.buy_month}/${project.buy_year}`;
    const sellDate = project.sell_month
      ? `${project.sell_month}/${project.sell_year}`
      : `${project.sell_year}`;

    // Texto condicional basado en si es un proyecto actual o pasado
    const returnText = isCurrentProjects
      ? `Project of ${project.project_type_en.toLowerCase()} with ${formattedArea} m² carried out in ${buyDate}. It was acquired for €${formattedBuyPrice}, with associated expenses of €${totalExpenses}. An expected return of €${formattedSellPrice} is projected in ${sellDate}, generating a margin of €${formattedMargin} and an IRR of ${formattedIRR}%.`
      : `Project of ${project.project_type_en.toLowerCase()} with ${formattedArea} m² carried out in ${buyDate}. It was acquired for €${formattedBuyPrice}, with associated expenses of €${totalExpenses}. It was later sold for €${formattedSellPrice}, generating a margin of €${formattedMargin} and an IRR of ${formattedIRR}%.`;

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
              <a href="${detailPagePrefix}.html?id=${project.id}">
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
                <a class="d-flex align-items-center" href="${detailPagePrefix}.html?id=${project.id}"
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

  // Iniciar la carga de proyectos
  fetchAllProjects();
});
