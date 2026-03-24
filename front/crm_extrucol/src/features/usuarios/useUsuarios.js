import { useState, useEffect } from "react";
import api from "../../api/axios";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch {
      setError("Error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (payload) => {
    try {
      await api.post("/usuarios", payload);
    } catch (error) {
      if (error.response?.status === 400) {
        setError(error.response.data.message || "Error de validación. Revisa los datos ingresados.");
      } else {
        setError("Error al crear el usuario. Intenta de nuevo.");
      }
    }

    fetchUsuarios();
  };

  const editarUsuario = async (id, payload) => {
    await api.put(`/usuarios/${id}`, payload);
    fetchUsuarios();
  };

  const toggleEstado = async (id, activo) => {
    await api.put(`/usuarios/${id}/estado`, { activo });
    fetchUsuarios();
  };

  const restablecerPassword = async (id) => {
    await api.post(`/usuarios/${id}/reset-password`);
  };

  return {
    usuarios,
    loading,
    error,
    crearUsuario,
    editarUsuario,
    toggleEstado,
    restablecerPassword,
  };
}
