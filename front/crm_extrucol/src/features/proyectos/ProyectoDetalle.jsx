import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProyectoDetalle, useProyectos } from "./useProyectos";
import ProyectoForm from "./ProyectoForm";
import Spinner from "../../components/Spinner";

export default function ProyectoDetalle() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { proyecto, loading, error } = useProyectoDetalle(id);
  const { editarProyecto } = useProyectos();
  const [editando, setEditando] = useState(false);

  const handleGuardar = async (form) => {
    await editarProyecto(id, form);
    setEditando(false);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;
  if (!proyecto) return null;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">
        ← Volver
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{proyecto.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">{proyecto.cliente?.nombre}</p>
          </div>
          <button onClick={() => setEditando(!editando)}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition">
            {editando ? "Cancelar" : "Editar"}
          </button>
        </div>

        {editando ? (
          <ProyectoForm inicial={proyecto} onGuardar={handleGuardar} onCancelar={() => setEditando(false)} />
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Descripción</p>
              <p className="text-gray-700">{proyecto.descripcion || "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 mb-1">Fecha inicio</p>
                <p className="text-gray-700">{proyecto.fechaInicio || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Fecha cierre</p>
                <p className="text-gray-700">{proyecto.fechaCierre || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
