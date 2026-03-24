import { useState } from "react";
import { useActividades } from "./useActividades";
import { useOportunidades } from "../oportunidades/useOportunidades";
import ActividadForm from "./ActividadForm";
import Spinner from "../../components/Spinner";

const TIPO_COLOR = {
  Llamada:  "bg-blue-50 text-blue-700",
  Reunión:  "bg-purple-50 text-purple-700",
  Email:    "bg-yellow-50 text-yellow-700",
  Visita:   "bg-green-50 text-green-700",
  Otro:     "bg-gray-100 text-gray-600",
};

export default function ActividadesPage() {
  const { actividades, loading, error, crearActividad } = useActividades();
  const { oportunidades } = useOportunidades();
  const [mostrarForm, setMostrarForm] = useState(false);

  const hoy = new Date().toISOString().slice(0, 10);

  const actividadesHoy    = actividades.filter((a) => a.fecha === hoy);
  const actividadesSemana = actividades.filter((a) => a.fecha !== hoy);

  const handleGuardar = async (form) => {
    await crearActividad(form);
    setMostrarForm(false);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Actividades</h2>
        <button onClick={() => setMostrarForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Registrar actividad
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">Nueva actividad</h3>
          <ActividadForm
            oportunidades={oportunidades}
            onGuardar={handleGuardar}
            onCancelar={() => setMostrarForm(false)}
          />
        </div>
      )}

      <div className="space-y-6">
        <Section titulo="Hoy" actividades={actividadesHoy} />
        <Section titulo="Esta semana" actividades={actividadesSemana} />
      </div>
    </div>
  );
}

function Section({ titulo, actividades }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3">{titulo}</h3>
      {actividades.length === 0 ? (
        <p className="text-sm text-gray-400">Sin actividades.</p>
      ) : (
        <div className="space-y-2">
          {actividades.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full mt-0.5 ${TIPO_COLOR[a.tipo] || "bg-gray-100 text-gray-600"}`}>
                {a.tipo}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{a.descripcion || "Sin descripción"}</p>
                {a.oportunidad && (
                  <p className="text-xs text-gray-400 mt-1">{a.oportunidad.nombre}</p>
                )}
              </div>
              <p className="text-xs text-gray-400">{a.fecha}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
