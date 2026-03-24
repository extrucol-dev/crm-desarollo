import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClienteDetalle, useClientes } from "./useClientes";
import ClienteForm from "./ClienteForm";
import Spinner from "../../components/Spinner";

export default function ClienteDetalle() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { cliente, loading, error } = useClienteDetalle(id);
  const { editarCliente } = useClientes();
  const [editando, setEditando] = useState(false);

  const handleGuardar = async (form) => {
    await editarCliente(id, form);
    setEditando(false);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;
  if (!cliente) return null;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{cliente.nombre}</h2>
            <p className="text-sm text-gray-500">{cliente.empresa} — {cliente.cargo}</p>
          </div>
          <button
            onClick={() => setEditando(!editando)}
            className="text-sm text-blue-600 hover:underline"
          >
            {editando ? "Cancelar" : "Editar"}
          </button>
        </div>

        {editando ? (
          <ClienteForm
            inicial={cliente}
            onGuardar={handleGuardar}
            onCancelar={() => setEditando(false)}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Correo</p>
              <p className="text-gray-700">{cliente.email}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Teléfono</p>
              <p className="text-gray-700">{cliente.telefono || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Empresa</p>
              <p className="text-gray-700">{cliente.empresa || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Cargo</p>
              <p className="text-gray-700">{cliente.cargo || "—"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
