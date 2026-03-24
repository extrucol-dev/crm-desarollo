import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS_ADMIN = [
  { to: "/admin/usuarios",      label: "Usuarios" },
  { to: "/admin/clientes",      label: "Clientes" },
  { to: "/admin/oportunidades", label: "Oportunidades" },
  { to: "/admin/actividades",   label: "Actividades" },
  { to: "/admin/reportes",      label: "Reportes" },
  { to: "/admin/proyectos",     label: "Proyectos" },
];

const LINKS_MANAGER = [
  { to: "/manager/clientes",      label: "Clientes" },
  { to: "/manager/oportunidades", label: "Oportunidades" },
  { to: "/manager/actividades",   label: "Actividades" },
  { to: "/manager/reportes",      label: "Reportes" },
  { to: "/manager/proyectos",     label: "Proyectos" },
];

const LINKS_USER = [
  { to: "/user/clientes",      label: "Mis clientes" },
  { to: "/user/oportunidades", label: "Mis oportunidades" },
  { to: "/user/actividades",   label: "Mis actividades" },
];

const linksMap = {
  ADMIN:   LINKS_ADMIN,
  MANAGER: LINKS_MANAGER,
  USER:    LINKS_USER,
};

export default function Sidebar() {
  const { rol, usuario, logout } = useAuth();
  const links = linksMap[rol] || [];

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-widest">CRM Extrucol</p>
        <p className="text-sm font-medium mt-1 truncate">{usuario}</p>
        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
          {rol}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full text-sm text-gray-400 hover:text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
