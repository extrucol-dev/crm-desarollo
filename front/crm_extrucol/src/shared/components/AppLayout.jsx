import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../../features/auth/services/authService'
import { APEX_MODE } from '../services/utils'

const NAV_BY_ROL = {
  EJECUTIVO: [
    { to: '/dashboard',     icon: 'home',      label: 'Dashboard' },
    { to: '/leads',         icon: 'funnel',    label: 'Leads' },
    { to: '/clientes',      icon: 'users',     label: 'Mis Clientes' },
    { to: '/oportunidades', icon: 'briefcase', label: 'Oportunidades' },
    { to: '/actividades',   icon: 'clipboard', label: 'Actividades' },
    { to: '/proyectos',     icon: 'folder',    label: 'Proyectos' },
    { to: '/metas',         icon: 'target',    label: 'Mis Metas' },
  ],
  DIRECTOR: [
    { to: '/dashboard',             icon: 'chart',     label: 'Dashboard' },
    { to: '/director/pipeline',     icon: 'briefcase', label: 'Pipeline' },
    { to: '/director/actividades',  icon: 'clipboard', label: 'Actividades' },
    { to: '/director/equipo',       icon: 'users',     label: 'Equipo' },
    { to: '/director/analisis',     icon: 'chart',     label: 'Análisis' },
    { to: '/director/forecast',     icon: 'trending',  label: 'Forecast' },
    { to: '/director/reportes',     icon: 'document',  label: 'Reportes' },
  ],
  COORDINADOR: [
    { to: '/dashboard',                   icon: 'home',      label: 'Dashboard' },
    { to: '/coordinador/estancadas',      icon: 'warning',   label: 'Estancadas' },
    { to: '/actividades',                 icon: 'clipboard', label: 'Actividades' },
    { to: '/coordinador/monitoreo',       icon: 'map',       label: 'Monitoreo' },
    { to: '/coordinador/cumplimiento',    icon: 'target',    label: 'Cumplimiento' },
    { to: '/coordinador/alertas',         icon: 'bell',      label: 'Alertas' },
    { to: '/coordinador/equipo/perfil',   icon: 'users',     label: 'Equipo' },
  ],
  ADMIN: [
    { to: '/dashboard',     icon: 'home',    label: 'Dashboard' },
    { to: '/usuarios',      icon: 'user',    label: 'Usuarios' },
  ],
}

const ROL_LABEL = {
  EJECUTIVO:   'Ejecutivo Comercial',
  DIRECTOR:    'Director Comercial',
  COORDINADOR: 'Coordinador de Seguimiento',
  ADMIN:       'Administrador',
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
    funnel:    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />,
    target:    <><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></>,
    trending:  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />,
    document:  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
    warning:   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
    map:       <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />,
    bell:      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
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

  const handleLogout = async () => {
    await authService.logout()
    if (!APEX_MODE) navigate('/login', { replace: true })
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
