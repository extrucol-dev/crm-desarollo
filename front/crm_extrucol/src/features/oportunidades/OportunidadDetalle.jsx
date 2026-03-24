import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOportunidadDetalle, useOportunidades } from "./useOportunidades";
import OportunidadForm from "./OportunidadForm";
import Spinner from "../../components/Spinner";

const ETAPAS = ["Prospección", "Calificación", "Propuesta", "Negociación", "Cierre"];

export default function OportunidadDetalle() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { oportunidad, loading, error } = useOportunidadDetalle(id);
  const { editarOportunidad, avanzarEtapa, cerrarOportunidad } = useOportunidades();
  const [editando, setEditando] = useState(false);

  const handleGuardar = async (form) => {
    await editarOportunidad(id, form);
    setEditando(false);
  };

  const handleAvanzar = () => {
    const idx = ETAPAS.indexOf(oportunidad.etapa);
    if (idx < ETAPAS.length - 1) avanzarEtapa(id, ETAPAS[idx + 1]);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;
  if (!oportunidad) return null;

  const puedeAvanzar = oportunidad.etapa !== "Cierre" && oportunidad.resultado == null;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1">
        ← Volver
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{oportunidad.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">{oportunidad.cliente?.nombre}</p>
          </div>
          <div className="flex gap-2">
            {puedeAvanzar && (
              <button onClick={handleAvanzar}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Avanzar etapa
              </button>
            )}
            <button onClick={() => setEditando(!editando)}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition">
              {editando ? "Cancelar" : "Editar"}
            </button>
          </div>
        </div>

        {editando ? (
          <OportunidadForm inicial={oportunidad} onGuardar={handleGuardar} onCancelar={() => setEditando(false)} />
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-400 mb-1">Etapa</p><p className="text-gray-700">{oportunidad.etapa}</p></div>
            <div><p className="text-gray-400 mb-1">Valor estimado</p><p className="text-gray-700">$ {Number(oportunidad.valor || 0).toLocaleString()}</p></div>
            <div><p className="text-gray-400 mb-1">Fecha de cierre</p><p className="text-gray-700">{oportunidad.fechaCierre || "—"}</p></div>
            <div><p className="text-gray-400 mb-1">Resultado</p><p className="text-gray-700">{oportunidad.resultado || "En curso"}</p></div>
          </div>
        )}
      </div>

      {!oportunidad.resultado && (
        <div className="flex gap-3">
          <button onClick={() => cerrarOportunidad(id, "GANADA")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
            Cerrar como ganada
          </button>
          <button onClick={() => cerrarOportunidad(id, "PERDIDA")}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition">
            Cerrar como perdida
          </button>
        </div>
      )}
    </div>
  );
}
