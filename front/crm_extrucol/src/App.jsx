import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './shared/components/ProtectedRoute'

// Auth
import LoginPage from './features/auth/pages/LoginPage'

// Clientes
import ClientesListaPage   from './features/clientes/pages/ClientesListaPage'
import ClienteRegistroPage from './features/clientes/pages/ClienteRegistroPage'
import ClienteDetallePage  from './features/clientes/pages/ClienteDetallePage'
import ClienteEditarPage   from './features/clientes/pages/ClienteEditarPage'

// Usuarios
import UsuariosListaPage  from './features/usuarios/pages/UsuariosListaPage'
import UsuarioCrearPage   from './features/usuarios/pages/UsuarioCrearPage'
import UsuarioEditarPage  from './features/usuarios/pages/UsuarioEditarPage'

// Oportunidades
import OportunidadesKanbanPage  from './features/oportunidades/pages/OportunidadesKanbanPage'
import OportunidadCrearPage     from './features/oportunidades/pages/OportunidadCrearPage'
import OportunidadDetallePage   from './features/oportunidades/pages/OportunidadDetallePage'
import OportunidadEditarPage    from './features/oportunidades/pages/OportunidadEditarPage'

// Placeholder para módulos en desarrollo
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      </div>
      <div className="text-[17px] font-bold text-[#1A1A1A] mb-1">{title}</div>
      <div className="text-[13px] text-[#6B6B6B]">Módulo en desarrollo</div>
    </div>
  </div>
)

export default function App() {
  return (
    <Routes>
      {/* ── Públicas ── */}
      <Route path="/"                   element={<Navigate to="/login" replace />} />
      <Route path="/login"              element={<LoginPage />} />
      <Route path="/recuperar-password" element={<Placeholder title="Recuperar contraseña" />} />

      {/* ── Dashboard ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Placeholder title="Dashboard" /></ProtectedRoute>
      } />

      {/* ── Clientes — Ejecutivo ── */}
      <Route path="/clientes"            element={<ProtectedRoute roles={['EJECUTIVO']}><ClientesListaPage /></ProtectedRoute>} />
      <Route path="/clientes/nuevo"      element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteRegistroPage /></ProtectedRoute>} />
      <Route path="/clientes/:id"        element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteDetallePage /></ProtectedRoute>} />
      <Route path="/clientes/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteEditarPage /></ProtectedRoute>} />

      {/* ── Oportunidades — Ejecutivo ── */}
      <Route path="/oportunidades"            element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadesKanbanPage /></ProtectedRoute>} />
      <Route path="/oportunidades/nueva"      element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadCrearPage /></ProtectedRoute>} />
      <Route path="/oportunidades/:id"        element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadDetallePage /></ProtectedRoute>} />
      <Route path="/oportunidades/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadEditarPage /></ProtectedRoute>} />

      {/* ── Actividades ── */}
      <Route path="/actividades"      element={<ProtectedRoute><Placeholder title="Actividades" /></ProtectedRoute>} />

      {/* ── Proyectos — Ejecutivo ── */}
      <Route path="/proyectos"        element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Mis proyectos" /></ProtectedRoute>} />
      <Route path="/proyectos/:id"    element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Detalle del proyecto" /></ProtectedRoute>} />

      {/* ── Director ── */}
      <Route path="/pipeline"         element={<ProtectedRoute roles={['DIRECTOR']}><Placeholder title="Pipeline del equipo" /></ProtectedRoute>} />

      {/* ── Admin — Usuarios ── */}
      <Route path="/usuarios"              element={<ProtectedRoute roles={['ADMIN']}><UsuariosListaPage /></ProtectedRoute>} />
      <Route path="/usuarios/nuevo"        element={<ProtectedRoute roles={['ADMIN']}><UsuarioCrearPage /></ProtectedRoute>} />
      <Route path="/usuarios/:id/editar"   element={<ProtectedRoute roles={['ADMIN']}><UsuarioEditarPage /></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
