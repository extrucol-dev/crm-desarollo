import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './shared/components/ProtectedRoute'
import OAuth2CallbackPage from "./features/auth/pages/OAuth2CallbackPage.jsx";
// Auth
import LoginPage from './features/auth/pages/LoginPage'


// Dashboard por rol — CE-10
import DashboardEjecutivoPage from './features/dashboard/pages/DashboardEjecutivoPage'
import DashboardAdminPage     from './features/dashboard/pages/DashboardAdminPage'
import DashboardDirectorPage  from './features/director/pages/DashboardDirectorPage'

// Clientes
import ClientesListaPage   from './features/clientes/pages/ClientesListaPage'
import ClienteRegistroPage from './features/clientes/pages/ClienteRegistroPage'
import ClienteDetallePage  from './features/clientes/pages/ClienteDetallePage'
import ClienteEditarPage   from './features/clientes/pages/ClienteEditarPage'

// Usuarios
import UsuariosListaPage from './features/usuarios/pages/UsuariosListaPage'
import UsuarioCrearPage  from './features/usuarios/pages/UsuarioCrearPage'
import UsuarioEditarPage from './features/usuarios/pages/UsuarioEditarPage'

// Oportunidades
import OportunidadesKanbanPage from './features/oportunidades/pages/OportunidadesKanbanPage'
import OportunidadCrearPage    from './features/oportunidades/pages/OportunidadCrearPage'
import OportunidadDetallePage  from './features/oportunidades/pages/OportunidadDetallePage'
import OportunidadEditarPage   from './features/oportunidades/pages/OportunidadEditarPage'

// Actividades
import ActividadCrearPage  from './features/actividades/pages/ActividadCrearPage'
import ActividadEditarPage from './features/actividades/pages/ActividadEditarPage'

// Proyectos — CE-38, CE-39, CE-41, CE-42
import ProyectosListaPage  from './features/proyectos/pages/ProyectosListaPage'
import ProyectoDetallePage from './features/proyectos/pages/ProyectoDetallePage'
import ProyectoCrearPage   from './features/proyectos/pages/ProyectoCrearPage'
import ProyectoEditarPage  from './features/proyectos/pages/ProyectoEditarPage'

// Director — CE-33, CE-34, CE-35, CE-36, CE-37
import PipelineDirectorPage           from './features/director/pages/PipelineDirectorPage'
import OportunidadDetalleDirectorPage from './features/director/pages/OportunidadDetalleDirectorPage'
import ActividadesDirectorPage        from './features/director/pages/ActividadesDirectorPage'
import ActividadDetalleDirectorPage   from './features/director/pages/ActividadDetalleDirectorPage'

// Dashboard por rol — CE-10: redirige según el rol del token
function DashboardRouter() {
  try {
    const token   = localStorage.getItem('token')
    const payload = JSON.parse(atob(token.split('.')[1]))
    const rol     = payload.rol ?? payload.role ?? ''
    if (rol === 'DIRECTOR') return <DashboardDirectorPage />
    if (rol === 'ADMIN')    return <DashboardAdminPage />
    return <DashboardEjecutivoPage />
  } catch {
    return <Navigate to="/login" replace />
  }
}

export default function App() {
  return (
    <Routes>
      {/* ── Públicas ── */}
      <Route path="/"      element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

      {/* ── Dashboard (CE-10) ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardRouter /></ProtectedRoute>
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

      {/* ── Actividades — Ejecutivo ── */}
      <Route path="/actividades/nueva"      element={<ProtectedRoute roles={['EJECUTIVO']}><ActividadCrearPage /></ProtectedRoute>} />
      <Route path="/actividades/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><ActividadEditarPage /></ProtectedRoute>} />
      {/* CE-32: mis actividades por período */}
      <Route path="/actividades" element={
        <ProtectedRoute roles={['EJECUTIVO']}>
          <ActividadesDirectorPage esDirector={false} />
        </ProtectedRoute>
      } />

      {/* ── Proyectos — Ejecutivo ── */}
      <Route path="/proyectos"             element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectosListaPage /></ProtectedRoute>} />
      <Route path="/proyectos/nuevo"       element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectoCrearPage /></ProtectedRoute>} />
      <Route path="/proyectos/:id"         element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectoDetallePage /></ProtectedRoute>} />
      <Route path="/proyectos/:id/editar"  element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectoEditarPage /></ProtectedRoute>} />

      {/* ── Director — CE-33, CE-34, CE-35, CE-36, CE-37 ── */}
      <Route path="/director/pipeline"               element={<ProtectedRoute roles={['DIRECTOR']}><PipelineDirectorPage /></ProtectedRoute>} />
      <Route path="/director/oportunidades/:id"      element={<ProtectedRoute roles={['DIRECTOR']}><OportunidadDetalleDirectorPage /></ProtectedRoute>} />
      <Route path="/director/actividades"            element={<ProtectedRoute roles={['DIRECTOR']}><ActividadesDirectorPage esDirector={true} /></ProtectedRoute>} />
      <Route path="/director/actividades/:id"        element={<ProtectedRoute roles={['DIRECTOR']}><ActividadDetalleDirectorPage /></ProtectedRoute>} />

      {/* ── Admin — Usuarios ── */}
      <Route path="/usuarios"            element={<ProtectedRoute roles={['ADMIN']}><UsuariosListaPage /></ProtectedRoute>} />
      <Route path="/usuarios/nuevo"      element={<ProtectedRoute roles={['ADMIN']}><UsuarioCrearPage /></ProtectedRoute>} />
      <Route path="/usuarios/:id/editar" element={<ProtectedRoute roles={['ADMIN']}><UsuarioEditarPage /></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}