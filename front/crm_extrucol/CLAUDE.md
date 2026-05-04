# CRM Extrucol — React Frontend

## Proyecto
Frontend React del CRM Comercial de Extrucol S.A.S.
Ruta: `C:\Users\PRACT.SISTEMAS\Desktop\crm-desarollo\front\crm_extrucol`

## Stack
- React 18 + Vite 5 + React Router v6 + TailwindCSS + Axios + @dnd-kit/core + Chart.js
- Sin state manager global (hooks locales + localStorage)
- Dual-mode API: `VITE_APEX_MODE=false` → REST Spring Boot | `true` → APEX On-Demand

## Estado actual
- **Fase 1 completa** — infraestructura dual-mode en todos los servicios
- **Fase 2 pendiente** — nuevas vistas (leads, metas, alertas, equipo, monitoreo, analisis, reportes)

## Archivos críticos
| Archivo | Propósito |
|---------|-----------|
| `src/shared/services/utils.js` | `APEX_MODE`, `toLower`, `unwrap`, `unwrapList`, `unwrapSingle` |
| `src/shared/apex/apexClient.js` | `callProcess(processName, extras)` — cliente APEX On-Demand |
| `src/shared/services/api.js` | Instancia axios con interceptores JWT |
| `src/features/auth/services/authService.js` | Login/logout/getRol/getNombre/isAuthenticated — dual-mode |
| `src/shared/hooks/useApexSession.js` | Inicialización sesión APEX al arrancar la app |
| `src/shared/components/AppLayout.jsx` | Sidebar + topbar, `NAV_BY_ROL` por rol |
| `src/App.jsx` | Todas las rutas, `DashboardRouter` por rol |

## Roles y rutas
| Rol | Rutas base | Dashboard |
|-----|-----------|-----------|
| `EJECUTIVO` | `/clientes`, `/leads`, `/oportunidades`, `/actividades`, `/proyectos`, `/metas` | `DashboardEjecutivoPage` |
| `COORDINADOR` | `/coordinador/*` | `DashboardCoordinadorPage` (pendiente) |
| `DIRECTOR` | `/director/*` | `DashboardDirectorPage` |
| `ADMIN` | `/usuarios` | `DashboardAdminPage` |

## Patrón de feature (estructura canónica)
```
src/features/{feature}/
  services/{feature}API.js   ← APEX_MODE ? apexOps : restOps
  hooks/use{Feature}.js      ← useState + useEffect + API
  pages/{Nombre}Page.jsx
  components/                ← internos, no exportar fuera del feature
```

## Skills disponibles
- `/crm-react-builder`    — crear/modificar features React con patrón dual-mode
- `/crm-apex-processes`   — generar PL/SQL de Application Processes APEX (catálogo de 49 procesos)
- `/crm-db-oracle`        — tablas, paquetes, vistas Oracle y configuración APEX

## Convenciones
- Extras de `callProcess`: usar `x01, x02, x03...` posicionalmente (nunca `p_nombre`, `p_id`)
- Nombres en español para entidades (CLIENTES, LEADS, OPORTUNIDADES...)
- APEX processes: `{ENTIDAD}_{OPERACION}` MAYÚSCULAS, verbo en inglés (LIST, GET, CREATE...)
- Colores brand: `#24388C` (azul), `#F39610` (naranja)
- Íconos: SVG inline en `AppLayout.jsx → Icon`

## Variables de entorno
| Variable | REST | APEX |
|---------|------|------|
| `VITE_APEX_MODE` | `false` | `true` |
| `VITE_API_BASE_URL` | `http://localhost:8080` | (no se usa) |
| `VITE_APEX_FLOW_ID` | — | ID de la app APEX (ej. `100`) |
| `VITE_APEX_TARGET` | — | URL instancia APEX (para proxy dev) |

Scripts: `npm run dev:rest` | `npm run dev:apex` | `npm run build:rest` | `npm run build:apex`

## Mockups de referencia
`C:\Users\PRACT.SISTEMAS\Downloads\crm-mockups-open\crm-mockups-open\`
Ver `AGENTS.md` para el mapa completo mockup → feature → estado.
