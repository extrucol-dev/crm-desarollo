import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientes } from "./useClientes";
import ClienteForm from "./ClienteForm";
import Spinner from "../../components/Spinner";

export default function ClientesPage() {
  const navigate = useNavigate();
  const { clientes, loading, error, crearCliente } = useClientes();
  const [busqueda, setBusqueda]   = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.empresa?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleGuardar = async (form) => {
    await crearCliente(form);
    setMostrarForm(false);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Clientes</h2>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Nuevo cliente
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">Registrar cliente</h3>
          <ClienteForm
            onGuardar={handleGuardar}
            onCancelar={() => setMostrarForm(false)}
          />
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o empresa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-sm">No hay clientes registrados aún.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Registrar primer cliente
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Nombre</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Empresa</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Correo</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Teléfono</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientesFiltrados.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`clientes/${c.id}`)}>
                  <td className="px-6 py-4 font-medium text-gray-800">{c.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">{c.empresa || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-gray-500">{c.telefono || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-blue-600 text-xs hover:underline">Ver detalle →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
