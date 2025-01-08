"use client";
import Header from "@/components/ui/header/header";
import DashBoard from "@/components/main-dashboard/dashboard";
import { PieDashboard } from "@/components/pie-main-dashboard/dashboard";
import { OvwTable } from "@/components/ovw-table/table";
import { useRouter } from "next/navigation";
import './index.css'

export default function View() {

  const router = useRouter()

  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 relative">
          {" "}
          <div className="flex-1">
            <DashBoard />
          </div>
          <div className="flex-1">
            <PieDashboard />
            <div onClick={() => {router.push('/projects')}} className="view-projects-btn">
              <p>Ver Projetos</p>
              <svg
                style={{ minWidth: "50px" }}
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
            <div className="view-info-btn">
              <p>Consultar Informações</p>
              <svg
                style={{ minWidth: "50px" }}
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto "test" com posição absoluta */}
        <div className="ovw-table">
          <OvwTable></OvwTable>
        </div>
      </div>
    </div>
  );
}
