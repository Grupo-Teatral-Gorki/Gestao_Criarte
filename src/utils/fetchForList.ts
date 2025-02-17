// Define the interfaces
export interface ProjetoOverview {
  id_projeto: number;
  status: string;
  nome_proponente: string;
  tipo_edital: number;
  id_usuario: number;
  id_cidade: number;
}

interface Projeto {
  id_projeto: number;
  id_edital: number;
  nome_projeto: string;
  nome_modalidade: string;
  modulo_projeto: number;
  resumo_projeto: string;
  descricao: string;
  proponentes: Proponente[];
}

interface Proponente {
  nome_proponente: string;
  email: string;
  celular: string;
  tipo_proponente: string;
  is_selected: boolean;
}

// Function to make the API call and process the data
export const fetchProjetosLista = async (projetos: ProjetoOverview[]) => {
  const enviadoProjetos = projetos.filter(
    (p) => p.status.toLowerCase() === "enviado"
  );
  const rascunhoProjetos = projetos.filter(
    (p) => p.status.toLowerCase() === "rascunho"
  );

  const fetchProjetoDetails = async (id: number): Promise<Projeto> => {
    const response = await fetch(
      "https://gorki-painel-admin-api.iglgxt.easypanel.host/project/view",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idProjeto: id }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch projeto details");
    }

    return response.json();
  };

  // Function to filter and remove duplicates, keeping only the name of the selected proponente
  const filterAndRemoveDuplicates = (projetos: Projeto[]): Projeto[] => {
    const seen = new Set<number>();
    return projetos
      .map((projeto) => {
        if (seen.has(projeto.id_projeto)) return null;
        seen.add(projeto.id_projeto);

        // Filter out proponentes that are not selected, then assign only the selected one’s name
        const selectedProponente = projeto.proponentes.find(
          (p) => p.is_selected
        );
        projeto.proponentes = selectedProponente
          ? [
              {
                ...selectedProponente,
                nome_proponente: selectedProponente.nome_proponente,
              },
            ]
          : [];

        return projeto;
      })
      .filter(Boolean) as Projeto[]; // Filter out any null values
  };

  // Fetch Projeto details for "enviado" status
  const enviadoProjetosDetails = await Promise.all(
    enviadoProjetos.map((projeto) => fetchProjetoDetails(projeto.id_projeto))
  );

  // Fetch Projeto details for "rascunho" status
  const rascunhoProjetosDetails = await Promise.all(
    rascunhoProjetos.map((projeto) => fetchProjetoDetails(projeto.id_projeto))
  );

  // Filter and remove duplicates for "enviado" projects
  const enviadoProjetosFiltered = filterAndRemoveDuplicates(
    enviadoProjetosDetails
  );

  // Filter and remove duplicates for "rascunho" projects
  const rascunhoProjetosFiltered = filterAndRemoveDuplicates(
    rascunhoProjetosDetails
  );

  // Organize "enviado" projects by modulo_projeto
  const modulo1Enviado = enviadoProjetosFiltered.filter(
    (projeto) => projeto.modulo_projeto === 1
  );
  const modulo2Enviado = enviadoProjetosFiltered.filter(
    (projeto) => projeto.modulo_projeto === 2
  );

  // Set all filtered projects in localStorage
  localStorage.setItem("modulo1", JSON.stringify(modulo1Enviado));
  localStorage.setItem("modulo2", JSON.stringify(modulo2Enviado));
  localStorage.setItem("rascunho", JSON.stringify(rascunhoProjetosFiltered));

  return;
};
