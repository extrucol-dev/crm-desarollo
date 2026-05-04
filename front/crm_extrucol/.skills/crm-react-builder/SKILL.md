---
name: crm-react-builder
description: >-
  CRM Extrucol React feature builder — dual-mode REST+APEX. SIEMPRE USA cuando: crear feature,
  agregar página, construir componente, implementar hook, escribir service API, configurar ruta
  en App.jsx, añadir sidebar, hacer kanban drag-drop, agregar gráfica Chart.js, construir modal,
  migrar mockup HTML a React, crear LeadsKanban, OportunidadesPage, formulario con FormField.
  Proyecto en Desktop/crm-desarollo/front/crm_extrucol/. Trigger on: "nueva feature", "nueva página",
  "componente de", "hook para", "service para", "ruta de", "migrar", "implementar vista",
  "kanban", "drag", "gráfica", "chart", "modal", "formulario React", "nueva pantalla".
---

# CRM Extrucol — React Feature Builder

Proyecto: `C:\Users\PRACT.SISTEMAS\Desktop\crm-desarollo\front\crm_extrucol\`
Stack: React 18 · Vite 5 · React Router v6 · TailwindCSS 3 · Axios · @dnd-kit/core · Chart.js

---

## Anatomía de un Feature

```
src/features/{feature}/
  services/{feature}API.js     ← OBLIGATORIO — dual-mode REST+APEX
  hooks/use{Feature}.js        ← estado + llamada a API
  hooks/use{Feature}Detalle.js ← (si hay vista de detalle individual)
  pages/{Feature}ListaPage.jsx ← una página por pantalla
  pages/{Feature}DetallePage.jsx
  pages/{Feature}FormPage.jsx
  components/                  ← componentes internos — no exportar fuera del feature
```

Regla de dependencias: pages → hooks → services → utils/apexClient.
Features nunca importan de otras features — solo de `shared/`.

---

## Patrón de Service Dual-Mode (copiar y adaptar)

Todos los servicios del proyecto siguen este patrón. Los extras de `callProcess` usan `x01, x02...` posicionalmente.

```js
import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

// ── REST ─────────────────────────────────────────────────────────────────────
const restOps = {
  listar:     ()         => api.get('/api/{entidad}').then(r => r.data),
  buscar:     (id)       => api.get(`/api/{entidad}/${id}`).then(r => r.data),
  crear:      (data)     => api.post('/api/{entidad}', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/api/{entidad}/${id}`, data).then(r => r.data),
}

// ── APEX ─────────────────────────────────────────────────────────────────────
const apexOps = {
  listar:     ()         => callProcess('{ENTIDAD}_LIST').then(unwrapList),
  buscar:     (id)       => callProcess('{ENTIDAD}_GET',    { x01: id }).then(unwrapSingle),
  crear:      (data)     => callProcess('{ENTIDAD}_CREATE', {
    x01: data.campo1,
    x02: data.campo2,
  }).then(unwrapSingle),
  actualizar: (id, data) => callProcess('{ENTIDAD}_UPDATE', {
    x01: id,
    x02: data.campo1,
    x03: data.campo2,
  }).then(unwrapSingle),
}

export const {feature}API = APEX_MODE ? apexOps : restOps
```

**Import desde `shared/services/` (ej. ciudadesAPI.js):** rutas relativas cambian:
```js
import { callProcess } from '../apex/apexClient'
import { APEX_MODE, unwrapList } from './utils'
```

---

## Patrón de Hook (lista con búsqueda)

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
      .catch(() => setError('Error al cargar {feature}.'))
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

**Hook de detalle:**
```js
export function use{Feature}Detalle(id) {
  const [item,    setItem]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    {feature}API.buscar(id)
      .then(setItem)
      .catch(() => setError('No se encontró el registro.'))
      .finally(() => setLoading(false))
  }, [id])

  return { item, loading, error }
}
```

---

## Página Mínima (lista + tabla)

```jsx
import { Link } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import { use{Feature} } from '../hooks/use{Feature}'

export default function {Feature}ListaPage() {
  const { filtrados, loading, error, busqueda, setBusqueda } = use{Feature}()

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">{Feature}</h1>
          <Link to="/{feature}/nuevo"
            className="bg-[#24388C] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1e2f7a] transition-colors">
            + Nuevo
          </Link>
        </div>

        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar..."
          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#24388C]/30" />

        {error   && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-400 text-sm">Cargando...</p>}

        {!loading && (
          <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F7F7] border-b border-[#F0F0F0]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#4A4A4A]">Nombre</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtrados.map(item => (
                  <tr key={item.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{item.nombre}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/{feature}/${item.id}`}
                        className="text-[#24388C] hover:underline text-xs font-medium">Ver detalle</Link>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-400 text-sm">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
```

---

## Kanban con @dnd-kit

```jsx
import { DndContext, DragOverlay, closestCenter, useDroppable, useDraggable } from '@dnd-kit/core'
import { useState } from 'react'

const COLUMNAS = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION']

export function KanbanBoard({ items, onMover }) {
  const [activeId, setActiveId] = useState(null)
  const byEstado = COLUMNAS.reduce((acc, col) => {
    acc[col] = items.filter(i => i.estado === col); return acc
  }, {})

  return (
    <DndContext collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) onMover(active.id, over.id)
        setActiveId(null)
      }}>
      <div className="grid grid-cols-4 gap-4 overflow-x-auto">
        {COLUMNAS.map(col => <KanbanColumna key={col} id={col} items={byEstado[col]} />)}
      </div>
      <DragOverlay>
        {activeId ? <ItemCard item={items.find(i => i.id == activeId)} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumna({ id, items }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef}
      className={`bg-[#F7F7F7] rounded-lg p-3 min-h-[400px] ${isOver ? 'ring-2 ring-[#24388C]/30' : ''}`}>
      <h3 className="text-xs font-semibold text-[#4A4A4A] uppercase mb-3">{id} <span className="text-[#9A9A9A]">{items.length}</span></h3>
      <div className="space-y-2">{items.map(item => <ItemCard key={item.id} item={item} />)}</div>
    </div>
  )
}

function ItemCard({ item, overlay }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id })
  return (
    <div ref={setNodeRef}
      style={transform ? { transform: `translate(${transform.x}px,${transform.y}px)` } : undefined}
      {...listeners} {...attributes}
      className={`bg-white rounded-lg p-3 border border-[#F0F0F0] shadow-sm cursor-grab active:cursor-grabbing
        ${isDragging && !overlay ? 'opacity-40' : ''}`}>
      <p className="text-sm font-medium text-[#1A1A1A] line-clamp-2">{item.nombre}</p>
      <p className="text-xs text-[#4A4A4A] mt-1">{item.cliente}</p>
    </div>
  )
}
```

---

## Chart.js (gráficas)

```jsx
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, ArcElement)

export function PipelineBarChart({ data }) {
  const config = {
    labels: data.map(d => d.estado),
    datasets: [{ label: 'Valor (COP)', data: data.map(d => d.valor),
      backgroundColor: '#24388C', borderRadius: 6 }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,  // permite altura controlada por CSS
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { callback: v => `$${(v/1e6).toFixed(0)}M` } } },
  }
  // SIEMPRE wrappear en div con altura fija
  return <div className="relative h-[280px]"><Bar data={config} options={options} /></div>
}
```

---

## Modal con Portal

```jsx
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
          <button onClick={onClose} className="text-[#9A9A9A] hover:text-[#4A4A4A] text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

// Uso:
// const [open, setOpen] = useState(false)
// <Modal open={open} onClose={() => setOpen(false)} title="Nuevo Lead"
//   footer={<><button onClick={() => setOpen(false)}>Cancelar</button><button>Guardar</button></>}>
//   <form>...</form>
// </Modal>
```

---

## Rutas en App.jsx

```jsx
// Importar al inicio del archivo
import {Feature}ListaPage   from './features/{feature}/pages/{Feature}ListaPage'
import {Feature}DetallePage from './features/{feature}/pages/{Feature}DetallePage'
import {Feature}FormPage    from './features/{feature}/pages/{Feature}FormPage'

// Dentro de <Routes> en App.jsx
<Route path="/{feature}"            element={<ProtectedRoute roles={['EJECUTIVO']}><{Feature}ListaPage /></ProtectedRoute>} />
<Route path="/{feature}/nuevo"      element={<ProtectedRoute roles={['EJECUTIVO']}><{Feature}FormPage /></ProtectedRoute>} />
<Route path="/{feature}/:id"        element={<ProtectedRoute roles={['EJECUTIVO']}><{Feature}DetallePage /></ProtectedRoute>} />
<Route path="/{feature}/:id/editar" element={<ProtectedRoute roles={['EJECUTIVO']}><{Feature}FormPage /></ProtectedRoute>} />
```

---

## Sidebar en AppLayout.jsx

En `NAV_BY_ROL`, añadir la entrada al rol correspondiente:

```js
{ to: '/{feature}', icon: 'NOMBRE_ICONO', label: 'Nombre visible' },
```

**Íconos disponibles** (SVG inline en `AppLayout.jsx → Icon`):
`home`, `users`, `briefcase`, `clipboard`, `folder`, `chart`, `user`, `logout`, `menu`, `close`,
`funnel` (leads), `target` (metas), `trending` (forecast), `document` (reportes),
`warning` (estancadas), `map` (monitoreo), `bell` (alertas)

Para un ícono nuevo, agregar la entrada `<path .../>` en el objeto `icons` dentro del componente `Icon`.

---

## Colores de estado (Badge)

| Estado | Clases Tailwind |
|--------|----------------|
| Lead Nuevo | `bg-blue-100 text-blue-700` |
| Lead Contactado | `bg-yellow-100 text-yellow-700` |
| Lead Calificado | `bg-green-100 text-green-700` |
| Lead Descartado | `bg-gray-100 text-gray-500` |
| Opp Prospecto | `bg-blue-100 text-blue-700` |
| Opp Propuesta | `bg-purple-100 text-purple-700` |
| Opp Negociación | `bg-orange-100 text-orange-700` |
| Opp Ganada | `bg-green-100 text-green-700` |
| Opp Perdida | `bg-red-100 text-red-700` |

---

## Colores y tokens (Tailwind)

| Token | Valor | Uso |
|-------|-------|-----|
| Azul primario | `#24388C` | Botones, links, sidebar |
| Naranja accent | `#F39610` | Destacados, badges activos |
| Fondo app | `#F7F7F7` | Body |
| Cards | `bg-white border border-[#F0F0F0]` | Tarjetas y tablas |
| Texto principal | `text-[#1A1A1A]` | Títulos y valores |
| Texto secundario | `text-[#4A4A4A]` | Labels |
| Texto muted | `text-[#9A9A9A]` | Placeholders, metadatos |

---

## Mapa de pantallas pendientes (mockup → feature → página)

| Mockup | Feature | Página |
|--------|---------|--------|
| `ejecutivo/03-leads-kanban.html` | `leads` | `LeadsKanbanPage` |
| `ejecutivo/09-lead-form.html` | `leads` | `LeadFormPage` |
| `ejecutivo/10-lead-detalle.html` | `leads` | `LeadDetallePage` |
| `ejecutivo/16-lead-conversion.html` | `leads` | `LeadConversionPage` |
| `ejecutivo/12-mis-metas.html` | `metas` | `MisMetasPage` |
| `coordinador/01-dashboard.html` | `dashboard` | `DashboardCoordinadorPage` |
| `coordinador/03-monitoreo-mapa-notif.html` | `monitoreo` | `MonitoreoMapaPage` |
| `coordinador/04-cumplimiento.html` | `metas` | `CumplimientoPage` |
| `coordinador/05-ejecutivo-perfil.html` | `equipo` | `EjecutivoPerfilPage` |
| `coordinador/05-estancados.html` | `oportunidades` | `OportunidadesEstancadasPage` |
| `coordinador/06-mapa-actividades.html` | `monitoreo` | `MapaActividadesPage` |
| `coordinador/07-log-otificaciones.html` | `alertas` | `LogNotificacionesPage` |
| `coordinador/08-alertas.html` | `alertas` | `AlertasCenterPage` |
| `director/03-analisis-sectores.html` | `analisis` | `AnalisisSectoresPage` |
| `director/04-forecasting.html` | `analisis` | `ForecastingPage` |
| `director/05-ejecutivo-perfil.html` | `equipo` | `EjecutivoPerfilPage` |
| `director/05-equipo-comercial.html` | `equipo` | `EquipoComercialPage` |
| `director/06-reportes.html` | `reportes` | `ReportesPage` |

Mockups en: `C:\Users\PRACT.SISTEMAS\Downloads\crm-mockups-open\crm-mockups-open\`
