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

interface Project {
  id_projeto: number;
  status: string | null;
  nome_proponente: string | null;
  tipo_edital: number | null;
  id_usuario: number | null;
}

const fetchData = async (idCidade: string): Promise<Project[]> => {
  const response = await fetch(`https://gorki-painel-admin-api.iglgxt.easypanel.host/projects/ovw`, {
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
  return data // Retorna os últimos 10 projetos
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
        tipo === 1 ? "Fomento" : tipo === 2 ? "Premiação" : tipo === 4 ? "Subsídio" :  tipo === 3 ? "Áreas Perifericas" : "Desconhecido"

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

  useEffect(() => {
    const loadData = async () => {
      const idCidade = localStorage.getItem("idCidade");
      if (!idCidade) {
        console.error("idCidade não encontrado no localStorage");
        return;
      }

      try {
        const data = await fetchData(idCidade);
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
        <div className="rounded-md border">
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
        <div className="flex items-center justify-end space-x-2 py-4">
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
