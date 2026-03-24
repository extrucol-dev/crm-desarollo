import { useState, useEffect } from "react";
import api from "../../api/axios";

export function useReportes() {
  const [dashboard, setDashboard] = useState(null);
  const [pipeline, setPipeline]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => { fetchReportes(); }, []);

  const fetchReportes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, pipeRes] = await Promise.all([
        api.get("/reportes/dashboard"),
        api.get("/reportes/pipeline"),
      ]);
      setDashboard(dashRes.data);
      setPipeline(pipeRes.data);
    } catch {
      setError("Error al cargar los reportes.");
    } finally {
      setLoading(false);
    }
  };

  return { dashboard, pipeline, loading, error };
}
