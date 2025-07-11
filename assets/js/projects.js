// Script unificado para cargar dinámicamente todos los proyectos (pasados y actuales)

document.addEventListener("DOMContentLoaded", function () {
  // Array para almacenar todos los proyectos
  let allProjects = [];

  // Función para obtener todos los proyectos de un tipo (recursiva para manejar paginación)
  async function fetchProjectsByStatus(status, url = null) {
    const baseUrl = `https://caret-ek3gf.ondigitalocean.app/api/projects/?status=${status}`;
    const fetchUrl = url || baseUrl;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error("Error al obtener los proyectos");
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
              Error al cargar los proyectos. Por favor, intente nuevamente más tarde.
            </div>
          `;
    }
  }

  // Función para cargar ambos tipos de proyectos y mostrarlos juntos
  async function fetchAllProjects() {
    await Promise.all([
      fetchProjectsByStatus("current"),
      fetchProjectsByStatus("past"),
    ]);
    displayProjects();
  }

  // Función para mostrar los proyectos
  function displayProjects() {
    // Si no hay proyectos, mostrar mensaje
    if (allProjects.length === 0) {
      document.getElementById("loading-indicator").innerHTML = `
            <div class="alert alert-info" role="alert">
              No se encontraron proyectos.
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
    const returnText =
      project.status === "current"
        ? `Proyecto de ${project.project_type.toLowerCase()} de ${formattedArea} m² realizado en ${buyDate}. Se adquirió por ${formattedBuyPrice} €, con unos gastos asociados de ${totalExpenses} €. Se espera un retorno de ${formattedSellPrice} € en ${sellDate}, generando un margen de ${formattedMargin} € y una TIR del ${formattedIRR}%.`
        : `Proyecto de ${project.project_type.toLowerCase()} de ${formattedArea} m² realizado en ${buyDate}. Se adquirió por ${formattedBuyPrice} €, con unos gastos asociados de ${totalExpenses} €. Posteriormente, se vendió por ${formattedSellPrice} €, generando un margen de ${formattedMargin} € y una TIR del ${formattedIRR}%.`;

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
                  >Más Información
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
