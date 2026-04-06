import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../../features/auth/services/authService'

const NAV_BY_ROL = {
  EJECUTIVO: [
    { to: '/dashboard',     icon: 'home',    label: 'Dashboard' },
    { to: '/clientes',      icon: 'users',   label: 'Mis Clientes' },
    { to: '/oportunidades', icon: 'briefcase', label: 'Oportunidades' },
    { to: '/actividades',   icon: 'clipboard', label: 'Actividades' },
    { to: '/proyectos',     icon: 'folder',  label: 'Proyectos' },
  ],
  DIRECTOR: [
    { to: '/dashboard',          icon: 'chart',     label: 'Dashboard' },
    { to: '/director/pipeline',  icon: 'briefcase', label: 'Pipeline' },
    { to: '/director/actividades', icon: 'clipboard', label: 'Actividades' },
  ],
  ADMIN: [
    { to: '/dashboard',     icon: 'home',    label: 'Dashboard' },
    { to: '/usuarios',      icon: 'user',    label: 'Usuarios' },
  ],
}

const ROL_LABEL = {
  EJECUTIVO: 'Ejecutivo Comercial',
  DIRECTOR:  'Director Comercial',
  ADMIN:     'Administrador',
}

const initials = (nombre = '') =>
  nombre.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

// Íconos SVG inline sin emojis
const Icon = ({ name, className = 'w-4 h-4' }) => {
  const icons = {
    home:      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.5 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    users:     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />,
    clipboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />,
    folder:    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />,
    chart:     <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
    user:      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
    logout:    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />,
    menu:      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    close:     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={1.6} stroke="currentColor" className={className}>
      {icons[name]}
    </svg>
  )
}

export { Icon }

export default function AppLayout({ children }) {
  const navigate   = useNavigate()
  const [open, setOpen] = useState(false)
  const nombre     = authService.getNombre()
  const rol        = authService.getRol()
  const navItems   = NAV_BY_ROL[rol] ?? NAV_BY_ROL.EJECUTIVO

  const handleLogout = () => {
    authService.logout()
    navigate('/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: '#24388C' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[17px] font-extrabold text-white tracking-tight">
            CRM <span style={{ color: '#F39610' }}>Extrucol</span>
          </div>
          <div className="text-[11px] text-white/40 mt-0.5">Sistema Comercial</div>
        </div>
        {/* Cerrar en móvil */}
        <button onClick={() => setOpen(false)} className="lg:hidden text-white/50 hover:text-white">
          <Icon name="close" className="w-5 h-5" />
        </button>
      </div>

      {/* Usuario */}
      <div className="px-5 py-3.5 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
          style={{ background: '#F39610' }}>
          {initials(nombre)}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-white truncate">{nombre}</div>
          <div className="text-[11px] text-white/40">{ROL_LABEL[rol]}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-[13.5px] font-medium transition-all duration-150 border-l-[3px] ${
                isActive
                  ? 'bg-white/12 text-white border-l-[#F39610]'
                  : 'text-white/60 border-l-transparent hover:bg-white/7 hover:text-white'
              }`
            }
          >
            <Icon name={icon} className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-5 py-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 text-[13px] text-white/40 hover:text-red-400 transition-colors w-full">
          <Icon name="logout" className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">

      {/* Sidebar desktop */}
      <aside className="w-60 hidden lg:flex flex-col fixed top-0 left-0 h-screen z-50">
        <SidebarContent />
      </aside>

      {/* Overlay móvil */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenido */}
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Topbar móvil */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F0F0F0]">
          <button onClick={() => setOpen(true)} className="text-[#4A4A4A]">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <span className="text-[15px] font-bold text-[#1A1A1A] tracking-tight">
            CRM <span style={{ color: '#24388C' }}>Extrucol</span>
          </span>
        </div>
        {children}
      </main>
    </div>
  )
}
