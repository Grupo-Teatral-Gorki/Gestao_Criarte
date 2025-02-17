/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "./table.css";
import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import router from "next/router";
import { Project as OriginalProject } from "@/pages/pdftable";
import { ProjetoOverview } from "@/utils/fetchForList";

interface Project extends OriginalProject {
  status: "rascunho" | "enviado" | "Recurso" | "Habilitação";
}

const fetchData = async (idCidade: string): Promise<Project[]> => {
  const response = await fetch(
    `https://gorki-painel-admin-api.iglgxt.easypanel.host/projects/ovw`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idCidade }),
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar dados da API");
  }
  const data = await response.json();
  localStorage.setItem("projetos", JSON.stringify(data));
  return data; // Retorna os últimos 10 projetos
};

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id_projeto",
    header: "Projeto",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium">{row.getValue("id_projeto")}</span>
          </TooltipTrigger>
          <TooltipContent style={{ backgroundColor: "white", color: "black" }}>
            Id único relacionado ao projeto do usuário
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              {getStatusIcon(row.getValue("status"))}
              <span className="ml-2 capitalize">
                {row.getValue("status") || "Rascunho"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent style={{ backgroundColor: "white", color: "black" }}>
            Status do projeto do usuário
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "nome_proponente",
    header: "Proponente",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{row.getValue("nome_proponente") || "Sem Nome"}</div>
          </TooltipTrigger>
          <TooltipContent style={{ backgroundColor: "white", color: "black" }}>
            Nome do proponente
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "tipo_edital",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo_edital");
      const label =
        tipo === 1
          ? "Fomento"
          : tipo === 2
          ? "Premiação"
          : tipo === 4
          ? "Subsídio"
          : tipo === 3
          ? "Áreas Perifericas"
          : "Desconhecido";

      return (
        <p
          style={{
            backgroundColor: tipo === 1 ? "#1d4a5d" : "#fe9f56",
            color: "white",
            textAlign: "center",
            maxWidth: "85px",
            borderRadius: "5px",
          }}
        >
          {label}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ backgroundColor: "white" }} align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem style={{ cursor: "not-allowed" }}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem style={{ cursor: "not-allowed" }}>
            Excluir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            style={{ cursor: "pointer" }}
            onClick={() => {
              const projetoId = row.getValue("id_projeto") as string; // Ou 'as number', dependendo do tipo esperado
              localStorage.setItem("projetoId", projetoId);
              router.push(`/project/view`);
            }}
          >
            Visualizar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function getStatusIcon(status: string | null) {
  switch (status) {
    case "rascunho":
    case null:
      return (
        <img
          src="https://img.icons8.com/?size=100&id=uvB5FAw8S1Yt&format=png&color=000000"
          alt="Rascunho"
          width={24}
          height={24}
        />
      );
    case "enviado":
      return (
        <img
          src="https://img.icons8.com/pulsar-gradient/48/file-arrow.png"
          alt="Enviado"
          width={24}
          height={24}
        />
      );
    case "Recurso":
      return (
        <img src="/icons/appeal.png" alt="Recurso" width={24} height={24} />
      );
    case "Habilitação":
      return (
        <img
          src="/icons/qualification.png"
          alt="Habilitação"
          width={24}
          height={24}
        />
      );
    default:
      return null;
  }
}

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [listData, setListData] = useState<ProjetoOverview[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const idCidade = localStorage.getItem("idCidade");
      if (!idCidade) {
        console.error("idCidade não encontrado no localStorage");
        return;
      }

      try {
        const data = await fetchData(idCidade);
        setListData(data);
        setProjects(data);

        // Contar os projetos por status
        const statusCount = {
          rascunho: 0,
          enviado: 0,
          recurso: 0,
          habilitacao: 0,
        };

        data.forEach((project) => {
          switch (project.status) {
            case "rascunho":
            case null:
              statusCount.rascunho += 1;
              break;
            case "enviado":
              statusCount.enviado += 1;
              break;
            case "Recurso":
              statusCount.recurso += 1;
              break;
            case "Habilitação":
              statusCount.habilitacao += 1;
              break;
          }
        });

        // Armazenar os totais no localStorage
        localStorage.setItem("statusCount", JSON.stringify(statusCount));
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="projects-table">
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            style={{ color: "black" }}
            placeholder="Filtrar proponente..."
            value={
              (table
                .getColumn("nome_proponente")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("nome_proponente")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuContent
              style={{ backgroundColor: "white" }}
              align="end"
            >
              {table.getAllColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end py-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

const responseMock = [
  {
    id_projeto: 2257,
    status: "enviado",
    nome_proponente: "ANA CLAUDIA CARDOSO BIZARRI",
    tipo_edital: 1,
    id_usuario: 320,
    id_cidade: 3716,
  },
  {
    id_projeto: 2261,
    status: "rascunho",
    nome_proponente: "Proponente Teste",
    tipo_edital: 1,
    id_usuario: 321,
    id_cidade: 3716,
  },
  {
    id_projeto: 2268,
    status: "rascunho",
    nome_proponente: "MARCOS ANTONIO TEMPONI",
    tipo_edital: 1,
    id_usuario: 323,
    id_cidade: 3716,
  },
  {
    id_projeto: 2270,
    status: "enviado",
    nome_proponente: "ANA CLAUDIA CARDOSO BIZARRI",
    tipo_edital: 1,
    id_usuario: 320,
    id_cidade: 3716,
  },
  {
    id_projeto: 2272,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2273,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2278,
    status: "rascunho",
    nome_proponente: "Associação Unidos da Terceira Idade",
    tipo_edital: 1,
    id_usuario: 327,
    id_cidade: 3716,
  },
  {
    id_projeto: 2283,
    status: "rascunho",
    nome_proponente: "Associação Unidos da Terceira Idade",
    tipo_edital: 1,
    id_usuario: 327,
    id_cidade: 3716,
  },
  {
    id_projeto: 2284,
    status: "enviado",
    nome_proponente: "Fernando Donizete Genari",
    tipo_edital: 1,
    id_usuario: 325,
    id_cidade: 3716,
  },
  {
    id_projeto: 2287,
    status: "enviado",
    nome_proponente: "Carlos Frinka Neto",
    tipo_edital: 1,
    id_usuario: 333,
    id_cidade: 3716,
  },
  {
    id_projeto: 2291,
    status: "enviado",
    nome_proponente: "Damiani Raqueli Soares Pereira",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2291,
    status: "enviado",
    nome_proponente:
      "Damiani Raqueli Soares Pereira 40049511866 ( Núcleo de Dança Damiani Raqueli)",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2292,
    status: "enviado",
    nome_proponente: "Damiani Raqueli Soares Pereira",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2292,
    status: "enviado",
    nome_proponente:
      "Damiani Raqueli Soares Pereira 40049511866 ( Núcleo de Dança Damiani Raqueli)",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2300,
    status: "rascunho",
    nome_proponente: "CRISTIANE SILVA DOS SANTOS",
    tipo_edital: 1,
    id_usuario: 332,
    id_cidade: 3716,
  },
  {
    id_projeto: 2302,
    status: "rascunho",
    nome_proponente: "Centro Educacional Maria Mãe de Todos",
    tipo_edital: 1,
    id_usuario: 340,
    id_cidade: 3716,
  },
  {
    id_projeto: 2304,
    status: "rascunho",
    nome_proponente: "Josué da Silva Lima ",
    tipo_edital: 1,
    id_usuario: 341,
    id_cidade: 3716,
  },
  {
    id_projeto: 2311,
    status: "rascunho",
    nome_proponente: "Ana Claudia Cardoso Bizarri",
    tipo_edital: 1,
    id_usuario: 334,
    id_cidade: 3716,
  },
  {
    id_projeto: 2311,
    status: "rascunho",
    nome_proponente: "INSTITUTO VIVENCIAR AMAP",
    tipo_edital: 1,
    id_usuario: 334,
    id_cidade: 3716,
  },
  {
    id_projeto: 2316,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2316,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2316,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2317,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2317,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2317,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2319,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2319,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2319,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2321,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2321,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2321,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2323,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2323,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2323,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2325,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2325,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2325,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2339,
    status: "enviado",
    nome_proponente: "Carlos Frinka Neto",
    tipo_edital: 1,
    id_usuario: 333,
    id_cidade: 3716,
  },
  {
    id_projeto: 2342,
    status: "enviado",
    nome_proponente: "Wesley Cesar Santos Gonçalves",
    tipo_edital: 1,
    id_usuario: 342,
    id_cidade: 3716,
  },
  {
    id_projeto: 2345,
    status: "enviado",
    nome_proponente: "Emerson Arantes Cardoso Junior",
    tipo_edital: 1,
    id_usuario: 344,
    id_cidade: 3716,
  },
  {
    id_projeto: 2353,
    status: "rascunho",
    nome_proponente: "MARCOS ANTONIO TEMPONI",
    tipo_edital: 1,
    id_usuario: 323,
    id_cidade: 3716,
  },
  {
    id_projeto: 2354,
    status: "enviado",
    nome_proponente: "Claudiano Rangel de Souza",
    tipo_edital: 1,
    id_usuario: 345,
    id_cidade: 3716,
  },
  {
    id_projeto: 2357,
    status: "enviado",
    nome_proponente: "Jobert Pablo Tiago",
    tipo_edital: 1,
    id_usuario: 346,
    id_cidade: 3716,
  },
  {
    id_projeto: 2363,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2366,
    status: "enviado",
    nome_proponente: "Emerson Arantes Cardoso Junior",
    tipo_edital: 1,
    id_usuario: 344,
    id_cidade: 3716,
  },
  {
    id_projeto: 2368,
    status: "enviado",
    nome_proponente: "Damiani Raqueli Soares Pereira",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2368,
    status: "enviado",
    nome_proponente:
      "Damiani Raqueli Soares Pereira 40049511866 ( Núcleo de Dança Damiani Raqueli)",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2369,
    status: "enviado",
    nome_proponente: "Damiani Raqueli Soares Pereira",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2369,
    status: "enviado",
    nome_proponente:
      "Damiani Raqueli Soares Pereira 40049511866 ( Núcleo de Dança Damiani Raqueli)",
    tipo_edital: 1,
    id_usuario: 329,
    id_cidade: 3716,
  },
  {
    id_projeto: 2371,
    status: "enviado",
    nome_proponente: "Fernanda Araújo dos Santos",
    tipo_edital: 1,
    id_usuario: 347,
    id_cidade: 3716,
  },
  {
    id_projeto: 2372,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2373,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2379,
    status: "rascunho",
    nome_proponente: "Carlos Frinka Neto",
    tipo_edital: 1,
    id_usuario: 333,
    id_cidade: 3716,
  },
  {
    id_projeto: 2402,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2403,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2404,
    status: "enviado",
    nome_proponente: "Cristiane Patrícia Cardoso Barato ",
    tipo_edital: 1,
    id_usuario: 348,
    id_cidade: 3716,
  },
  {
    id_projeto: 2406,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2406,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2406,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2411,
    status: "enviado",
    nome_proponente: "Claudiano Rangel de Souza",
    tipo_edital: 1,
    id_usuario: 345,
    id_cidade: 3716,
  },
  {
    id_projeto: 2414,
    status: "enviado",
    nome_proponente: "Fernando Donizete Genari",
    tipo_edital: 1,
    id_usuario: 325,
    id_cidade: 3716,
  },
  {
    id_projeto: 2415,
    status: "enviado",
    nome_proponente: "Claudiano Rangel de Souza",
    tipo_edital: 1,
    id_usuario: 345,
    id_cidade: 3716,
  },
  {
    id_projeto: 2417,
    status: "enviado",
    nome_proponente: "Instituto vivenciar Amap",
    tipo_edital: 1,
    id_usuario: 349,
    id_cidade: 3716,
  },
  {
    id_projeto: 2418,
    status: "enviado",
    nome_proponente: "Fernando Donizete Genari",
    tipo_edital: 1,
    id_usuario: 325,
    id_cidade: 3716,
  },
  {
    id_projeto: 2437,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2437,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2437,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2443,
    status: "enviado",
    nome_proponente: "Nemuel Kesler Candido Silva",
    tipo_edital: 1,
    id_usuario: 331,
    id_cidade: 3716,
  },
  {
    id_projeto: 2444,
    status: "enviado",
    nome_proponente: "claudiano rangel de souza",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2444,
    status: "enviado",
    nome_proponente: "Luana Silva Carneiro",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2444,
    status: "enviado",
    nome_proponente: "maraisa fernanda menegon anjos",
    tipo_edital: 1,
    id_usuario: 339,
    id_cidade: 3716,
  },
  {
    id_projeto: 2448,
    status: "enviado",
    nome_proponente: "Nemuel Kesler Candido Silva",
    tipo_edital: 1,
    id_usuario: 331,
    id_cidade: 3716,
  },
  {
    id_projeto: 2452,
    status: "enviado",
    nome_proponente: "Nemuel Kesler Candido Silva",
    tipo_edital: 1,
    id_usuario: 331,
    id_cidade: 3716,
  },
  {
    id_projeto: 2459,
    status: "rascunho",
    nome_proponente: "Cristiane Patrícia Cardoso Barato ",
    tipo_edital: 1,
    id_usuario: 348,
    id_cidade: 3716,
  },
  {
    id_projeto: 2460,
    status: "enviado",
    nome_proponente: "Cristiane Patrícia Cardoso Barato ",
    tipo_edital: 1,
    id_usuario: 348,
    id_cidade: 3716,
  },
  {
    id_projeto: 2462,
    status: "enviado",
    nome_proponente: "Instituto vivenciar Amap",
    tipo_edital: 1,
    id_usuario: 349,
    id_cidade: 3716,
  },
  {
    id_projeto: 2470,
    status: "enviado",
    nome_proponente: "Ana Carolina Porto",
    tipo_edital: 1,
    id_usuario: 351,
    id_cidade: 3716,
  },
  {
    id_projeto: 2474,
    status: "rascunho",
    nome_proponente: "Tárley Pereira Lima",
    tipo_edital: 1,
    id_usuario: 324,
    id_cidade: 3716,
  },
  {
    id_projeto: 2476,
    status: "enviado",
    nome_proponente: "Alexandre Trindade de Almeida",
    tipo_edital: 1,
    id_usuario: 337,
    id_cidade: 3716,
  },
  {
    id_projeto: 2478,
    status: "enviado",
    nome_proponente: "Ana Carolina Porto",
    tipo_edital: 1,
    id_usuario: 351,
    id_cidade: 3716,
  },
  {
    id_projeto: 2494,
    status: "enviado",
    nome_proponente: "Laudemires Figueredo dos Santos ",
    tipo_edital: 1,
    id_usuario: 353,
    id_cidade: 3716,
  },
];
