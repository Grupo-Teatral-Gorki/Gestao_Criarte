/* eslint-disable @typescript-eslint/no-explicit-any */
import TableComponent from "@/components/pdfTable";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export interface Project {
  proponentes: any;
  id_projeto: number;
  status: "rascunho" | "enviado" | "Recurso" | "Habilitação";
  nome_proponente: string;
  tipo_edital: number;
  id_usuario: number;
  id_cidade: number;
  nome_projeto: string;
  nome_modalidade: string;
}

const PdfTable = () => {
  const [modulo1, setModulo1] = useState<Project[]>([]);
  const [modulo2, setModulo2] = useState<Project[]>([]);
  const [rascunho, setRascunho] = useState<Project[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // Check if we are in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      setModulo1(JSON.parse(localStorage.getItem("modulo1") || "[]"));
      setModulo2(JSON.parse(localStorage.getItem("modulo2") || "[]"));
      setRascunho(JSON.parse(localStorage.getItem("rascunho") || "[]"));
      setText(localStorage.getItem("text") || "");
    }
  }, []);

  const generatePDF = () => {
    // Create the PDF in landscape mode
    const doc = new jsPDF("landscape", "mm", "a4");

    // Select the content you want to capture
    const content = document.body;

    // Use html2canvas to capture the content as an image
    html2canvas(content, {
      scale: 2, // Increase scale for higher resolution
      useCORS: true, // Enable cross-origin image fetching
    }).then((canvas) => {
      // Get the image data from the canvas
      const imgData = canvas.toDataURL("image/jpeg");

      // A4 landscape page dimensions (in mm)
      const pageWidth = doc.internal.pageSize.width; // 297mm
      const pageHeight = doc.internal.pageSize.height; // 210mm

      // Scale the image to fit the page width (A4 landscape)
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Function to add the image to the PDF and handle page breaks
      const addImageToPDF = () => {
        let yPosition = 0;
        let remainingHeight = imgHeight;

        // Add image until the remaining height exceeds the page height
        while (remainingHeight > 0) {
          // If the remaining image height fits in the current page
          if (remainingHeight <= pageHeight) {
            doc.addImage(
              imgData,
              "JPEG",
              0,
              yPosition,
              imgWidth,
              remainingHeight
            );
            remainingHeight = 0; // All content has been added
          } else {
            // Add the current page portion of the image
            doc.addImage(imgData, "JPEG", 0, yPosition, imgWidth, pageHeight);
            remainingHeight -= pageHeight; // Subtract the height of the added portion
            yPosition += pageHeight; // Move to the next part of the image

            // Add a new page if there's more content
            if (remainingHeight > 0) {
              doc.addPage("landscape");
            }
          }
        }
      };

      // Start the process of adding the image to the PDF
      addImageToPDF();

      // Save the generated PDF
      doc.save("lista-projetos-inscritos.pdf");
    });
  };

  return (
    <div className="p-2">
      <div className="flex justify-between px-2">
        <Image
          src="https://styxx-public.s3.sa-east-1.amazonaws.com/pnab-logo.png"
          width={150}
          height={70}
          alt="logo pnab"
        />
        <Image
          src="https://www.cerquilho.sp.gov.br/public/admin/globalarq/uploads/files/brasao.png"
          width={72}
          height={60}
          alt="logo municipio"
        />
      </div>
      <div className="mt-5 text-center">
        <p className="text-base font-bold">
          COMUNICADO DA LISTA RETIFICADA DE PROJETOS INSCRITOS
        </p>
        <p className="px-24 mt-2 text-sm text-center">{text}</p>
      </div>
      <div className="flex flex-col gap-6 mt-4">
        <TableComponent data={modulo1} modulo={"Módulo 1"} color="red" />
        <TableComponent data={modulo2} modulo={"Módulo 2"} color="green" />
        <p className="px-32 mt-12 text-sm text-center">
          Informamos que foram identificados projetos em situação de rascunho,
          ou seja, que não tiveram o processo de envio da inscrição concluído.
        </p>
        <TableComponent data={rascunho} modulo={"Rascunho"} color="yellow" />
      </div>
      <p className="px-32 mt-12 text-sm text-center">
        Para outras solicitações ou dúvidas, encaminhe um e-mail para
        <span className="ml-2 text-blue-600 underline">
          producaocultural@grupoteatralgorki.com
        </span>
      </p>

      {/* Button to generate PDF */}
      <div className="mt-4 text-center">
        <button
          onClick={generatePDF}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Gerar PDF
        </button>
      </div>
    </div>
  );
};

export default PdfTable;
