import { useReportes } from "./useReportes";
import Spinner from "../../components/Spinner";

function Tarjeta({ titulo, valor, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">{titulo}</p>
      <p className="text-2xl font-semibold text-gray-800">{valor}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function ReportesPage() {
  const { dashboard, pipeline, loading, error } = useReportes();

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;
  if (!dashboard) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Reportes</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Tarjeta titulo="Clientes totales"      valor={dashboard.totalClientes}      />
        <Tarjeta titulo="Oportunidades activas" valor={dashboard.oportunidadesActivas} />
        <Tarjeta titulo="Ganadas este mes"      valor={dashboard.ganadasMes}          />
        <Tarjeta titulo="Valor pipeline"        valor={`$ ${Number(dashboard.valorPipeline || 0).toLocaleString()}`} />
      </div>

      <h3 className="text-base font-medium text-gray-700 mb-4">Pipeline por etapa</h3>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Etapa</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Cantidad</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Valor total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pipeline.map((p) => (
              <tr key={p.etapa} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{p.etapa}</td>
                <td className="px-6 py-4 text-gray-500">{p.cantidad}</td>
                <td className="px-6 py-4 text-gray-500">$ {Number(p.valor || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
