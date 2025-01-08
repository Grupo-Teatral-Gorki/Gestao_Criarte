import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import './table.css'

interface Project {
  id_projeto: number;
  status: string | null;
  nome_proponente: string | null;
  data_prevista_inicio: string | null;
  data_prevista_fim: string | null;
}

const fetchData = async (): Promise<Project[]> => {
  const response = await fetch("https://apiv3.styxx.com.br/projetos/resumo");
  if (!response.ok) {
    throw new Error("Erro ao buscar dados da API");
  }
  const data = await response.json();
  return data;
};

export function OvwTable() {
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setProjects(data.slice(-10));
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Rascunho":
        return <img src="https://img.icons8.com/?size=100&id=uvB5FAw8S1Yt&format=png&color=000000" alt="Rascunho" width={24} height={24} />;
      case "enviado":
        return <img src="https://img.icons8.com/pulsar-gradient/48/file-arrow.png" alt="Enviado" width={24} height={24} />;
      case "Recurso":
        return <img src="/icons/appeal.png" alt="Recurso" width={24} height={24} />;
      case "Habilitação":
        return <img src="/icons/qualification.png" alt="Habilitação" width={24} height={24} />;
      case null:
        return <img src="https://img.icons8.com/?size=100&id=uvB5FAw8S1Yt&format=png&color=000000" alt="Rascunho" width={24} height={24} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>Últimos eventos dentro da plataforma</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Projeto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Proponente</TableHead>
            <TableHead>Data Prevista Início</TableHead>
            <TableHead>Data Prevista Fim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id_projeto}>
              <TableCell className="font-medium">{project.id_projeto || "Indefinido"}</TableCell>
              <TableCell className="flex items-center">
                {getStatusIcon(project.status)}
                <span className="ml-2">{project.status ? project.status.toUpperCase() : "RASCUNHO"}</span>
              </TableCell>
              <TableCell>{project.nome_proponente || "Sem Nome"}</TableCell>
              <TableCell>{project.data_prevista_inicio ? new Date(project.data_prevista_inicio).toLocaleDateString() : "Não definido"}</TableCell>
              <TableCell>{project.data_prevista_fim ? new Date(project.data_prevista_fim).toLocaleDateString() : "Não definido"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
