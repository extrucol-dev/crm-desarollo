import { Routes, Route, Navigate } from 'react-router-dom'
import { APEX_MODE } from './shared/services/utils'
import { useApexSession } from './shared/hooks/useApexSession'
import { authService } from './features/auth/services/authService'
import ProtectedRoute from './shared/components/ProtectedRoute'
import OAuth2CallbackPage from './features/auth/pages/OAuth2CallbackPage.jsx'

// Auth
import LoginPage from './features/auth/pages/LoginPage'

// Dashboard por rol
import DashboardEjecutivoPage    from './features/dashboard/pages/DashboardEjecutivoPage'
import DashboardAdminPage        from './features/dashboard/pages/DashboardAdminPage'
import DashboardDirectorPage     from './features/director/pages/DashboardDirectorPage'
import DashboardCoordinadorPage  from './features/dashboard/pages/DashboardCoordinadorPage'

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
import OportunidadesKanbanPage    from './features/oportunidades/pages/OportunidadesKanbanPage'
import OportunidadCrearPage       from './features/oportunidades/pages/OportunidadCrearPage'
import OportunidadDetallePage     from './features/oportunidades/pages/OportunidadDetallePage'
import OportunidadEditarPage      from './features/oportunidades/pages/OportunidadEditarPage'
import OportunidadesEstancadasPage from './features/oportunidades/pages/OportunidadesEstancadasPage'

// Actividades
import ActividadCrearPage  from './features/actividades/pages/ActividadCrearPage'
import ActividadEditarPage from './features/actividades/pages/ActividadEditarPage'

// Leads
import LeadsKanbanPage    from './features/leads/pages/LeadsKanbanPage'
import LeadFormPage       from './features/leads/pages/LeadFormPage'
import LeadDetallePage    from './features/leads/pages/LeadDetallePage'
import LeadConversionPage from './features/leads/pages/LeadConversionPage'

// Proyectos
import ProyectosListaPage  from './features/proyectos/pages/ProyectosListaPage'
import ProyectoDetallePage from './features/proyectos/pages/ProyectoDetallePage'
import ProyectoCrearPage   from './features/proyectos/pages/ProyectoCrearPage'
import ProyectoEditarPage  from './features/proyectos/pages/ProyectoEditarPage'

// Metas
import MisMetasPage      from './features/metas/pages/MisMetasPage'
import CumplimientoPage  from './features/metas/pages/CumplimientoPage'

// Alertas
import AlertasCenterPage      from './features/alertas/pages/AlertasCenterPage'
import LogNotificacionesPage  from './features/alertas/pages/LogNotificacionesPage'

// Equipo
import EquipoComercialPage    from './features/equipo/pages/EquipoComercialPage'
import EjecutivoPerfilPage    from './features/equipo/pages/EjecutivoPerfilPage'

// Director
import PipelineDirectorPage           from './features/director/pages/PipelineDirectorPage'
import OportunidadDetalleDirectorPage from './features/director/pages/OportunidadDetalleDirectorPage'
import ActividadesDirectorPage        from './features/director/pages/ActividadesDirectorPage'
import ActividadDetalleDirectorPage   from './features/director/pages/ActividadDetalleDirectorPage'

// Análisis
import AnalisisSectoresPage from './features/analisis/pages/AnalisisSectoresPage'
import ForecastingPage      from './features/analisis/pages/ForecastingPage'

// Reportes
import ReportesPage from './features/reportes/pages/ReportesPage'

// Redirige al dashboard del rol activo.
// Usa authService.getRol() que funciona en ambos modos (REST: del JWT, APEX: de USUARIO_ACTUAL).
function DashboardRouter() {
  const rol = authService.getRol() ?? ''
  if (rol === 'DIRECTOR')    return <DashboardDirectorPage />
  if (rol === 'ADMIN')       return <DashboardAdminPage />
  if (rol === 'EJECUTIVO')   return <DashboardEjecutivoPage />
  if (rol === 'COORDINADOR') return <DashboardCoordinadorPage />
  return <Navigate to="/login" replace />
}

// Spinner mínimo mientras APEX inicializa la sesión
function CargandoSesion() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F7F7F7]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#24388C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#4A4A4A]">Iniciando sesión...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { ready, error } = useApexSession()

  // Bloquear render hasta que APEX_MODE resuelva el usuario (REST: inmediato)
  if (!ready) return <CargandoSesion />

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-[#F7F7F7]">
      <div className="max-w-sm text-center p-6 bg-white rounded-xl border border-[#F0F0F0]">
        <p className="text-red-600 font-medium mb-2">Error de sesión APEX</p>
        <p className="text-sm text-[#4A4A4A]">{error}</p>
        <p className="text-xs text-[#9A9A9A] mt-3">Verifica que el proceso USUARIO_ACTUAL esté configurado en APEX Builder.</p>
      </div>
    </div>
  )

  return (
    <Routes>
      {/* ── Raíz ── */}
      <Route path="/" element={<Navigate to={APEX_MODE ? '/dashboard' : '/login'} replace />} />

      {/* ── Login: en APEX mode redirige a dashboard (APEX ya autenticó) ── */}
      <Route path="/login"
        element={APEX_MODE ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/oauth2/callback"
        element={APEX_MODE ? <Navigate to="/dashboard" replace /> : <OAuth2CallbackPage />} />

      {/* ── Dashboard (enrutamiento por rol) ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardRouter /></ProtectedRoute>
      } />

      {/* ── Clientes — Ejecutivo ── */}
      <Route path="/clientes"            element={<ProtectedRoute roles={['EJECUTIVO']}><ClientesListaPage /></ProtectedRoute>} />
      <Route path="/clientes/nuevo"      element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteRegistroPage /></ProtectedRoute>} />
      <Route path="/clientes/:id"        element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteDetallePage /></ProtectedRoute>} />
      <Route path="/clientes/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><ClienteEditarPage /></ProtectedRoute>} />

      {/* ── Leads — Ejecutivo ── */}
      <Route path="/leads"                 element={<ProtectedRoute roles={['EJECUTIVO']}><LeadsKanbanPage /></ProtectedRoute>} />
      <Route path="/leads/nuevo"           element={<ProtectedRoute roles={['EJECUTIVO']}><LeadFormPage /></ProtectedRoute>} />
      <Route path="/leads/:id"             element={<ProtectedRoute roles={['EJECUTIVO']}><LeadDetallePage /></ProtectedRoute>} />
      <Route path="/leads/:id/editar"      element={<ProtectedRoute roles={['EJECUTIVO']}><LeadFormPage /></ProtectedRoute>} />
      <Route path="/leads/:id/convertir"   element={<ProtectedRoute roles={['EJECUTIVO']}><LeadConversionPage /></ProtectedRoute>} />

      {/* ── Oportunidades — Ejecutivo ── */}
      <Route path="/oportunidades"            element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadesKanbanPage /></ProtectedRoute>} />
      <Route path="/oportunidades/nueva"      element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadCrearPage /></ProtectedRoute>} />
      <Route path="/oportunidades/:id"        element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadDetallePage /></ProtectedRoute>} />
      <Route path="/oportunidades/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><OportunidadEditarPage /></ProtectedRoute>} />

      {/* ── Actividades — Ejecutivo ── */}
      <Route path="/actividades" element={
        <ProtectedRoute roles={['EJECUTIVO']}>
          <ActividadesDirectorPage esDirector={false} />
        </ProtectedRoute>
      } />
      <Route path="/actividades/nueva"      element={<ProtectedRoute roles={['EJECUTIVO']}><ActividadCrearPage /></ProtectedRoute>} />
      <Route path="/actividades/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><ActividadEditarPage /></ProtectedRoute>} />

      {/* ── Proyectos — Ejecutivo ── */}
      <Route path="/proyectos"            element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectosListaPage /></ProtectedRoute>} />
      <Route path="/proyectos/nuevo"      element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectoCrearPage /></ProtectedRoute>} />
      <Route path="/proyectos/:id"        element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectoDetallePage /></ProtectedRoute>} />
      <Route path="/proyectos/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><ProyectoEditarPage /></ProtectedRoute>} />

      {/* ── Director ── */}
      <Route path="/director/pipeline"          element={<ProtectedRoute roles={['DIRECTOR']}><PipelineDirectorPage /></ProtectedRoute>} />
      <Route path="/director/oportunidades/:id" element={<ProtectedRoute roles={['DIRECTOR']}><OportunidadDetalleDirectorPage /></ProtectedRoute>} />
      <Route path="/director/actividades"       element={<ProtectedRoute roles={['DIRECTOR']}><ActividadesDirectorPage esDirector={true} /></ProtectedRoute>} />
      <Route path="/director/actividades/:id"   element={<ProtectedRoute roles={['DIRECTOR']}><ActividadDetalleDirectorPage /></ProtectedRoute>} />

      {/* ── Metas — Ejecutivo ── */}
      <Route path="/metas" element={<ProtectedRoute roles={['EJECUTIVO']}><MisMetasPage /></ProtectedRoute>} />

      {/* ── Coordinador ── */}
      <Route path="/coordinador/dashboard"        element={<ProtectedRoute roles={['COORDINADOR']}><DashboardCoordinadorPage /></ProtectedRoute>} />
      <Route path="/coordinador/cumplimiento"     element={<ProtectedRoute roles={['COORDINADOR']}><CumplimientoPage /></ProtectedRoute>} />
      <Route path="/coordinador/alertas"          element={<ProtectedRoute roles={['COORDINADOR']}><AlertasCenterPage /></ProtectedRoute>} />
      <Route path="/coordinador/notificaciones"   element={<ProtectedRoute roles={['COORDINADOR']}><LogNotificacionesPage /></ProtectedRoute>} />
      <Route path="/coordinador/equipo/:id"       element={<ProtectedRoute roles={['COORDINADOR']}><EjecutivoPerfilPage /></ProtectedRoute>} />
      <Route path="/coordinador/estancadas"       element={<ProtectedRoute roles={['COORDINADOR']}><OportunidadesEstancadasPage /></ProtectedRoute>} />

      {/* ── Director — Equipo ── */}
      <Route path="/director/equipo"     element={<ProtectedRoute roles={['DIRECTOR']}><EquipoComercialPage /></ProtectedRoute>} />
      <Route path="/director/equipo/:id" element={<ProtectedRoute roles={['DIRECTOR']}><EjecutivoPerfilPage /></ProtectedRoute>} />

      {/* ── Director — Análisis y Reportes ── */}
      <Route path="/director/analisis"  element={<ProtectedRoute roles={['DIRECTOR']}><AnalisisSectoresPage /></ProtectedRoute>} />
      <Route path="/director/forecast"  element={<ProtectedRoute roles={['DIRECTOR']}><ForecastingPage /></ProtectedRoute>} />
      <Route path="/director/reportes"  element={<ProtectedRoute roles={['DIRECTOR']}><ReportesPage /></ProtectedRoute>} />

      {/* ── Admin — Usuarios ── */}
      <Route path="/usuarios"            element={<ProtectedRoute roles={['ADMIN']}><UsuariosListaPage /></ProtectedRoute>} />
      <Route path="/usuarios/nuevo"      element={<ProtectedRoute roles={['ADMIN']}><UsuarioCrearPage /></ProtectedRoute>} />
      <Route path="/usuarios/:id/editar" element={<ProtectedRoute roles={['ADMIN']}><UsuarioEditarPage /></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to={APEX_MODE ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
