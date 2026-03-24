import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import NoAutorizado from "../components/NoAutorizado";
import Login from "../features/auth/Login";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import UserLayout from "../layouts/UserLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/*"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "DIRECTOR"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/*"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "DIRECTOR", "EJECUTIVO"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
