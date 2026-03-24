import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOportunidades } from "./useOportunidades";
import { useClientes } from "../clientes/useClientes";
import OportunidadForm from "./OportunidadForm";
import Spinner from "../../components/Spinner";

const ETAPAS = ["Prospección", "Calificación", "Propuesta", "Negociación", "Cierre"];

const COLOR_ETAPA = {
  "Prospección":  "bg-gray-100 text-gray-600",
  "Calificación": "bg-blue-50 text-blue-700",
  "Propuesta":    "bg-yellow-50 text-yellow-700",
  "Negociación":  "bg-orange-50 text-orange-700",
  "Cierre":       "bg-green-50 text-green-700",
};

export default function OportunidadesPage() {
  const navigate  = useNavigate();
  const { oportunidades, loading, error, crearOportunidad } = useOportunidades();
  const { clientes } = useClientes();
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleGuardar = async (form) => {
    await crearOportunidad(form);
    setMostrarForm(false);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Oportunidades</h2>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Nueva oportunidad
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">Crear oportunidad</h3>
          <OportunidadForm
            clientes={clientes}
            onGuardar={handleGuardar}
            onCancelar={() => setMostrarForm(false)}
          />
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => {
          const items = oportunidades.filter((o) => o.etapa === etapa);
          return (
            <div key={etapa} className="min-w-60 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${COLOR_ETAPA[etapa]}`}>
                  {etapa}
                </span>
                <span className="text-xs text-gray-400">{items.length}</span>
              </div>

              <div className="space-y-3">
                {items.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => navigate(`${o.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-sm transition"
                  >
                    <p className="text-sm font-medium text-gray-800 mb-1">{o.nombre}</p>
                    <p className="text-xs text-gray-500">{o.cliente?.nombre}</p>
                    {o.valor && (
                      <p className="text-xs text-gray-400 mt-2">
                        $ {Number(o.valor).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                    Sin oportunidades
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
