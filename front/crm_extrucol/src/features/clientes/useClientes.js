import { useState, useEffect } from "react";
import api from "../../api/axios";

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => { fetchClientes(); }, []);

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } catch {
      setError("Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  const crearCliente = async (payload) => {
    await api.post("/clientes", payload);
    fetchClientes();
  };

  const editarCliente = async (id, payload) => {
    await api.put(`/clientes/${id}`, payload);
    fetchClientes();
  };

  return { clientes, loading, error, crearCliente, editarCliente, fetchClientes };
}

export function useClienteDetalle(id) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/clientes/${id}`);
        setCliente(data);
      } catch {
        setError("Error al cargar el cliente.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { cliente, loading, error };
}
