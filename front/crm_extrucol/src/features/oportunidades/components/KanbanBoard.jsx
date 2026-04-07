import { useState } from 'react'
import { DndContext, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import KanbanCard, { KanbanCardOverlay } from './KanbanCard'
import { ESTADOS } from '../hooks/useOportunidades'
import { oportunidadesAPI } from '../services/oportunidadesAPI'

const ESTADOS_ACTIVOS  = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION']
const ESTADOS_CERRADOS = ['GANADA', 'PERDIDA']

const ESTADO_CONFIG = {
  PROSPECTO:    { label: 'Prospecto',    dot: '#3B82F6' },
  CALIFICACION: { label: 'Calificación', dot: '#F97316' },
  PROPUESTA:    { label: 'Propuesta',    dot: '#A855F7' },
  NEGOCIACION:  { label: 'Negociación',  dot: '#EAB308' },
  GANADA:       { label: 'Ganada',       dot: '#22C55E' },
  PERDIDA:      { label: 'Perdida',      dot: '#EF4444' },
}

// ── Columna droppable ─────────────────────────────────────────
function KanbanColumn({ estado, oportunidades, isOver }) {
  const { setNodeRef } = useDroppable({ id: estado })
  const c = ESTADO_CONFIG[estado]
  const cerrada = ESTADOS_CERRADOS.includes(estado)

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
          <span className="text-[12px] font-bold text-[#4A4A4A] truncate">{c.label}</span>
        </div>
        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B] flex-shrink-0 ml-1">
          {oportunidades.length}
        </span>
      </div>

      {/* Línea de color */}
      <div className="h-0.5 rounded-full mb-2.5 opacity-40" style={{ background: c.dot }} />

      {/* Zona droppable */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 flex-1 min-h-[80px] rounded-lg transition-all duration-150 p-1 -m-1 ${
          isOver && !cerrada
            ? 'bg-[#EEF1FA] ring-2 ring-[#24388C]/30'
            : ''
        }`}
      >
        {oportunidades.length === 0 ? (
          <div className={`border border-dashed rounded-lg py-6 text-center transition-all ${
            isOver && !cerrada ? 'border-[#24388C] bg-[#EEF1FA]' : 'border-[#E5E5E5]'
          }`}>
            <p className={`text-[11.5px] ${isOver && !cerrada ? 'text-[#24388C] font-semibold' : 'text-[#ABABAB]'}`}>
              {isOver && !cerrada ? 'Soltar aquí' : 'Sin oportunidades'}
            </p>
          </div>
        ) : (
          oportunidades.map(op => (
            <KanbanCard
              key={op.id}
              oportunidad={op}
              esCerrada={cerrada}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Vista móvil — tabs, sin DnD ───────────────────────────────
function KanbanTabs({ porEstado }) {
  const [activo, setActivo] = useState('PROSPECTO')
  const cfg = ESTADO_CONFIG[activo]
  const cerrada = ESTADOS_CERRADOS.includes(activo)

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {ESTADOS.map(e => {
          const c   = ESTADO_CONFIG[e]
          const cnt = (porEstado[e] ?? []).length
          const sel = e === activo
          return (
            <button key={e} onClick={() => setActivo(e)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                sel ? 'text-white border-transparent' : 'bg-white text-[#6B6B6B] border-[#E5E5E5] hover:border-[#ABABAB]'
              }`}
              style={sel ? { background: c.dot, borderColor: c.dot } : {}}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: sel ? 'rgba(255,255,255,0.7)' : c.dot }} />
              {c.label}
              <span className={`text-[10.5px] font-bold px-1.5 rounded-full ${sel ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#6B6B6B]'}`}>
                {cnt}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex flex-col gap-2">
        {(porEstado[activo] ?? []).length === 0 ? (
          <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl py-10 text-center">
            <p className="text-[13px] font-semibold text-[#4A4A4A] mb-0.5">Sin oportunidades</p>
            <p className="text-[12px] text-[#ABABAB]">en {cfg.label}</p>
          </div>
        ) : (
          (porEstado[activo] ?? []).map(op => (
            <KanbanCard key={op.id} oportunidad={op} esCerrada={cerrada} />
          ))
        )}
      </div>
    </div>
  )
}

// ── Vista desktop — columnas con DnD ─────────────────────────
function KanbanDesktop({ porEstado, onMover }) {
  const [activeOp, setActiveOp]       = useState(null)  // op siendo arrastrada
  const [overEstado, setOverEstado]   = useState(null)  // columna encima
  const [moviendo, setMoviendo]       = useState(false) // petición en vuelo

  // PointerSensor con distancia mínima de 8px — evita que un click normal dispare el drag
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const [mostrarCerradas, setMostrarCerradas] = useState(false)
  const totalCerradas = (porEstado['GANADA'] ?? []).length + (porEstado['PERDIDA'] ?? []).length

  const handleDragStart = ({ active }) => {
    setActiveOp(active.data.current.oportunidad)
  }

  const handleDragOver = ({ over }) => {
    setOverEstado(over?.id ?? null)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveOp(null)
    setOverEstado(null)

    if (!over || !active) return

    const estadoDestino = over.id
    const op = active.data.current.oportunidad

    // No hacer nada si suelta en la misma columna o en columnas cerradas
    if (estadoDestino === op.estado) return
    if (ESTADOS_CERRADOS.includes(estadoDestino)) return

    // Llamar a la API para cambiar el estado
    setMoviendo(true)
    try {
      await onMover(op.id, estadoDestino)
    } finally {
      setMoviendo(false)
    }
  }

  const handleDragCancel = () => {
    setActiveOp(null)
    setOverEstado(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* 4 columnas activas */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3 ${moviendo ? 'pointer-events-none opacity-75' : ''}`}>
        {ESTADOS_ACTIVOS.map(estado => (
          <KanbanColumn
            key={estado}
            estado={estado}
            oportunidades={porEstado[estado] ?? []}
            isOver={overEstado === estado}
          />
        ))}
      </div>

      {/* Toggle cerradas */}
      <div className="border-t border-[#F0F0F0] pt-3">
        <button
          onClick={() => setMostrarCerradas(v => !v)}
          className="flex items-center gap-2 text-[12px] font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${mostrarCerradas ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Cerradas
          <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B]">
            {totalCerradas}
          </span>
          <span className="text-[10.5px] text-[#22C55E] font-semibold">
            {(porEstado['GANADA'] ?? []).length} ganadas
          </span>
          <span className="text-[10.5px] text-[#EF4444] font-semibold">
            {(porEstado['PERDIDA'] ?? []).length} perdidas
          </span>
        </button>

        {mostrarCerradas && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {ESTADOS_CERRADOS.map(estado => (
              <KanbanColumn
                key={estado}
                estado={estado}
                oportunidades={porEstado[estado] ?? []}
                isOver={false} // Las cerradas no aceptan drops
              />
            ))}
          </div>
        )}
      </div>

      {/* Overlay — la tarjeta que "flota" mientras se arrastra */}
      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeOp ? (
          <div style={{ width: '100%' }}>
            <KanbanCardOverlay oportunidad={activeOp} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function KanbanBoard({ porEstado, onMover }) {
  return (
    <>
      {/* Móvil — sin DnD */}
      <div className="block lg:hidden">
        <KanbanTabs porEstado={porEstado} />
      </div>

      {/* Desktop — con DnD */}
      <div className="hidden lg:block">
        <KanbanDesktop porEstado={porEstado} onMover={onMover} />
      </div>
    </>
  )
}