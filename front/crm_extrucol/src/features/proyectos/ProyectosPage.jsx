import { useNavigate } from "react-router-dom";
import { useProyectos } from "./useProyectos";
import Spinner from "../../components/Spinner";

export default function ProyectosPage() {
  const navigate = useNavigate();
  const { proyectos, loading, error } = useProyectos();

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Proyectos comerciales</h2>

      {proyectos.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          No hay proyectos activos. Los proyectos se crean al cerrar una oportunidad como ganada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proyectos.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`${p.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-sm transition"
            >
              <p className="font-medium text-gray-800 mb-1">{p.nombre}</p>
              <p className="text-sm text-gray-500 mb-3">{p.cliente?.nombre}</p>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Inicio: {p.fechaInicio || "—"}</span>
                <span>Cierre: {p.fechaCierre || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
