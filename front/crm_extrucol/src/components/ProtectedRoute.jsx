import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ rolesPermitidos, children }) {
  const { token, rol } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (!rolesPermitidos.includes(rol)) return <Navigate to="/no-autorizado" replace />;

  return children;
}
