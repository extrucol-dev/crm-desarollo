import { useState, useEffect } from "react";
import api from "../../api/axios";

export function useActividades() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => { fetchActividades(); }, []);

  const fetchActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/actividades");
      setActividades(data);
    } catch {
      setError("Error al cargar las actividades.");
    } finally {
      setLoading(false);
    }
  };

  const crearActividad = async (payload) => {
    await api.post("/actividades", payload);
    fetchActividades();
  };

  const editarActividad = async (id, payload) => {
    await api.put(`/actividades/${id}`, payload);
    fetchActividades();
  };

  return { actividades, loading, error, crearActividad, editarActividad };
}
