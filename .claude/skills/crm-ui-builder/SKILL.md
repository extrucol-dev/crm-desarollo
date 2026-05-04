---
name: crm-ui-builder
description: >-
  CRM Extrucol UI builder — pages AND modals. ALWAYS USE when: create page, new screen,
  add modal, add dialog, design form, build layout, or any UI work in the CRM mockups.
  Trigger on: "nueva página", "nuevo modal", "crear pantalla", "diseñar", "agregar modal",
  "página de", "modal de", "formulario", "dashboard", "kanban", "table", "detail".
---

# CRM Extrucol UI Builder

Builds complete HTML pages and modals using the CRM Extrucol design system: tokens, components, icons, sidebar, and topbar.

## Quick Reference

### Page Skeleton
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>CRM Extrucol · Rol · Page Name</title>
<link rel="stylesheet" href="../shared/tokens.css">
<link rel="stylesheet" href="../shared/components.css">
<style>
  /* Page-specific styles here */
</style>
</head>
<body>
<div style="display: flex; justify-content: center; background: #F4F4F5; padding: 40px;">
  <div style="width: 1440px;">
    <div class="app-shell" id="shell"></div>
  </div>
</div>
<script src="../shared/components.js"></script>
<script>
document.getElementById('shell').innerHTML = `
  ${renderSidebar('active-item-id', 'role-name')}
  <main class="main-area">
    ${renderTopbar({ title: 'Page Title', actions: '...' })}
    <div class="content">
      <!-- Page content -->
    </div>
  </main>
`;
// Page-specific JS
</script>
</body>
</html>
```

### Role Map
| Role | Sidebar param | Directory |
|------|--------------|-----------|
| Ejecutivo Comercial | `ejecutivo` | `ejecutivo/` |
| Coordinador | `coordinador` | `coordinador/` |
| Director | `director` | `director/` |
| Administrador | `admin` | `admin/` |

### Design Tokens (key values)
```
Primary:      #24388C   (--primary)
Accent:       #F39610   (--accent)
Success:      #1A8754   (--success)
Error:        #C0392B   (--error)
Surface:      #FFFFFF   (--surface)
Page BG:      #F7F7F7   (--page-bg)
Font:         Roboto (Google Fonts via tokens.css)
```

### Radii
`--radius-sm: 6px` · `--radius-md: 8px` · `--radius-lg: 12px` · `--radius-full: 9999px`

### Icon Usage
Access via `Icons` object (preloaded in components.js):
```
home, users, briefcase, clipboard, folder, chartBar, user, logout,
bell, search, filter, plus, pencil, trash, dots, close, chevronRight,
chevronDown, calendar, check, xCircle, arrowRight, download, clock,
building, coin, trophy, settings, clipboardCheck, flag, sparkles,
trendingUp, trendingDown, funnel, view, arrowsUpDown, currency,
chartPie, shieldCheck, adjustments, upload, database, globe, tag,
lock, gps, fire, inbox
```
Use: `${Icons.iconName}` in template strings.

---

## Page Layout Patterns

### Standard Page with Topbar
```html
<div class="content">
  <div class="page-head">
    <div class="page-head__title-group">
      <h1 class="page-head__title">Page Title</h1>
      <p class="page-head__subtitle">Optional subtitle</p>
    </div>
    <div class="page-head__actions">
      <button class="btn btn--primary">${Icons.plus} Nueva acción</button>
    </div>
  </div>
  <!-- Rest of content -->
</div>
```

### Stat Cards Row
```html
<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
  <div class="stat-card">
    <div class="stat-card__icon">${Icons.briefcase}</div>
    <div class="stat-card__label">Label</div>
    <div class="stat-card__value">42</div>
    <div class="stat-card__subtext">+2 this week</div>
  </div>
  <!-- repeat -->
</div>
```

### Kanban Board
```html
<div class="kanban kanban--4">
  <div class="kanban-col">
    <div class="kanban-col__header">
      <div class="kanban-col__dot" style="background: #3B82F6;"></div>
      <div class="kanban-col__label">Nuevo</div>
      <div class="kanban-col__count">8</div>
    </div>
    <div class="kanban-col__line" style="background: #3B82F6;"></div>
    <div class="kanban-col__list">
      <!-- kanban-card items -->
    </div>
  </div>
</div>
```

### Card Component
```html
<div class="card">
  <div class="card__header">
    <div class="card__title">Card Title</div>
    <button class="btn btn--ghost btn--sm">${Icons.plus} Add</button>
  </div>
  <div class="card__body">
    <!-- Card content -->
  </div>
  <div class="card__footer">
    <button class="btn btn--secondary">Cancelar</button>
    <button class="btn btn--primary">Guardar</button>
  </div>
</div>
```

### Table
```html
<div class="table-wrapper">
  <table class="table">
    <thead>
      <tr>
        <th>Columna 1</th>
        <th>Columna 2</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data</td>
        <td>Data</td>
        <td><button class="table__action">${Icons.pencil}</button></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabs
```html
<div class="tabs">
  <div class="tab is-active">Tab 1</div>
  <div class="tab">Tab 2 <span class="tab__count">3</span></div>
</div>
```

### Badges
```html
<span class="badge badge--prospecto"><span class="dot"></span>Prospecto</span>
<span class="badge badge--calificacion"><span class="dot"></span>Calificación</span>
<span class="badge badge--propuesta"><span class="dot"></span>Propuesta</span>
<span class="badge badge--negociacion"><span class="dot"></span>Negociación</span>
<span class="badge badge--ganada"><span class="dot"></span>Ganada</span>
<span class="badge badge--perdida"><span class="dot"></span>Perdida</span>
<span class="badge badge--info">Info</span>
<span class="badge badge--accent">Accent</span>
```

### Alert
```html
<div class="alert alert--info">${Icons.sparkles}<div>Message here</div></div>
<div class="alert alert--success">${Icons.check}<div>Success message</div></div>
<div class="alert alert--error">${Icons.warning}<div>Error message</div></div>
```

### Form Field Pattern
```html
<div class="form-field">
  <label class="form-field__label">Label <span class="req">*</span></label>
  <input class="input" placeholder="Placeholder" />
  <div class="form-field__hint">Hint text</div>
</div>

<div class="form-row">
  <div class="form-field">
    <label class="form-field__label">Field 1</label>
    <input class="input" />
  </div>
  <div class="form-field">
    <label class="form-field__label">Field 2</label>
    <select class="select">
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
  </div>
</div>
```

### Avatar with Color Variants
```html
<div class="avatar avatar--color-1">JP</div>  <!-- blue #24388C -->
<div class="avatar avatar--color-2">MS</div>  <!-- purple #7C3AED -->
<div class="avatar avatar--color-3">LR</div>  <!-- green #1A8754 -->
<div class="avatar avatar--color-4">CO</div>  <!-- orange #C2410C -->
<div class="avatar avatar--color-5">AB</div>  <!-- sky #0369A1 -->
<div class="avatar avatar--color-6">DR</div>  <!-- amber #B45309 -->
<div class="avatar avatar--accent">EJ</div>   <!-- accent #F39610 -->

<!-- Sizes -->
<div class="avatar avatar--xs">S</div>
<div class="avatar avatar--sm">M</div>
<div class="avatar">O</div>       <!-- default 40px -->
<div class="avatar avatar--lg">L</div>
```

### Progress Bar
```html
<div class="progress">
  <div class="progress__bar">
    <div class="progress__fill" style="width: 72%;"></div>
  </div>
  <span style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">72%</span>
</div>
```

### Timeline
```html
<div class="timeline">
  <div class="timeline__item">
    <div class="timeline__dot timeline__dot--success"></div>
    <div class="timeline__header">
      <div class="timeline__title">Actividad completada</div>
      <span class="timeline__date">Hoy, 10:30 AM</span>
    </div>
    <div class="timeline__desc">Descripción de la actividad.</div>
  </div>
</div>
```

### Activity Item
```html
<div class="activity-item">
  <div class="activity-item__dot activity-item__dot--blue"></div>
  <div class="activity-item__body">
    <div class="activity-item__title">Título <span class="badge badge--info">Nuevo</span></div>
    <div class="activity-item__desc">Descripción</div>
    <div class="activity-item__meta">
      <span>${Icons.calendar} 22 Abr 2026</span>
      <span>${Icons.user} Juan Pérez</span>
    </div>
  </div>
</div>
```

### Cliente Card
```html
<div class="cliente-card">
  <div class="cliente-card__header">
    <div class="avatar avatar--color-3">EM</div>
    <div>
      <div class="cliente-card__name">Empresa XYZ</div>
      <div class="cliente-card__company">NIT 900.123.456-1</div>
    </div>
  </div>
  <div class="cliente-card__info">
    <div class="cliente-card__info-row">${Icons.phone} (601) 234-5678</div>
    <div class="cliente-card__info-row">${Icons.envelope} contacto@empresa.com</div>
    <div class="cliente-card__info-row">${Icons.mapPin} Bogotá, Cundinamarca</div>
  </div>
  <div class="cliente-card__footer">
    <span>3 oportunidades activas</span>
    <span class="badge badge--ganada">Activo</span>
  </div>
</div>
```

---

## Modal Patterns

### Modal Overlay (base)
```css
.modal-overlay {
  position: absolute; inset: 0;
  background: rgba(26,26,26,0.5);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 60px 24px;
  z-index: 100;
}
.modal-content {
  background: var(--surface);
  border-radius: 12px;
  max-width: 560px; width: 100%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  overflow: hidden;
}
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header__icon {
  width: 40px; height: 40px;
  background: var(--success-bg); color: var(--success);
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  margin-right: 12px;
}
.modal-header__icon--error { background: var(--error-bg); color: var(--error); }
.modal-header__icon--accent { background: var(--accent-bg); color: var(--accent); }
.modal-body { padding: 20px 24px; }
.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border);
  display: flex; justify-content: flex-end; gap: 10px;
  background: var(--page-bg);
}
```

### Modal Header Icon Types
| Type | BG | Color | Use for |
|------|----|----|---------|
| `--success` | `#E8F5EE` | `#1A8754` | Confirmations, conversions |
| `--error` | `#FDECEA` | `#C0392B` | Errors, destructive actions |
| `--accent` | `#FFF4E0` | `#C7770D` | Warnings, attention |

### Confirmation Modal (Success)
```html
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <div style="display: flex; align-items: center;">
        <div class="modal-header__icon">${Icons.trophy}</div>
        <div>
          <div style="font-weight: 700; font-size: 16px;">Título del modal</div>
          <div style="font-size: 12.5px; color: var(--text-muted);">Subtítulo explicativo</div>
        </div>
      </div>
      <button class="topbar__icon-btn">${Icons.close}</button>
    </div>
    <div class="modal-body">
      <!-- Content: form, info, preview -->
    </div>
    <div class="modal-footer">
      <button class="btn btn--secondary">Cancelar</button>
      <button class="btn btn--primary">${Icons.check} Confirmar acción</button>
    </div>
  </div>
</div>
```

### Form Modal (inside modal-body)
```html
<div class="form-field" style="margin-bottom: 12px;">
  <label class="form-field__label">Campo <span class="req">*</span></label>
  <input class="input" placeholder="Placeholder" />
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
  <div class="form-field">
    <label class="form-field__label">Campo 1</label>
    <select class="select"><option>Opción</option></select>
  </div>
  <div class="form-field">
    <label class="form-field__label">Campo 2</label>
    <input class="input" />
  </div>
</div>

<div class="alert alert--info">${Icons.sparkles}<div>Mensaje informativo.</div></div>
```

---

## Common Workflows

### Adding a Modal to a Page
Pages that show modals use `position: relative` on the wrapper:
```html
<div style="height: 900px; position: relative;">
  <div class="app-shell" id="shell"></div>
  <!-- modal-overlay sits here, outside shell -->
</div>
```

### Inline Modal (inside app-shell content)
```html
document.getElementById('shell').innerHTML = `
  ${renderSidebar('leads', 'ejecutivo')}
  <main class="main-area">
    ${renderTopbar({ title: 'Leads', actions: '...' })}
    <div class="content">
      <div class="modal-overlay">
        <div class="modal-content">
          <!-- modal content -->
        </div>
      </div>
    </div>
  </main>
`;
```

### Lead Card (Kanban)
```css
.lead-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px; box-shadow: var(--shadow-sm);
  cursor: grab; transition: all 180ms ease;
  display: flex; flex-direction: column; gap: 8px;
}
.lead-card:hover { border-color: var(--primary); box-shadow: var(--shadow-md); }
.lead-card__origen {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--text-muted);
}
.lead-card__title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.lead-card__empresa { font-size: 11.5px; color: var(--text-muted); }
.lead-card__intereses { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
.lead-card__interes-chip {
  font-size: 10px; font-weight: 600; padding: 2px 7px;
  border-radius: 4px; background: var(--primary-bg); color: var(--primary);
}
.lead-card__footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 8px; border-top: 1px solid var(--border); margin-top: 2px;
}
.lead-card__score {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 11px; font-weight: 700; color: var(--accent);
}
.lead-card__age { font-size: 10.5px; color: var(--text-disabled); }
```

### Detail Header (Detail pages)
```css
.detail-header {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px 24px; margin-bottom: 16px;
}
.detail-header__row {
  display: flex; align-items: flex-start; gap: 16px; justify-content: space-between;
}
.detail-title {
  font-size: 22px; font-weight: 800; color: var(--text-primary);
  letter-spacing: -0.02em; line-height: 1.2;
}
.detail-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.detail-meta {
  display: flex; gap: 24px; margin-top: 16px;
  padding-top: 16px; border-top: 1px solid var(--border); flex-wrap: wrap;
}
.detail-meta__item { display: flex; flex-direction: column; gap: 2px; }
.detail-meta__label {
  font-size: 10.5px; font-weight: 600; color: var(--text-disabled);
  text-transform: uppercase; letter-spacing: 0.06em;
}
.detail-meta__value { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.detail-meta__value--accent { color: var(--accent); font-size: 17px; font-weight: 700; }
```

### Filter Bar
```html
<div class="filter-bar">
  <div class="input-wrapper">
    <span class="icon" style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">${Icons.search}</span>
    <input class="input input--with-icon" placeholder="Buscar..." />
  </div>
  <button class="btn btn--secondary btn--sm">${Icons.filter} Filtros</button>
  <button class="btn btn--secondary btn--sm">${Icons.arrowsUpDown} Ordenar</button>
</div>
```

### Empty State
```html
<div class="empty-state">
  <div class="empty-state__icon">${Icons.inbox}</div>
  <div class="empty-state__title">Sin datos</div>
  <div class="empty-state__desc">Aquí aparecerán los elementos cuando los agregues.</div>
  <button class="btn btn--primary">${Icons.plus} Agregar primero</button>
</div>
```

### Loading
```html
<div class="loading">
  <div class="loading__spinner"></div>
  <span>Cargando...</span>
</div>
```

---

## Director Pages & Modals Reference

### Director File Map
| File | Page | Modals / Actions |
|------|------|------------------|
| `01-dashboard.html` | Dashboard Ejecutivo | "Ver todas" → 02-pipeline, "Ver todos" → 05-equipo, "Detalle" → 04-forecasting |
| `02-pipeline-global.html` | Pipeline global | `toggleFiltros()` inline panel, row links → 07-oportunidad-detalle |
| `03-analisis-sectores.html` | Análisis por sectores | `toggleComparar()` modal with 3-sector comparison table |
| `04-forecasting.html` | Forecasting | `toggleFiltrosForecast()` inline panel, row links → 07-oportunidad-detalle |
| `05-equipo-comercial.html` | Equipo comercial | — (cards are display-only) |
| `06-reportes.html` | Biblioteca de reportes | Report cards: Ver / Descargar actions |
| `07-oportunidad-detalle.html` | Detalle Oportunidad (Pipeline) | Back → 02-pipeline-global |

### Director Sidebar Config
```js
director: {
  user: { name: 'Carlos Muñoz', role: 'Director', initial: 'CM' },
  items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'chartBar', route: '01-dashboard.html' },
    { id: 'pipeline', label: 'Pipeline global', icon: 'funnel', route: '02-pipeline-global.html' },
    { id: 'sectores', label: 'Análisis sectores', icon: 'building', route: '03-analisis-sectores.html' },
    { id: 'forecasting', label: 'Forecasting', icon: 'trendingUp', route: '04-forecasting.html' },
    { id: 'equipo', label: 'Equipo comercial', icon: 'users', route: '05-equipo-comercial.html' },
    { id: 'reportes', label: 'Reportes', icon: 'chartPie', route: '06-reportes.html' },
  ]
}
```

### Director Button → Target Mapping
| Source Page | Button | Target | Type |
|-------------|--------|--------|------|
| `01-dashboard` | "Ver todas" (funnel) | `02-pipeline-global.html` | Link |
| `01-dashboard` | "Ver todos" (ranking) | `05-equipo-comercial.html` | Link |
| `01-dashboard` | "Detalle" (Q2 forecast) | `04-forecasting.html` | Link |
| `02-pipeline` | "Filtros" | Inline filter panel | Toggle |
| `02-pipeline` | Opportunity name (table) | `07-oportunidad-detalle.html` | Link |
| `02-pipeline` | Table eye button | `07-oportunidad-detalle.html` | Link |
| `03-sectores` | "Comparar" | `toggleComparar()` modal | Modal |
| `04-forecasting` | "Filtros" | Inline filter panel | Toggle |
| `04-forecasting` | Table eye button | `07-oportunidad-detalle.html` | Link |

### Director-Specific Components

#### Opportunity Forecast Row (forecasting page)
```html
<div class="opp-forecast-row">
  <!-- cols: oportunidad, ejecutivo, valor, probabilidad, ponderado, cierre -->
  <a href="07-oportunidad-detalle.html"><button class="table__action">${Icons.view}</button></a>
</div>
```

#### Inline Filter Panel Pattern
```html
<div id="filtros-panel" class="card" style="display: none;">
  <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end;">
    <div class="form-field">...</div>
    <button class="btn btn--primary btn--sm">${Icons.check} Aplicar</button>
    <button class="btn btn--secondary btn--sm" onclick="toggleFiltros()">${Icons.close}</button>
  </div>
</div>
```

#### Sector Comparison Modal (inline overlay)
```html
<div id="comparar-modal" class="modal-overlay" style="display: none;" onclick="if(event.target===this)toggleComparar()">
  <div class="modal-content" style="max-width: 900px;">
    <!-- modal header, body with sector chips and comparison table, footer -->
  </div>
</div>
```

### ER-Model Entities for Director
| Entity | Used in |
|--------|---------|
| `CRM_USUARIO` | Dashboard (ranking), Equipo, Pipeline |
| `CRM_OPORTUNIDAD` | Pipeline, Forecasting, Equipo |
| `CRM_ESTADO_OPORTUNIDAD` | Pipeline distribution |
| `CRM_SECTOR` | Análisis sectores |
| `CRM_EMPRESA` | Pipeline, Sectores |
| `CRM_LEAD` | Dashboard funnel |
| `CRM_PROYECTO` | Equipo (from won opps) |
| `CRM_ACTIVIDAD` | Dashboard funnel, Forecast |

---

## File Naming

Pages: `{XX}-{page-slug}.html` in the appropriate role directory.
Modal examples inside pages don't need separate files.

| Role | Path |
|------|------|
| Ejecutivo | `ejecutivo/{XX}-{slug}.html` |
| Coordinador | `coordinador/{XX}-{slug}.html` |
| Director | `director/{XX}-{slug}.html` |
| Admin | `admin/{XX}-{slug}.html` |
| Auth | `auth/{XX}-{slug}.html` |

---

## Steps to Create a New Page

1. Identify role directory and next sequence number
2. Create the HTML file from Page Skeleton
3. Use `renderSidebar('active-id', 'role')` with correct active item ID
4. Use `renderTopbar({ title, breadcrumb, actions })` for the topbar
5. Apply component classes from Quick Reference above
6. Add page-specific CSS in `<style>` block if needed
7. Add JS data and render functions
8. Open in browser to verify

## Steps to Add a Modal

1. Add modal CSS to page `<style>` (use Modal base CSS)
2. Choose modal type: Confirmation, Form, or Conversion
3. Build the modal HTML structure
4. Place `modal-overlay` in correct position (inline or wrapper-relative)
5. Wire close button and action buttons

## Coordinador Pages & Modals Reference

### Coordinador File Map
| File | Page | Modals |
|------|------|--------|
| `01-dashboard.html` | Panel de seguimiento | — |
| `02-variables-sistema.html` | Variables del sistema | `guardarModal()`, `historialModal()` |
| `03-monitoreo-mapa-notif.html` | Monitoreo + Mapa + Log (3 tabs) | — |
| `04-cumplimiento.html` | Reporte de cumplimiento | — |
| `05-estancados.html` | Leads/Opp estancados | `openNotificar()`, `openReasignar()` |
| `06-mapa-actividades.html` | Mapa de actividades GPS | — |
| `07-log-otificaciones.html` | Log de notificaciones | `verDetalleModal()` |
| `07-actividades.html` | Actividades del equipo | — |
| `08-alertas.html` | Alertas activas | `openAccionModal('notificar')`, `openAccionModal('reasignar')` |

### Coordinador Sidebar Config
```js
coordinador: {
  user: { name: 'Diana Ruiz', role: 'Coordinador', initial: 'DR' },
  items: [
    { id: 'dashboard', label: 'Panel seguimiento', icon: 'home', route: '01-dashboard.html' },
    { id: 'alertas', label: 'Alertas activas', icon: 'bell', route: '01-dashboard.html' },
    { id: 'alertas', label: 'Alertas activas', icon: 'bell', route: '08-alertas.html' },
    { id: 'variables', label: 'Variables sistema', icon: 'adjustments', route: '02-variables-sistema.html' },
    { id: 'monitoreo', label: 'Monitoreo ejecutivos', icon: 'view', route: '03-monitoreo-mapa-notif.html' },
    { id: 'estancados', label: 'Leads/Opp estancados', icon: 'clock', route: '05-estancados.html' },
    { id: 'mapa', label: 'Mapa actividades', icon: 'gps', route: '06-mapa-actividades.html' },
    { id: 'notificaciones', label: 'Log notificaciones', icon: 'inbox', route: '07-log-otificaciones.html' },
    { id: 'cumplimiento', label: 'Cumplimiento', icon: 'clipboardCheck', route: '04-cumplimiento.html' },
  ]
}
```

### Coordinator-Specific Components

#### Stagnant Record Row (estancados page)
```html
<div class="estancado-row">
  <div>
    <span class="badge ${r.type === 'LEAD' ? 'badge--info' : 'badge--accent'}">${r.type}</span>
    ${r.valor ? `<div style="font-weight:700;color:var(--accent)">${r.valor}</div>` : ''}
  </div>
  <div>
    <div style="font-weight:600">${r.title}</div>
    <div style="font-size:11.5px;color:var(--text-muted)">${r.empresa}</div>
  </div>
  <div style="display:flex;align-items:center;gap:8px;">
    <div class="avatar avatar--xs avatar--color-${r.color}">${ejec}</div>
    <span>${r.ejec}</span>
  </div>
  <div><span class="badge badge--${r.badge}"><span class="dot"></span>${r.estado}</span></div>
  <div>
    <span class="dias-badge dias-badge--${r.priority}">
      ${Icons.clock} ${r.dias} días
    </span>
    <div style="font-size:10.5px;color:var(--text-muted)">Umbral: ${r.umbral}d</div>
  </div>
  <div style="display:flex;gap:4px;justify-content:flex-end;">
    <button class="btn btn--ghost btn--sm" onclick="openNotificar(r)">${Icons.bell}</button>
    <button class="btn btn--ghost btn--sm" onclick="openReasignar(r)">${Icons.users}</button>
    <button class="btn btn--ghost btn--sm">${Icons.chevronRight}</button>
  </div>
</div>
```

#### Modal Pattern for Coordinador (position: absolute overlay)
```html
<!-- Wrapper needs position:relative and height -->
<div style="height: 900px; position: relative;">
  <div class="app-shell" id="shell"></div>
  <div id="modal-root"></div>
</div>
```
```js
window.modalRoot = document.getElementById('modal-root');
function openMiModal() {
  modalRoot.innerHTML = `<div class="modal-overlay">...</div>`;
}
function closeModal() {
  modalRoot.innerHTML = '';
}
```

#### Compliance Mini Circle
```css
.compliance-mini {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px; position: relative;
}
.compliance-mini::before { content: ''; position: absolute; inset: 3px; background: #fff; border-radius: 50%; }
.compliance-mini > span { position: relative; z-index: 1; }
/* Usage: background: conic-gradient(var(--success) 85%, var(--border) 85%); */
```

#### Map Pin (GPS)
```css
.map-pin {
  position: absolute; width: 26px; height: 26px;
  background: var(--primary); border: 3px solid #fff;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 11px; font-weight: 700;
}
.map-pin--accent { background: var(--accent); }
.map-pin--success { background: var(--green-bright); }
.map-pin--error { background: var(--error); }
```

#### Notification Item
```html
<div class="notif-item">
  <div class="notif-icon notif-icon--${n.tipo}">${Icons[n.icon]}</div>
  <div>
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-weight:600;font-size:13.5px;">${n.title}</span>
      <span class="badge badge--${n.canal==='email'?'info':'accent'}">${n.via}</span>
    </div>
    <div style="font-size:12.5px;color:var(--text-muted)">${n.subtitle}</div>
  </div>
  <button class="btn btn--ghost btn--sm" onclick="verDetalleModal(n)">${Icons.view}</button>
</div>
```

#### Variables Group (sistema page)
```html
<div class="variables-group">
  <div class="variables-group__header">
    <div class="variables-group__icon variables-group__icon--${g.iconClass}">${Icons[g.icon]}</div>
    <div style="flex:1;">
      <div style="font-weight:700;font-size:14.5px">${g.title}</div>
      <div style="font-size:12px;color:var(--text-muted)">${g.desc}</div>
    </div>
    <span class="badge badge--neutral">${g.vars.length} variables</span>
  </div>
  <!-- variable-row items -->
</div>
```

### ER-Model Entities for Coordinador
| Entity | Used in |
|--------|---------|
| `CRM_USUARIO` | Monitoreo, cumplimiento, estancados |
| `CRM_LEAD` | Estancados, alertas |
| `CRM_OPORTUNIDAD` | Estancados, alertas |
| `CRM_ACTIVIDAD` | Mapa actividades, log notificaciones |
| `CRM_CONFIGURACION_SISTEMA` | Variables del sistema |
| `CRM_UBICACION` | Mapa GPS |

### Button → Modal Mapping (Coordinador)
| Source Page | Button | Modal | Data |
|-------------|--------|-------|------|
| `01-dashboard` | "Ver todas las alertas" | Link to 05-estancados | — |
| `02-variables` | "Guardar cambios" | `guardarModal()` | changed vars |
| `02-variables` | History clock icon | `historialModal(key)` | var name |
| `05-estancados` | Bell icon | `openNotificar(registro)` | lead/opp row |
| `05-estancados` | Users icon | `openReasignar(registro)` | lead/opp row |
| `07-log-notif` | Eye icon | `verDetalleModal(notif)` | notification obj |
| `07-log-notif` | "Reenviar" (in modal) | Same `verDetalleModal` | notif + reenviar |

## Ejecutivo Pages & Modals Reference

### Ejecutivo File Map
| File | Page | Modals / Actions |
|------|------|------------------|
| `01-dashboard.html` | Dashboard personal | "Ver todas" → 02-oportunidades, "Ver historial" → 07-actividades, "Registrar actividad" → `registrarActividadModal()` |
| `02-oportunidades-kanban.html` | Pipeline Kanban | `toggleFiltros()` inline panel, cards → 04-oportunidad-detalle |
| `03-leads-kanban.html` | Leads Kanban | `toggleFiltros()` inline panel, cards → 10-lead-detalle |
| `04-oportunidad-detalle.html` | Detalle Oportunidad | `cerrarGanadaModal()`, `cerrarPerdidaModal()`, `editarOportunidadModal()`, `avanzarEstadoModal()`, `agregarProductoModal()`, `registrarActividadModal()` |
| `05-oportunidad-form.html` | Nueva Oportunidad | Cancelar → 02-oportunidades-kanban, "Agregar producto" → `buscarProductoModal()` |
| `06-clientes.html` | Grid de Clientes | "Nuevo cliente" → `nuevoClienteModal()`, cards → 14-cliente-detalle |
| `07-actividades.html` | Lista de Actividades | "Registrar" → 13-actividad-detalle, filas → 18-actividad-detalle |
| `08-proyectos.html` | Lista de Proyectos | Cards → 15-proyecto-detalle |
| `09-lead-form.html` | Nuevo Lead | Cancelar → 03-leads-kanban |
| `10-lead-detalle.html` | Detalle Lead + Conversión | `editarLeadModal()`, `descalificarLeadModal()`, `trasladarDistribuidorModal()`, "Convertir" → `conversionModal()`, timeline → 18-actividad-detalle |
| `11-cierre-oportunidad-ganada.html` | Cierre Ganada (standalone) | Standalone preview modal page |
| `12-mis-metas.html` | Metas Personales | "Historial" → 07-actividades, "Editar metas" → `editarMetaModal()` |
| `13-actividad-detalle.html` | Registrar Actividad (Formulario) | Cancelar → 07-actividades |
| `14-cliente-detalle.html` | Detalle Cliente | `editarClienteModal()`, `nuevoClienteModal()`, `agregarContactoModal()`, `contactOptionsModal()` |
| `15-proyecto-detalle.html` | Detalle Proyecto | `editarProyectoModal()`, breadcrumb → 08-proyectos, oportunidad link → 04-oportunidad-detalle |
| `16-lead-conversion.html` | Lead Conversion (standalone) | Standalone preview page |
| `17-cierre-oportunidad-perdida.html` | Cierre Perdida (standalone) | Standalone preview modal page |
| `18-actividad-detalle.html` | Detalle Actividad | Breadcrumb → 07-actividades, oportunidad link → 04-oportunidad-detalle, "Editar" button |

### Ejecutivo Sidebar Config
```js
ejecutivo: {
  user: { name: 'Juan Pérez', role: 'Ejecutivo', initial: 'JP' },
  items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '01-dashboard.html' },
    { id: 'oportunidades', label: 'Oportunidades', icon: 'briefcase', route: '02-oportunidades-kanban.html' },
    { id: 'leads', label: 'Leads', icon: 'funnel', route: '03-leads-kanban.html' },
    { id: 'clientes', label: 'Clientes', icon: 'building', route: '06-clientes.html' },
    { id: 'actividades', label: 'Actividades', icon: 'clipboard', route: '07-actividades.html' },
    { id: 'proyectos', label: 'Proyectos', icon: 'folder', route: '08-proyectos.html' },
    { id: 'metas', label: 'Mis metas', icon: 'flag', route: '12-mis-metas.html' },
  ]
}
```

### Ejecutivo Button → Target Mapping
| Source Page | Button | Target | Type |
|-------------|--------|--------|------|
| `01-dashboard` | "Ver todas" (pipeline) | `02-oportunidades-kanban.html` | Link |
| `01-dashboard` | "Ver historial" | `07-actividades.html` | Link |
| `01-dashboard` | "Registrar actividad" | `registrarActividadModal()` | Inline modal |
| `02-kanban` | "Filtros" | `toggleFiltros()` inline panel | Toggle |
| `02-kanban` | Card click | `04-oportunidad-detalle.html` | Link |
| `03-leads` | "Filtros" | `toggleFiltros()` inline panel | Toggle |
| `03-leads` | Card click | `10-lead-detalle.html` | Link |
| `04-detalle` | "Editar" | `editarOportunidadModal()` | Inline modal |
| `04-detalle` | "Actividad" items | `18-actividad-detalle.html` | Link |
| `04-detalle` | "Avanzar estado" | `avanzarEstadoModal()` | Inline modal |
| `04-detalle` | "Agregar" (productos) | `agregarProductoModal()` | Inline modal |
| `04-detalle` | "Marcar como Ganada" | `cerrarGanadaModal()` | Inline modal + confetti |
| `04-detalle` | "Marcar como Perdida" | `cerrarPerdidaModal()` | Inline modal |
| `04-detalle` | "Registrar actividad" | `registrarActividadModal()` | Inline modal |
| `04-detalle` | Breadcrumb → kanban | `02-oportunidades-kanban.html` | Link |
| `04-detalle` | "Ver todas" actividades | `07-actividades.html` | Link |
| `05-form` | "Cancelar" | `02-oportunidades-kanban.html` | Link |
| `05-form` | "Agregar producto" | `buscarProductoModal()` | Inline modal |
| `06-clientes` | "Nuevo cliente" | `nuevoClienteModal()` | Inline modal |
| `06-clientes` | Card click | `14-cliente-detalle.html` | Link |
| `07-actividades` | Activity rows | `18-actividad-detalle.html` | Link |
| `09-lead-form` | "Cancelar" | `03-leads-kanban.html` | Link |
| `10-lead` | "Editar" | `editarLeadModal()` | Inline modal |
| `10-lead` | "Descalificar" | `descalificarLeadModal()` | Inline modal |
| `10-lead` | "Convertir a opp" | `conversionModal()` | Inline modal |
| `10-lead` | "Trasladar distribuidor" | `trasladarDistribuidorModal()` | Inline modal |
| `10-lead` | Contact dots | `contactOptionsModal()` | Inline modal |
| `10-lead` | Timeline activity items | `18-actividad-detalle.html` | Link |
| `12-metas` | "Historial" | `07-actividades.html` | Link |
| `12-metas` | "Editar metas" | `editarMetaModal()` | Inline modal |
| `13-actividad` | "Cancelar" | `07-actividades.html` | Link |
| `14-cliente` | "Editar" | `editarClienteModal()` | Inline modal |
| `14-cliente` | "Agregar contacto" | `agregarContactoModal()` | Inline modal |
| `14-cliente` | Contact dots | `contactOptionsModal()` | Inline modal |
| `14-cliente` | "Nueva oportunidad" | `05-oportunidad-form.html` | Link |
| `15-proyecto` | "Editar" | `editarProyectoModal()` | Inline modal |
| `15-proyecto` | Breadcrumb | `08-proyectos.html` | Link |
| `15-proyecto` | Opp link | `04-oportunidad-detalle.html` | Link |

### Inline Modal Helper Pattern (used across all Ejecutivo pages)
```js
window.modalRoot = document.getElementById('shell');
function openModal(html) { modalRoot.innerHTML += html; }
function closeModal() {
  const overlays = document.querySelectorAll('.modal-overlay');
  if (overlays.length > 0) overlays[overlays.length - 1].remove();
}
```

### Filter Panel Toggle Pattern (kanban pages)
```js
function toggleFiltros() {
  const panel = document.getElementById('filtrosPanel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}
```

### ER-Model Entities for Ejecutivo
| Entity | Used in |
|--------|---------|
| `CRM_OPORTUNIDAD` | Dashboard, Kanban, Detalle, Form |
| `CRM_LEAD` | Dashboard, Kanban, Detalle, Form |
| `CRM_EMPRESA` | Clientes, Detalle opp |
| `CRM_CONTACTO` | Cliente detalle |
| `CRM_ACTIVIDAD` | Dashboard, Detalle opp, Lista |
| `CRM_PROYECTO` | Lista proyectos, Detalle proyecto |
| `CRM_META` | Mis metas |

---

## State Colors (Kanban / Badges)
| State | Badge Class | Dot/BG |
|-------|-------------|--------|
| Nuevo | `prospecto` | `#EEF1FA` / `#24388C` |
| Contactado | `propuesta` | `#F3E8FF` / `#7C3AED` |
| Interesado | `calificacion` | `#FFF4E0` / `#C7770D` |
| Negociación | `negociacion` | `#FEF9C3` / `#A16207` |
| Ganada | `ganada` | `#E8F5EE` / `#1A8754` |
| Perdida | `perdida` | `#FDECEA` / `#C0392B` |
