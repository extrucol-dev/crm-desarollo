# AGENTS.md — CRM Extrucol React Frontend
# Contexto completo para Claude Code, OpenCode (Minimax), Cursor y cualquier agente de IA

## Proyecto
CRM Comercial de Extrucol S.A.S. — frontend React desacoplado que puede operar en dos modos:
- **REST mode** (`VITE_APEX_MODE=false`): habla con un API Spring Boot en `localhost:8080`
- **APEX mode** (`VITE_APEX_MODE=true`): habla con Oracle APEX On-Demand Processes vía POST a `/apex/wwv_flow.ajax`

Ruta del proyecto: `C:\Users\PRACT.SISTEMAS\Desktop\crm-desarollo\front\crm_extrucol`
Mockups HTML de referencia: `C:\Users\PRACT.SISTEMAS\Downloads\crm-mockups-open\crm-mockups-open\`

---

## Stack tecnológico
- React 18 + Vite 5 + React Router v6
- TailwindCSS 3 (sin librería de componentes, CSS propio)
- Axios 1.x (solo en REST mode)
- @dnd-kit/core (Kanban drag-and-drop)
- Sin Redux/Zustand — hooks locales + localStorage
- Colores brand: `#24388C` (azul Extrucol), `#F39610` (naranja)

---

## Estructura de carpetas

```
src/
  App.jsx                          ← Router principal, DashboardRouter por rol
  main.jsx                         ← Punto de entrada, BrowserRouter
  features/
    auth/
      services/authService.js      ← login/logout/getRol/getNombre/isAuthenticated (dual-mode)
      pages/LoginPage.jsx
      pages/OAuth2CallbackPage.jsx
    dashboard/
      pages/DashboardEjecutivoPage.jsx
      pages/DashboardAdminPage.jsx
      pages/DashboardCoordinadorPage.jsx  (PENDIENTE)
    director/
      pages/DashboardDirectorPage.jsx
      pages/PipelineDirectorPage.jsx
      pages/ActividadesDirectorPage.jsx
      pages/OportunidadDetalleDirectorPage.jsx
      pages/ActividadDetalleDirectorPage.jsx
      services/directorAPI.js
    clientes/
      services/clientesAPI.js
      hooks/useClientes.js / useClienteForm.js
      pages/ClientesListaPage.jsx / ClienteDetallePage.jsx / ClienteRegistroPage.jsx / ClienteEditarPage.jsx
      components/ClientesTable.jsx / ClienteForm.jsx
    oportunidades/
      services/oportunidadesAPI.js
      hooks/useOportunidades.js / useOportunidadForm.js / useOportunidadDetalle.js
      pages/OportunidadesKanbanPage.jsx / OportunidadDetallePage.jsx / OportunidadCrearPage.jsx / OportunidadEditarPage.jsx
      components/KanbanBoard.jsx / KanbanCard.jsx / OportunidadForm.jsx / CierreModal.jsx
    actividades/
      services/actividadesAPI.js
      hooks/useActividadForm.js
      pages/ActividadCrearPage.jsx / ActividadEditarPage.jsx
      components/ActividadForm.jsx
    proyectos/
      services/proyectosAPI.js
      hooks/useProyectos.js / useProyectoForm.js
      pages/ProyectosListaPage.jsx / ProyectoDetallePage.jsx / ProyectoCrearPage.jsx / ProyectoEditarPage.jsx
    usuarios/
      services/usuariosAPI.js
      hooks/useUsuarios.js / useUsuarioForm.js
      pages/UsuariosListaPage.jsx / UsuarioCrearPage.jsx / UsuarioEditarPage.jsx
      components/UsuariosTable.jsx / UsuarioForm.jsx
    leads/               (PENDIENTE — crear completo)
    metas/               (PENDIENTE — crear completo)
    alertas/             (PENDIENTE — crear completo)
    equipo/              (PENDIENTE — crear completo)
    monitoreo/           (PENDIENTE — requiere react-leaflet)
    analisis/            (PENDIENTE — crear completo)
    reportes/            (PENDIENTE — crear completo)
  shared/
    services/
      api.js             ← axios con interceptores JWT y refresh automático
      utils.js           ← APEX_MODE, toLower, unwrap, unwrapList, unwrapSingle
      ciudadesAPI.js     ← catálogo de ciudades (dual-mode)
    apex/
      apexClient.js      ← callProcess(processName, extras) — transporte APEX
    hooks/
      useApexSession.js  ← inicialización sesión APEX en arranque de la app
    components/
      AppLayout.jsx      ← sidebar + topbar, NAV_BY_ROL por rol
      ProtectedRoute.jsx ← protección de ruta, verificación de rol
      FormField.jsx      ← inputs, selects, textareas con label y validación
      Topbar.jsx
```

---

## Arquitectura dual-mode: cómo funciona

### El toggle

```js
// src/shared/services/utils.js
export const APEX_MODE = String(import.meta.env.VITE_APEX_MODE) === 'true'
```

`APEX_MODE` es una constante de compilación. Vite reemplaza `import.meta.env.VITE_APEX_MODE` con el literal `"true"` o `"false"` en tiempo de build. El tree-shaking elimina el branch muerto en producción.

### En REST mode (`APEX_MODE=false`)

- Todas las peticiones usan la instancia `axios` de `api.js`
- `baseURL`: `http://localhost:8080`
- Auth: JWT Bearer en header `Authorization: Bearer {token}`
- Refresh automático via cookie en `/api/auth/refresh`
- El usuario hace login en `LoginPage.jsx`

### En APEX mode (`APEX_MODE=true`)

- Todas las peticiones usan `callProcess()` de `apexClient.js`
- Transport: `POST /apex/wwv_flow.ajax` con `URLSearchParams`
- Auth: sesión APEX (cookie automática con `credentials: 'include'`)
- No hay login page — APEX ya autenticó al usuario
- Al arrancar la app, `useApexSession` llama `USUARIO_ACTUAL` y escribe `rol`/`nombre` en `localStorage`

---

## Archivos de infraestructura dual-mode

### `src/shared/services/utils.js`

```js
export const APEX_MODE = String(import.meta.env.VITE_APEX_MODE) === 'true'

// Convierte recursivamente todas las claves a minúsculas
// (Oracle devuelve columnas en MAYÚSCULAS por defecto)
export const toLower = (val) => {
  if (Array.isArray(val)) return val.map(toLower)
  if (val !== null && typeof val === 'object')
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k.toLowerCase(), toLower(v)]))
  return val
}

// Extrae el array/objeto del envelope APEX (data/items/rows/result)
export const unwrap = (payload) => {
  if (!payload || typeof payload !== 'object') return payload
  const envelope = payload.data ?? payload.items ?? payload.rows ?? payload.result
  return envelope !== undefined ? toLower(envelope) : toLower(payload)
}

// Garantiza array para operaciones de lista
export const unwrapList   = (p) => { const r = unwrap(p); return Array.isArray(r) ? r : (r ? [r] : []) }
// Garantiza objeto para operaciones de detalle
export const unwrapSingle = (p) => { const r = unwrap(p); return Array.isArray(r) ? r[0] ?? null : r }
```

### `src/shared/apex/apexClient.js`

```js
import { APEX_MODE } from '../services/utils'

const getApexEnv = () => {
  if (typeof window !== 'undefined' && window.apex?.env) {
    return {
      appId:   String(window.apex.env.APP_ID      ?? import.meta.env.VITE_APEX_FLOW_ID ?? '0'),
      pageId:  String(window.apex.env.APP_PAGE_ID ?? '0'),
      session: String(window.apex.env.APP_SESSION ?? '0'),
    }
  }
  const byId = (id) => document.getElementById(id)?.value ?? '0'
  return { appId: byId('pFlowId'), pageId: byId('pFlowStepId'), session: byId('pInstance') }
}

export const callProcess = async (processName, extras = {}) => {
  if (!APEX_MODE)
    throw new Error(`callProcess('${processName}') llamado en modo REST.`)

  const { appId, pageId, session } = getApexEnv()
  const body = new URLSearchParams({
    p_request:      `APPLICATION_PROCESS=${processName}`,
    p_flow_id:      appId,
    p_flow_step_id: pageId,
    p_instance:     session,
    p_debug:        '',
  })
  Object.entries(extras).forEach(([k, v]) => {
    if (v !== undefined && v !== null) body.append(k, String(v))
  })

  const res = await fetch('/apex/wwv_flow.ajax', {
    method: 'POST', body,
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
  })

  if (!res.ok)
    throw new Error(`APEX process "${processName}" falló: HTTP ${res.status}`)

  const text = await res.text()
  try { return JSON.parse(text) }
  catch { throw new Error(`APEX process "${processName}" devolvió no-JSON: ${text.slice(0, 200)}`) }
}
```

---

## Patrón de API dual-mode en cada feature

```js
// src/features/clientes/services/clientesAPI.js
import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:     ()         => api.get('/api/clientes/listar').then(r => r.data),
  buscar:     (id)       => api.get(`/api/clientes/${id}`).then(r => r.data),
  crear:      (data)     => api.post('/api/clientes', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/api/clientes/${id}`, data).then(r => r.data),
}

const apexOps = {
  listar:     ()         => callProcess('CLIENTES_LIST').then(unwrapList),
  buscar:     (id)       => callProcess('CLIENTES_GET',    { x01: id }).then(unwrapSingle),
  crear:      (data)     => callProcess('CLIENTES_CREATE', {
    x01: data.nombre, x02: data.empresa, x03: data.sector,
    x04: data.ciudad?.id ?? data.ciudad_id, x05: data.email, x06: data.telefono,
  }).then(unwrapSingle),
  actualizar: (id, data) => callProcess('CLIENTES_UPDATE', {
    x01: id, x02: data.nombre, x03: data.empresa, x04: data.sector,
    x05: data.ciudad?.id ?? data.ciudad_id, x06: data.email, x07: data.telefono,
  }).then(unwrapSingle),
}

export const clientesAPI = APEX_MODE ? apexOps : restOps
```

**Nota:** Para `ciudadesAPI.js` (en `shared/services/`), las rutas de import cambian:
```js
import { callProcess } from '../apex/apexClient'
import { APEX_MODE, unwrapList } from './utils'
```

---

## Auth dual-mode

### REST mode
- Login: `POST /api/auth/login` → JWT en `localStorage.token`
- Rol decodificado del JWT payload: `payload.rol ?? payload.role`
- `isAuthenticated()` → `!!localStorage.getItem('token')`

### APEX mode
- Al iniciar la app: `useApexSession` llama `callProcess('USUARIO_ACTUAL')`
- `USUARIO_ACTUAL` devuelve `{ rol: "EJECUTIVO"|"DIRECTOR"|"COORDINADOR"|"ADMIN", nombre, id }`
- Escribe en localStorage: `rol`, `nombre`, `userId`
- `isAuthenticated()` → `!!localStorage.getItem('rol')`
- No hay página de login — `<Route path="/login">` redirige a `/dashboard`
- Logout: redirige a `/apex/f?p=APP_ID:LOGOUT:0` (invalida sesión servidor)

---

## Patrón de hook de lista

```js
import { useState, useCallback, useEffect, useMemo } from 'react'
import { {feature}API } from '../services/{feature}API'

export function use{Feature}() {
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [busqueda, setBusqueda] = useState('')

  const cargar = useCallback(() => {
    setLoading(true)
    {feature}API.listar()
      .then(setItems)
      .catch(() => setError('Error al cargar.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const filtrados = useMemo(
    () => items.filter(i => i.nombre?.toLowerCase().includes(busqueda.toLowerCase())),
    [items, busqueda]
  )

  return { items, filtrados, loading, error, busqueda, setBusqueda, cargar }
}
```

---

## Roles y navegación

### EJECUTIVO
Rutas: `/dashboard`, `/leads`, `/clientes`, `/oportunidades`, `/actividades`, `/proyectos`, `/metas`

### COORDINADOR
Rutas: `/dashboard`, `/coordinador/estancadas`, `/actividades`, `/coordinador/monitoreo`, `/coordinador/mapa-actividades`, `/coordinador/cumplimiento`, `/coordinador/alertas`, `/coordinador/notificaciones`, `/coordinador/equipo/:id`

### DIRECTOR
Rutas: `/dashboard`, `/director/pipeline`, `/director/actividades`, `/director/equipo`, `/director/analisis`, `/director/forecast`, `/director/reportes`

### ADMIN
Rutas: `/dashboard`, `/usuarios`

El sidebar por rol está en `AppLayout.jsx → NAV_BY_ROL`. COORDINADOR es el único rol sin entradas definidas aún — añadirlo es parte del trabajo pendiente.

---

## Variables de entorno

| Variable | REST (`.env.rest`) | APEX (`.env.apex`) |
|---------|-------------------|-------------------|
| `VITE_APEX_MODE` | `false` | `true` |
| `VITE_API_BASE_URL` | `http://localhost:8080` | (no se usa) |
| `VITE_APEX_FLOW_ID` | — | ID app APEX (ej. `100`) |
| `VITE_APEX_TARGET` | — | URL servidor APEX (proxy dev) |

Scripts npm:
```
npm run dev:rest      → vite --mode rest
npm run dev:apex      → vite --mode apex
npm run build:rest    → vite build --mode rest
npm run build:apex    → vite build --mode apex (nombres fijos, sin hash, para APEX Static Files)
```

---

## Mapa completo mockup → feature → página → estado

### Ejecutivo
| Mockup | Feature | Página | Estado |
|--------|---------|--------|--------|
| `ejecutivo/01-dashboard.html` | dashboard | DashboardEjecutivoPage | LISTO |
| `ejecutivo/02-oportunidades-kanban.html` | oportunidades | OportunidadesKanbanPage | LISTO |
| `ejecutivo/03-leads-kanban.html` | leads | LeadsKanbanPage | **PENDIENTE** |
| `ejecutivo/04-oportunidad-detalle.html` | oportunidades | OportunidadDetallePage | LISTO |
| `ejecutivo/05-oportunidad-form.html` | oportunidades | OportunidadCrearPage/EditarPage | LISTO |
| `ejecutivo/06-clientes.html` | clientes | ClientesListaPage | LISTO |
| `ejecutivo/07-actividades.html` | actividades | ActividadesDirectorPage | LISTO |
| `ejecutivo/08-proyectos.html` | proyectos | ProyectosListaPage | LISTO |
| `ejecutivo/09-lead-form.html` | leads | LeadFormPage | **PENDIENTE** |
| `ejecutivo/10-lead-detalle.html` | leads | LeadDetallePage | **PENDIENTE** |
| `ejecutivo/11-cierre-oportunidad-ganada.html` | oportunidades | CierreModal | LISTO |
| `ejecutivo/12-mis-metas.html` | metas | MisMetasPage | **PENDIENTE** |
| `ejecutivo/13-actividad-detalle.html` | actividades | ActividadDetalleDirectorPage | LISTO |
| `ejecutivo/14-cliente-detalle.html` | clientes | ClienteDetallePage | LISTO |
| `ejecutivo/15-proyecto-detalle.html` | proyectos | ProyectoDetallePage | LISTO |
| `ejecutivo/16-lead-conversion.html` | leads | LeadConversionPage | **PENDIENTE** |
| `ejecutivo/17-cierre-oportunidad-perdida.html` | oportunidades | CierreModal | LISTO |

### Coordinador
| Mockup | Feature | Página | Estado |
|--------|---------|--------|--------|
| `coordinador/01-dashboard.html` | dashboard | DashboardCoordinadorPage | **PENDIENTE** |
| `coordinador/02-variables-sistema.html` | admin | (partial) | PARCIAL |
| `coordinador/03-monitoreo-mapa-notif.html` | monitoreo | MonitoreoMapaPage | **PENDIENTE** |
| `coordinador/04-cumplimiento.html` | metas | CumplimientoPage | **PENDIENTE** |
| `coordinador/05-ejecutivo-perfil.html` | equipo | EjecutivoPerfilPage | **PENDIENTE** |
| `coordinador/05-estancados.html` | oportunidades | OportunidadesEstancadasPage | **PENDIENTE** |
| `coordinador/06-mapa-actividades.html` | monitoreo | MapaActividadesPage | **PENDIENTE** |
| `coordinador/07-actividades.html` | actividades | ActividadesDirectorPage | LISTO |
| `coordinador/07-log-otificaciones.html` | alertas | LogNotificacionesPage | **PENDIENTE** |
| `coordinador/08-alertas.html` | alertas | AlertasCenterPage | **PENDIENTE** |

### Director
| Mockup | Feature | Página | Estado |
|--------|---------|--------|--------|
| `director/01-dashboard.html` | director | DashboardDirectorPage | LISTO |
| `director/02-pipeline-global.html` | director | PipelineDirectorPage | PARCIAL |
| `director/03-analisis-sectores.html` | analisis | AnalisisSectoresPage | **PENDIENTE** |
| `director/04-forecasting.html` | analisis | ForecastingPage | **PENDIENTE** |
| `director/05-ejecutivo-perfil.html` | equipo | EjecutivoPerfilPage | **PENDIENTE** |
| `director/05-equipo-comercial.html` | equipo | EquipoComercialPage | **PENDIENTE** |
| `director/06-reportes.html` | reportes | ReportesPage | **PENDIENTE** |
| `director/07-oportunidad-detalle.html` | director | OportunidadDetalleDirectorPage | LISTO |

---

## Catálogo completo de APEX Processes (49 procesos)

| Proceso | Entidad | REST equivalente | Parámetros (x01, x02...) |
|---------|---------|-----------------|--------------------------|
| `USUARIO_ACTUAL` | auth | (del JWT) | — |
| `CLIENTES_LIST` | clientes | GET /api/clientes/listar | — |
| `CLIENTES_GET` | clientes | GET /api/clientes/:id | x01=id |
| `CLIENTES_CREATE` | clientes | POST /api/clientes | x01=nombre, x02=empresa, x03=sector, x04=ciudad_id, x05=email, x06=telefono |
| `CLIENTES_UPDATE` | clientes | PUT /api/clientes/:id | x01=id + campos de CREATE |
| `LEADS_LIST` | leads | GET /api/leads | — |
| `LEADS_GET` | leads | GET /api/leads/:id | x01=id |
| `LEADS_CREATE` | leads | POST /api/leads | x01=nombre, x02=empresa, x03=email, x04=telefono, x05=origen, x06=sector, x07=ciudad_id, x08=descripcion |
| `LEADS_UPDATE` | leads | PUT /api/leads/:id | x01=id + campos de CREATE |
| `LEADS_ESTADO` | leads | PUT /api/leads/:id/estado | x01=id, x02=estado |
| `LEADS_CONVERTIR` | leads | POST /api/leads/:id/convertir | x01=id, x02=nombre_oportunidad, x03=valor_estimado, x04=fecha_cierre |
| `OPORTUNIDADES_LIST` | oportunidades | GET /api/oportunidades | — |
| `OPORTUNIDADES_LIST_TODAS` | oportunidades | GET /api/oportunidades/todas | — |
| `OPORTUNIDADES_GET` | oportunidades | GET /api/oportunidades/:id/detalles | x01=id |
| `OPORTUNIDADES_CREATE` | oportunidades | POST /api/oportunidades | x01=nombre, x02=descripcion, x03=tipo, x04=valor_estimado, x05=fecha_cierre, x06=cliente_id |
| `OPORTUNIDADES_UPDATE` | oportunidades | PUT /api/oportunidades/:id | x01=id + campos de CREATE + x07=estado |
| `OPORTUNIDADES_AVANZAR` | oportunidades | PUT /api/oportunidades/:id/estado | x01=id, x02=estado |
| `OPORTUNIDADES_CERRAR` | oportunidades | PUT /api/oportunidades/:id/cierre | x01=id, x02=estado, x03=fecha_cierre, x04=motivo_cierre |
| `OPORTUNIDADES_ACTIVIDADES` | oportunidades | GET /api/oportunidades/:id/actividades | x01=id |
| `OPORTUNIDADES_ESTANCADAS` | oportunidades | (nuevo endpoint) | x01=dias_sin_actividad |
| `ACTIVIDADES_CREATE` | actividades | POST /api/actividades | x01=tipo, x02=descripcion, x03=virtual(1/0), x04=fecha_actividad, x05=oportunidad_id |
| `ACTIVIDADES_GET` | actividades | GET /api/actividades/:id | x01=id |
| `ACTIVIDADES_UPDATE` | actividades | PUT /api/actividades/:id | x01=id + campos de CREATE |
| `ACTIVIDADES_CERRAR` | actividades | PUT /api/actividades/:id/cierre | x01=id, x02=resultado, x03=latitud, x04=longitud |
| `ACTIVIDADES_LIST_TODAS` | actividades | GET /api/actividades/todas | x01=inicio, x02=fin |
| `ACTIVIDADES_LIST_MIS` | actividades | GET /api/actividades | x01=inicio, x02=fin |
| `PROYECTOS_LIST` | proyectos | GET /api/proyectos | — |
| `PROYECTOS_LIST_TODOS` | proyectos | GET /api/proyectos/todos | — |
| `PROYECTOS_GET` | proyectos | GET /api/proyectos/:id | x01=id |
| `PROYECTOS_CREATE` | proyectos | POST /api/proyectos | x01=nombre, x02=descripcion, x03=oportunidad_id |
| `PROYECTOS_UPDATE` | proyectos | PUT /api/proyectos/:id | x01=id, x02=nombre, x03=descripcion, x04=estado, x05=oportunidad_id |
| `PROYECTOS_ESTADO` | proyectos | PUT /api/proyectos/:id/estado | x01=id, x02=estado |
| `USUARIOS_LIST` | usuarios | GET /api/usuarios | — |
| `USUARIOS_GET` | usuarios | GET /api/usuarios/:id | x01=id |
| `USUARIOS_CREATE` | usuarios | POST /api/usuarios | x01=nombre, x02=email, x03=rol, x04=ciudad_id |
| `USUARIOS_UPDATE` | usuarios | PUT /api/usuarios/:id | x01=id + campos de CREATE |
| `USUARIOS_ESTADO` | usuarios | PUT /api/usuarios/:id/estado | x01=id, x02=activo(1/0) |
| `CIUDADES_LIST` | ciudades | GET /api/ciudades | — |
| `DASHBOARD_EJECUTIVO` | dashboard | (KPIs del JWT user) | — |
| `DASHBOARD_COORDINADOR` | dashboard | (KPIs equipo) | — |
| `METAS_MIS_METAS` | metas | GET /api/metas | — |
| `METAS_CUMPLIMIENTO` | metas | GET /api/metas/cumplimiento | x01=periodo (YYYY-MM) |
| `ALERTAS_LIST` | alertas | GET /api/alertas | — |
| `ALERTAS_LOG` | alertas | GET /api/alertas/log | x01=inicio, x02=fin |
| `ALERTAS_MARCAR_LEIDA` | alertas | PUT /api/alertas/:id/leida | x01=id |
| `EQUIPO_LIST` | equipo | GET /api/equipo | — |
| `EQUIPO_GET_EJECUTIVO` | equipo | GET /api/equipo/:id | x01=id |
| `MONITOREO_EJECUTIVOS_GPS` | monitoreo | GET /api/monitoreo/gps | — |
| `MONITOREO_ACTIVIDADES_MAPA` | monitoreo | GET /api/monitoreo/actividades | x01=fecha |
| `ANALISIS_SECTORES` | analisis | GET /api/analisis/sectores | x01=periodo |
| `ANALISIS_FORECAST` | analisis | GET /api/analisis/forecast | x01=meses |
| `REPORTES_LIST` | reportes | GET /api/reportes | — |
| `REPORTES_GENERAR` | reportes | POST /api/reportes/generar | x01=tipo, x02=inicio, x03=fin |

---

## Convenciones de código

### Naming
- Procesos APEX: `{ENTIDAD}_{OPERACION}` en MAYÚSCULAS (entidad en español, operación en inglés)
- Componentes React: PascalCase
- Hooks: camelCase con prefijo `use`
- Servicios API: camelCase con sufijo `API` (ej. `clientesAPI`, `leadsAPI`)
- Páginas: sufijo `Page` (ej. `LeadsKanbanPage`)
- Sin comentarios obvios — solo cuando el POR QUÉ no es claro

### Estructura de feature (canon)
```
src/features/{feature}/
  services/{feature}API.js     OBLIGATORIO — dual-mode APEX_MODE
  hooks/use{Feature}.js        OBLIGATORIO — estado + useEffect + API
  pages/{Nombre}Page.jsx       una por pantalla
  components/                  internos, no exportar fuera del feature
```

### Colores Tailwind en este proyecto
- `bg-[#24388C]` — azul primario (sidebar, botones principales)
- `text-[#F39610]` — naranja accent
- `bg-[#F7F7F7]` — fondo de la app
- `bg-white border border-[#F0F0F0] rounded-xl` — tarjetas y tablas
- `text-[#1A1A1A]` — texto principal
- `text-[#4A4A4A]` — texto secundario

### Formularios
Usar siempre el componente `FormField` de `src/shared/components/FormField.jsx` para inputs, selects y textareas. Proporciona label, error message y estilos consistentes.

---

## Features pendientes — orden de implementación

1. **Fase 3** (ya completada): Skills + CLAUDE.md + AGENTS.md
2. **Fase 1** — Infraestructura dual-mode: `utils.js`, `apexClient.js`, `authService.js`, `useApexSession.js`, wrappers APEX en 7 servicios existentes, `App.jsx`, `vite.config.js`, `.env.rest`/`.env.apex`
3. **Fase 2** — Nuevas vistas:
   - `leads` (4 páginas) — máxima prioridad
   - Dashboard coordinador
   - `metas` (2 páginas)
   - `alertas` (2 páginas)
   - `equipo` (3 páginas)
   - Oportunidades estancadas
   - Sidebar coordinador en AppLayout
   - `analisis` (2 páginas)
   - `reportes` (1 página)
   - `monitoreo` (2 páginas, requiere `npm install leaflet react-leaflet`)
