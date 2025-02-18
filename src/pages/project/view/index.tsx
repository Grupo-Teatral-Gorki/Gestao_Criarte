/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Header from "@/components/ui/header/header";
import "./index.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Proponente {
  nome_proponente: string;
  tipo_proponente: string;
  email: string;
  celular: string;
  is_selected: boolean;
}

export default function View() {
  const router = useRouter();
  const [projectData, setProjectData] = useState<any>(null); // Altere 'any' para o tipo real do projeto, se possível
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const projetoId = localStorage.getItem("projetoId");

    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          "https://gorki-painel-admin-api.iglgxt.easypanel.host/project/view",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idProjeto: projetoId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error("Erro ao buscar os dados do projeto:", error);
      }
    };

    if (projetoId) {
      fetchProjectData();
    }
  }, []);

  const handleDownload = () => {
    const projetoId = localStorage.getItem("projetoId");
    const idCidade = localStorage.getItem("idCidade");

    if (!projetoId) {
      console.error("Projeto ID não encontrado no localStorage");
      return;
    }

    fetch(
      `https://gorki-aws-acess-api.iglgxt.easypanel.host/download-zip/${projetoId}/${idCidade}`
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `projeto-${projetoId}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error("Erro ao baixar zip:", error);
      });
  };

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!projectData) {
    return <div>Carregando...</div>;
  }

  // Extrai os dados relevantes da resposta da API
  const {
    nome_projeto,
    resumo_projeto,
    descricao,
    id_projeto,
    id_edital,
    nome_modalidade,
    modulo_projeto,
    proponentes,
  } = projectData;

  let descricaoParsed: {
    relevancia?: string;
    expectativa?: string;
    perfil?: string;
    contrapartida?: string;
    democratizacao?: string;
    divulgacao?: string;
    outras?: string;
    afirmativas?: string;
    local?: string;
  } = {};

  if (id_edital !== 2) {
    // Verifica se a 'descricao' é uma string válida antes de tentar parseá-la
    if (descricao && descricao.trim() !== "") {
      try {
        descricaoParsed = JSON.parse(descricao);
      } catch (error) {
        console.error("Erro ao fazer o parse de descricao:", error);
        descricaoParsed = {}; // Define como objeto vazio em caso de erro
      }
    } else {
      descricaoParsed = {}; // Se a descrição estiver vazia, define como vazio
    }
  }

  return (
    <div>
      <Header></Header>
      <div style={{ marginTop: "10px", marginLeft: "2.5%" }}>
        <Button
          variant="outline"
          onClick={() => {
            router.push("/projects");
          }}
          style={{
            marginRight: "5px",
            borderColor: "#1d4a5d",
            backgroundColor: "white",
            color: "#1d4a5d",
            width: "60px",
            fontSize: "10px",
            height: "15px",
            minHeight: "15px",
            borderRadius: "5px",
            padding: "15px",
          }}
        >
          Voltar
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ marginLeft: "2.5%" }}
          className="project-header project-card"
        >
          <div className="project-title">
            <p>Nome do projeto</p>
          </div>
          <div className="project-title-data">
            <span style={{ color: "GRAY", marginRight: "10px" }}>
              {id_projeto}
            </span>
            <span>{nome_projeto}</span>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginRight: "30px",
              minWidth: "100px",
            }}
            className="project-header project-card"
          >
            <div>
              <div style={{ minWidth: "150px" }} className="project-title">
                <p>Documentos</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "clamp(9px, 2vw, 14px)",
                }}
                className="project-title-data"
              >
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  style={{
                    marginRight: "5px",
                    borderColor: "#1d4a5d",
                    backgroundColor: "#1d4a5d",
                    color: "white",
                    width: "90px",
                    fontSize: "10px",
                    height: "13px",
                    minHeight: "13px",
                    borderRadius: "5px",
                    padding: "13px",
                  }}
                >
                  Baixar Todos
                </Button>{" "}
              </div>
            </div>
          </div>
          {id_edital !== 2 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginRight: "30px",
                  minWidth: "100px",
                }}
                className="project-header project-card"
              >
                <div>
                  <div style={{ minWidth: "100px" }} className="project-title">
                    <p>Modalidade</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "clamp(9px, 2vw, 14px)",
                    }}
                    className="project-title-data"
                  >
                    <span>{nome_modalidade}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginRight: "30px",
                  minWidth: "100px",
                }}
                className="project-header project-card"
              >
                <div>
                  <div style={{ minWidth: "100px" }} className="project-title">
                    <p>Módulo</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "clamp(9px, 2vw, 14px)",
                    }}
                    className="project-title-data"
                  >
                    <span>{modulo_projeto}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="project-proponentes">
        <div className="proponentes-card-title">
          <p>Proponentes</p>
        </div>
        <Table className="shad-table">
          <TableHeader>
            <TableRow style={{ color: "gray" }}>
              <TableHead className="w-[200px]">Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Selecionado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proponentes &&
              proponentes.map((proponente: Proponente, index: number) => (
                <TableRow key={index}>
                  <TableCell>{proponente.nome_proponente}</TableCell>
                  <TableCell>{proponente.tipo_proponente}</TableCell>
                  <TableCell>{proponente.email}</TableCell>
                  <TableCell>{proponente.celular}</TableCell>
                  <TableCell
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {proponente.is_selected ? (
                      <img
                        width="15"
                        height="15"
                        src="https://img.icons8.com/ios-filled/50/40C057/checked-checkbox.png"
                        alt="checked-checkbox"
                      />
                    ) : (
                      <img
                        width="15"
                        height="15"
                        src="https://img.icons8.com/ios-filled/50/FA5252/close-window.png"
                        alt="close-window"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {id_edital === 2 ? (
        <div
          style={{
            color: "#1d4a5d",
            maxWidth: "95%",
            backgroundColor: "#a6c7e3",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          <Alert variant="default">
            <Info className="w-4 h-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Projetos de premiação não possuem corpo em texto
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="project-content">
          <div className="content-card-title">
            <p>Conteudo do projeto</p>
          </div>
          <div className="label-resumo-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Resumo do projeto
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? resumo_projeto : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-relevancia-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Relevancia e pertinencia do projeto
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.relevancia : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-perfil-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Perfil de público e classificação indicativa projeto
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.perfil : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-expectativa-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Expectativa da quantidade do público alcançado com o projeto
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.expectativa : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-detalhamento-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Detalhamento da proposta de contrapartida do projeto
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.contrapartida : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-medidas-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Medidas de democratização de acesso e acessibilidade
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.democratizacao : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-local-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Plano de Divulgação
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.divulgacao : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-afirmativas-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Afirmativas
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.afirmativas : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-local-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Local de realização
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.local : ""}
                disabled
              />
            </div>
          </div>
          <div className="label-outras-projeto">
            <span
              style={{
                color: "#1d4a5d",
                fontSize: "15px",
                fontWeight: "bold",
                marginLeft: "30px",
                padding: "2px",
                marginTop: "10px",
              }}
            >
              Outras Informações
            </span>
            <div className="content-box">
              <Textarea
                value={id_edital !== 2 ? descricaoParsed.outras : ""}
                disabled
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
