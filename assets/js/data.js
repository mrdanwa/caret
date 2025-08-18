// Base de datos local de proyectos
const PROJECTS_DATABASE = {
  results: [
    {
      id: 1,
      name: "Camí Ral",
      location: "Mataró, Barcelona",
      tipo_proyecto: "Agrupación y cambio de uso a vivienda (2 oficinas)",
      project_type: "Grouping and change of use to housing (2 offices)",
      area: 161,
      description: "",
      descripcion: "",
      buy_year: "2023",
      buy_month: "3",
      sell_year: "2024",
      sell_month: "11",
      cost: 220000,
      revenue: 346000,
      margin: 126000,
      irr: 32.3,
      status: "current",
      image: "../assets/images/projects/cami_ral/1.webp",
      additional_images: [
        { image: "../assets/images/projects/cami_ral/1.webp" },
        { image: "../assets/images/projects/cami_ral/2.webp" },
        { image: "../assets/images/projects/cami_ral/3.webp" },
        { image: "../assets/images/projects/cami_ral/4.webp" },
        { image: "../assets/images/projects/cami_ral/5.webp" },
        { image: "../assets/images/projects/cami_ral/6.webp" },
      ],
    },
    {
      id: 2,
      name: "Riera de Cassoles",
      location: "Cassoles, Barcelona",
      tipo_proyecto: "Cambio de uso (oficina a vivienda)",
      project_type: "Change of use (office to housing)",
      area: 90,
      description: "",
      descripcion: "",
      buy_year: "2023",
      buy_month: "3",
      sell_year: "2024",
      sell_month: "11",
      cost: 430000,
      revenue: 525000,
      margin: 95000,
      irr: 24,
      status: "current",
      image: "../assets/images/projects/cassoles/3.webp",
      additional_images: [
        { image: "../assets/images/projects/cassoles/1.webp" },
        { image: "../assets/images/projects/cassoles/2.webp" },
        { image: "../assets/images/projects/cassoles/3.webp" },
        { image: "../assets/images/projects/cassoles/4.webp" },
        { image: "../assets/images/projects/cassoles/5.webp" },
      ],
    },
    {
      id: 3,
      name: "Illescas",
      location: "Illescas, Toledo",
      tipo_proyecto: "Obra nueva (5 viviendas)",
      project_type: "New construction (5 houses)",
      area: 550,
      description: "",
      descripcion: "",
      buy_year: "2023",
      buy_month: "3",
      sell_year: "2024",
      sell_month: "11",
      cost: 661000,
      revenue: 652000,
      margin: 0,
      irr: 0,
      status: "current",
      image: "../assets/images/projects/illescas/3.webp",
      additional_images: [
        { image: "../assets/images/projects/illescas/1.webp" },
        { image: "../assets/images/projects/illescas/2.webp" },
        { image: "../assets/images/projects/illescas/3.webp" },
        { image: "../assets/images/projects/illescas/4.webp" },
        { image: "../assets/images/projects/illescas/5.webp" },
        { image: "../assets/images/projects/illescas/6.webp" },
        { image: "../assets/images/projects/illescas/7.webp" },
        { image: "../assets/images/projects/illescas/8.webp" },
        { image: "../assets/images/projects/illescas/9.webp" },
        { image: "../assets/images/projects/illescas/10.webp" },
      ],
    },
    {
      id: 4,
      name: "Virgen de Lourdes",
      location: "Concepción, Madrid",
      tipo_proyecto: "Compra-reforma-venta de vivienda",
      project_type: "Purchase-renovation-sale of housing",
      area: 78,
      description: "",
      descripcion: "",
      buy_year: "2023",
      buy_month: "3",
      sell_year: "2024",
      sell_month: "11",
      cost: 234000,
      revenue: 255000,
      margin: 21000,
      irr: 33.4,
      status: "past",
      image: "../assets/images/projects/virgen_lourdes/6.webp",
      additional_images: [
        { image: "../assets/images/projects/virgen_lourdes/1.webp" },
        { image: "../assets/images/projects/virgen_lourdes/2.webp" },
        { image: "../assets/images/projects/virgen_lourdes/3.webp" },
        { image: "../assets/images/projects/virgen_lourdes/4.webp" },
        { image: "../assets/images/projects/virgen_lourdes/5.webp" },
        { image: "../assets/images/projects/virgen_lourdes/6.webp" },
        { image: "../assets/images/projects/virgen_lourdes/7.webp" },
        { image: "../assets/images/projects/virgen_lourdes/8.webp" },
        { image: "../assets/images/projects/virgen_lourdes/9.webp" },
      ],
    },
    {
      id: 5,
      name: "José Grollo",
      location: "Benicalap, Valencia",
      tipo_proyecto: "Obra nueva (23 viviendas)",
      project_type: "New construction (23 houses)",
      area: 2500,
      description: "",
      descripcion: "",
      buy_year: "2023",
      buy_month: "3",
      sell_year: "2024",
      sell_month: "11",
      cost: 945000,
      revenue: 5165000,
      margin: 862000,
      irr: 15,
      status: "current",
      image: "../assets/images/projects/grollo/3.webp",
      additional_images: [
        { image: "../assets/images/projects/grollo/1.webp" },
        { image: "../assets/images/projects/grollo/2.webp" },
        { image: "../assets/images/projects/grollo/3.webp" },
        { image: "../assets/images/projects/grollo/4.webp" },
        { image: "../assets/images/projects/grollo/5.webp" },
        { image: "../assets/images/projects/grollo/6.webp" },
        { image: "../assets/images/projects/grollo/7.webp" },
        { image: "../assets/images/projects/grollo/8.webp" },
        { image: "../assets/images/projects/grollo/9.webp" },
        { image: "../assets/images/projects/grollo/10.webp" },
      ],
    },
  ],
};

// Función para obtener proyectos con paginación y filtros
function getProjects(page = 1, status = "", projectsPerPage = 12) {
  let filteredProjects = PROJECTS_DATABASE.results;

  // Aplicar filtro de estado si se especifica
  if (status) {
    filteredProjects = filteredProjects.filter(
      (project) => project.status === status
    );
  }

  // Calcular paginación
  const startIndex = (page - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  return {
    count: filteredProjects.length,
    results: paginatedProjects,
  };
}

// Función para obtener un proyecto específico por ID
function getProjectById(id) {
  return PROJECTS_DATABASE.results.find(
    (project) => project.id === parseInt(id)
  );
}
