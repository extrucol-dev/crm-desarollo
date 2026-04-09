import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const executed = useRef(false); // ← flag para evitar doble ejecución

  useEffect(() => {
    if (executed.current) return; // ← segunda ejecución: ignorar
    executed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");


    if (error || !token) {
      navigate("/login?error=" + (error ?? "no_token"), { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rol    = payload.rol ?? payload.role ?? 'EJECUTIVO';
      const nombre = payload.nombre ?? payload.name ?? payload.sub ?? 'Usuario';
      localStorage.setItem('rol', rol);
      localStorage.setItem('nombre', nombre);
    } catch {
      localStorage.clear();
      navigate("/login?error=invalid_token", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });

  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#24388C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm font-[Roboto]">Autenticando con Google...</p>
      </div>
    </div>
  );
}