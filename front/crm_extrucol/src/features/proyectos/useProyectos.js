import { useState, useEffect } from "react";
import api from "../../api/axios";

export function useProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => { fetchProyectos(); }, []);

  const fetchProyectos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/proyectos");
      setProyectos(data);
    } catch {
      setError("Error al cargar los proyectos.");
    } finally {
      setLoading(false);
    }
  };

  const editarProyecto = async (id, payload) => {
    await api.put(`/proyectos/${id}`, payload);
    fetchProyectos();
  };

  return { proyectos, loading, error, editarProyecto };
}

export function useProyectoDetalle(id) {
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/proyectos/${id}`);
        setProyecto(data);
      } catch {
        setError("Error al cargar el proyecto.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { proyecto, loading, error };
}
