import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import ClientesPage from "../features/clientes/ClientesPage";
import ClienteDetalle from "../features/clientes/ClienteDetalle";
import OportunidadesPage from "../features/oportunidades/OportunidadesPage";
import OportunidadDetalle from "../features/oportunidades/OportunidadDetalle";
import ActividadesPage from "../features/actividades/ActividadesPage";
import ReportesPage from "../features/reportes/ReportesPage";
import ProyectosPage from "../features/proyectos/ProyectosPage";
import ProyectoDetalle from "../features/proyectos/ProyectoDetalle";

export default function ManagerLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="clientes" replace />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="clientes/:id" element={<ClienteDetalle />} />
            <Route path="oportunidades" element={<OportunidadesPage />} />
            <Route path="oportunidades/:id" element={<OportunidadDetalle />} />
            <Route path="actividades" element={<ActividadesPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="proyectos" element={<ProyectosPage />} />
            <Route path="proyectos/:id" element={<ProyectoDetalle />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
