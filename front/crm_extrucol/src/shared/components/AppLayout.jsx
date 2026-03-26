import { NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../../features/auth/services/authService'

const NAV_BY_ROL = {
  EJECUTIVO: [
    { to: '/dashboard',     icon: ' ', label: 'Dashboard' },
    { to: '/clientes',      icon: ' ', label: 'Mis Clientes' },
    { to: '/oportunidades', icon: ' ', label: 'Oportunidades' },
    { to: '/actividades',   icon: ' ', label: 'Actividades' },
    { to: '/proyectos',     icon: ' ', label: 'Proyectos' },
  ],
  DIRECTOR: [
    { to: '/dashboard',     icon: ' ', label: 'Dashboard Equipo' },
    { to: '/pipeline',      icon: ' ', label: 'Pipeline' },
    { to: '/actividades',   icon: ' ', label: 'Actividades' },
  ],
  ADMIN: [
    { to: '/dashboard',     icon: ' ', label: 'Dashboard' },
    { to: '/usuarios',      icon: ' ', label: 'Usuarios' },
  ],
}

const ROL_LABEL = {
  EJECUTIVO: 'Ejecutivo Comercial',
  DIRECTOR:  'Director Comercial',
  ADMIN:     'Administrador',
}

const initials = (nombre = '') =>
  nombre.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export default function AppLayout({ children }) {
  const navigate = useNavigate()
  const nombre   = authService.getNombre()
  const rol      = authService.getRol()
  const navItems = NAV_BY_ROL[rol]

  const handleLogout = () => {
    authService.logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col fixed top-0 left-0 h-screen z-50" style={{ background: '#24388C' }}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-[17px] font-extrabold text-white tracking-tight">
            CRM <span style={{ color: '#F39610' }}>Extrucol</span>
          </div>
          <div className="text-[11px] text-white/40 mt-0.5">Sistema Comercial</div>
        </div>

        <div className="px-5 py-3.5 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0" style={{ background: '#F39610' }}>
            {initials(nombre)}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{nombre}</div>
            <div className="text-[11px] text-white/40">{ROL_LABEL[rol]}</div>
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-5 py-2.5 text-[13.5px] font-medium transition-all duration-150 border-l-[3px] ${
                  isActive
                    ? 'bg-white/12 text-white border-l-[#F39610]'
                    : 'text-white/60 border-l-transparent hover:bg-white/7 hover:text-white'
                }`
              }
            >
              <span className="w-5 text-center text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-2 text-[13px] text-white/40 hover:text-red-400 transition-colors w-full">
            <span>⬅️</span> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-60 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  )
}
