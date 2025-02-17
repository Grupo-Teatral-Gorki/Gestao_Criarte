import { Project } from "@/pages/pdftable";
import React from "react";

type TableProps = {
  data: Project[]; // Use the Project type for data
  modulo: string;
  color?: string;
};

const colorClasses: Record<string, string> = {
  red: "bg-red-200",
  green: "bg-green-200",
  blue: "bg-blue-200",
  yellow: "bg-yellow-200",
  gray: "bg-gray-200",
};

const TableComponent: React.FC<TableProps> = ({ data, modulo, color }) => {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          {/* First row - Just a line */}
          <tr>
            <th
              colSpan={6}
              className={`p-3 text-center ${
                color ? colorClasses[color] : "bg-gray-200"
              }`}
            >
              {modulo}
            </th>
          </tr>
          {/* Second row - Column Headers */}
          <tr className="bg-gray-100">
            <th className="w-16 p-3 border-b">Ordem</th>
            <th className="w-24 p-3 border-b">ID do Projeto</th>
            <th className="p-3 border-b">Proponente</th>
            <th className="p-3 border-b">Nome do Projeto</th>
            <th className="p-3 border-b">Modalidade</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id_projeto}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="w-24 p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b w-36 ">{item.id_projeto}</td>
              <td className="p-3 border-b">
                {item.proponentes[0]?.nome_proponente}
              </td>
              <td className="p-3 border-b">{item.nome_projeto}</td>
              <td className="p-3 border-b">{item.nome_modalidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
