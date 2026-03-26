import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './shared/components/ProtectedRoute'

// Auth
import LoginPage from './features/auth/pages/LoginPage'

// Clientes
import ClientesListaPage   from './features/clientes/pages/ClientesListaPage'
import ClienteRegistroPage from './features/clientes/pages/ClienteRegistroPage'

// Usuarios
import UsuariosListaPage from './features/usuarios/pages/UsuariosListaPage'
// Placeholder para módulos en desarrollo
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#F7F7F7]">
    <div className="text-center">
      <div className="text-5xl mb-4">🚧</div>
      <div className="text-xl font-bold text-[#1A1A1A]">{title}</div>
      <div className="text-sm text-[#6B6B6B] mt-2">Módulo en desarrollo</div>
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

      {/* ── Dashboard — todos los roles ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Placeholder title="Dashboard" />
        </ProtectedRoute>
      } />

      {/* ── Clientes — Ejecutivo ── */}
      <Route path="/clientes"       element={<ProtectedRoute roles={['EJECUTIVO']}><ClientesListaPage /></ProtectedRoute>} />
      <Route path="/clientes/nuevo" element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteRegistroPage /></ProtectedRoute>} />
      <Route path="/clientes/:id"   element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Detalle del cliente" /></ProtectedRoute>} />

      {/* ── Oportunidades — Ejecutivo ── */}
      <Route path="/oportunidades"        element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Kanban de oportunidades" /></ProtectedRoute>} />
      <Route path="/oportunidades/nueva"  element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Nueva oportunidad" /></ProtectedRoute>} />
      <Route path="/oportunidades/:id"    element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Detalle de oportunidad" /></ProtectedRoute>} />

      {/* ── Actividades ── */}
      <Route path="/actividades"    element={<ProtectedRoute><Placeholder title="Actividades" /></ProtectedRoute>} />

      {/* ── Proyectos — Ejecutivo ── */}
      <Route path="/proyectos"      element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Mis proyectos" /></ProtectedRoute>} />
      <Route path="/proyectos/:id"  element={<ProtectedRoute roles={['EJECUTIVO']}><Placeholder title="Detalle del proyecto" /></ProtectedRoute>} />

      {/* ── Director ── */}
      <Route path="/pipeline"       element={<ProtectedRoute roles={['DIRECTOR']}><Placeholder title="Pipeline del equipo" /></ProtectedRoute>} />

      {/* ── Admin ── */}
      <Route path="/usuarios"       element={<ProtectedRoute roles={['ADMIN']}><UsuariosListaPage /></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
