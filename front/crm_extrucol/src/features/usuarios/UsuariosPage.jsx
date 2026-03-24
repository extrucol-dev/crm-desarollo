import { useState } from "react";
import { useUsuarios } from "./useUsuarios";
import UsuarioForm from "./UsuarioForm";
import Spinner from "../../components/Spinner";

export default function UsuariosPage() {
  const { usuarios, loading, error, crearUsuario, editarUsuario, toggleEstado, restablecerPassword } = useUsuarios();
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarForm, setMostrarForm]   = useState(false);

  const handleGuardar = async (form) => {
    if (seleccionado) {
      await editarUsuario(seleccionado.id, form);
    } else {
      await crearUsuario(form);
    }
    setMostrarForm(false);
    setSeleccionado(null);
  };

  const handleEditar = (usuario) => {
    setSeleccionado(usuario);
    setMostrarForm(true);
  };

  const handleNuevo = () => {
    setSeleccionado(null);
    setMostrarForm(true);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>
        <button
          onClick={handleNuevo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Nuevo usuario
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">
            {seleccionado ? "Editar usuario" : "Crear usuario"}
          </h3>
          <UsuarioForm
            inicial={seleccionado || {}}
            onGuardar={handleGuardar}
            onCancelar={() => { setMostrarForm(false); setSeleccionado(null); }}
          />
        </div>
      )}

      {usuarios.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No hay usuarios registrados.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Nombre</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Correo</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Rol</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{u.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.activo ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 justify-end">
                       <button onClick={() => handleEditar(u)} className="text-blue-600 hover:underline text-xs">Editar</button> 
                      {/* <button onClick={() => toggleEstado(u.id, !u.activo)} className="text-gray-500 hover:underline text-xs">
                        {u.activo ? "Desactivar" : "Activar"}
                      </button> */}
                      {/* <button onClick={() => restablecerPassword(u.id)} className="text-gray-500 hover:underline text-xs">Reset password</button> */}
                    </div>
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
