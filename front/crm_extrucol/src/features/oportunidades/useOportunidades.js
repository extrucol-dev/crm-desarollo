import { useState, useEffect } from "react";
import api from "../../api/axios";

export function useOportunidades() {
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  useEffect(() => { fetchOportunidades(); }, []);

  const fetchOportunidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/oportunidades");
      setOportunidades(data);
    } catch {
      setError("Error al cargar las oportunidades.");
    } finally {
      setLoading(false);
    }
  };

  const crearOportunidad = async (payload) => {
    await api.post("/oportunidades", payload);
    fetchOportunidades();
  };

  const editarOportunidad = async (id, payload) => {
    await api.put(`/oportunidades/${id}`, payload);
    fetchOportunidades();
  };

  const avanzarEtapa = async (id, etapa) => {
    await api.patch(`/oportunidades/${id}/etapa`, { etapa });
    fetchOportunidades();
  };

  const cerrarOportunidad = async (id, resultado) => {
    await api.patch(`/oportunidades/${id}/cerrar`, { resultado });
    fetchOportunidades();
  };

  return { oportunidades, loading, error, crearOportunidad, editarOportunidad, avanzarEtapa, cerrarOportunidad };
}

export function useOportunidadDetalle(id) {
  const [oportunidad, setOportunidad] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/oportunidades/${id}`);
        setOportunidad(data);
      } catch {
        setError("Error al cargar la oportunidad.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { oportunidad, loading, error };
}
