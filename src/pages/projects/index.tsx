"use client";
import Header from "@/components/ui/header/header";
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import "./index.css";
import { ProjectsTable } from "@/components/projects-table/table";
import CityFilter from "@/components/city-filter-cmb/filterCmb";


interface StatusCount {
  rascunho: number | null;
  enviado: number | null;
  recurso: number | null;
  habilitacao: number | null;
}

const fetchData = async (idCidade: string): Promise<StatusCount> => {
  const response = await fetch(`https://gorki-painel-admin-api.iglgxt.easypanel.host/projects/status-overview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idCidade }),
  });
  if (!response.ok) {
    throw new Error("Erro ao buscar dados da API");
  }
  const data = await response.json();
  return data; // Espera-se que a API retorne no formato { rascunho: 50, enviado: 61, recurso: 0, habilitacao: 0 }
};

export default function View() {
  const [statusCount, setStatusCount] = useState<StatusCount>({
    rascunho: null,
    enviado: null,
    recurso: null,
    habilitacao: null,
  });

  useEffect(() => {
    const loadData = async () => {
      const idCidade = localStorage.getItem("idCidade");
      if (!idCidade) {
        console.error("idCidade não encontrado no localStorage");
        return;
      }

      try {
        const data = await fetchData(idCidade);

        // Atualize o estado com a contagem da API
        setStatusCount(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  const router = useRouter();

  return (
    <div>
      <Header />
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex" }} className="filters">
          <Button
            onClick={() => {
              router.push('/dash');
            }}
            variant="outline"
            style={{ marginRight: "5px", color: "#1d4a5d" }}
          >
            Voltar
          </Button>
          <CityFilter />
        </div>

        {/* Contador de Projetos */}
        <div className="header-projects-count" style={{ display: "flex", gap: "20px", marginLeft: "20px" }}>
          <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '5px 0px 0px 5px', marginRight: '-18px', minWidth: '100px' }} className="data-count-project">
            <div>
              <span style={{ display: "flex", color: "#1d4a5d", fontSize: "10px", fontWeight: "bold", justifyContent: 'center' }}>
                <img style={{ marginRight: "5px", width: "14px", height: "14px" }} src="https://img.icons8.com/?size=100&id=uvB5FAw8S1Yt&format=png&color=000000" alt="Rascunho" />{" "}
                Rascunhos
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", color: "#1d4a5d", fontWeight: "bold" }}>
              <span style={{ fontSize: "1em" }}>
                {statusCount.rascunho !== null ? statusCount.rascunho : "Carregando..."}
              </span>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '5px', marginRight: '-18px', minWidth: '100px' }} className="data-count-project">
            <div>
              <span style={{ display: "flex", color: "#1d4a5d", fontSize: "10px", fontWeight: "bold", justifyContent: 'center' }}>
                <img style={{ marginRight: "5px", width: "14px", height: "14px" }} src="https://img.icons8.com/pulsar-gradient/48/file-arrow.png" alt="Enviado" />{" "}
                Enviados
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", color: "#1d4a5d", fontWeight: "bold" }}>
              <span style={{ fontSize: "1em" }}>
                {statusCount.enviado !== null ? statusCount.enviado : "Carregando..."}
              </span>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '5px', marginRight: '-18px', minWidth: '100px' }} className="data-count-project">
            <div>
              <span style={{ display: "flex", color: "#1d4a5d", fontSize: "10px", fontWeight: "bold", justifyContent: 'center' }}>
                <img style={{ marginRight: "5px", width: "14px", height: "14px" }} src="https://img.icons8.com/pulsar-gradient/48/documents.png" alt="Enviado" />{" "}
                Habilitação
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", color: "#1d4a5d", fontWeight: "bold" }}>
              <span style={{ fontSize: "1em" }}>
                {statusCount.habilitacao !== null ? statusCount.habilitacao : "Carregando..."}
              </span>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '0px 5px 5px 0px', minWidth: '100px' }} className="data-count-project">
            <div>
              <span style={{ display: "flex", color: "#1d4a5d", fontSize: "10px", justifyContent: 'center', fontWeight: "bold" }}>
                <img style={{ marginRight: "5px", width: "14px", height: "14px" }} src="https://img.icons8.com/pulsar-gradient/48/high-priority.png" alt="Recurso" />{" "}
                Recurso
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", color: "#1d4a5d", fontWeight: "bold" }}>
              <span style={{ fontSize: "1em" }}>
                {statusCount.recurso !== null ? statusCount.recurso : "Carregando..."}
              </span>
            </div>
          </div>
        </div>

        <div
          className="header-buttons"
          style={{
            display: "flex",
            marginLeft: "auto",
            gap: "10px",
          }}
        >
          <Button
            variant="outline"
            style={{
              color: "black",
              backgroundColor: "white",
              cursor: "not-allowed"
            }}
          >
            Baixar Dados
          </Button>
          <Button
            variant="outline"
            style={{ backgroundColor: "#b82c2c", color: "white",               cursor: "not-allowed"
            }}
          >
            Reportar Problema
          </Button>
        </div>
      </div>

      {/* Tabela de Projetos */}
      <div style={{ marginTop: "20px" }}>
        <ProjectsTable />
      </div>
    </div>
  );
}
  