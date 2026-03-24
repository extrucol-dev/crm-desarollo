import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RUTA_POR_ROL = {
  ADMIN:   "/admin",
  MANAGER: "/manager",
  USER:    "/user",
};

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const navigate              = useNavigate();
  const { login }             = useAuth();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuthToken(data.token);
      login(data.token, data.rol, data.usuario);
      navigate(RUTA_POR_ROL[data.rol] || "/login");
    } catch {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}
