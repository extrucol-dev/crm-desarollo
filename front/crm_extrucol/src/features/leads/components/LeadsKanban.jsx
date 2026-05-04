import { useState } from 'react'
import { DndContext, DragOverlay, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import LeadCard, { LeadCardOverlay } from './LeadCard'
import { ESTADOS_ACTIVOS, ESTADO_CONFIG } from '../hooks/useLeads'

// ── Columna droppable ─────────────────────────────────────────
function LeadColumn({ estado, leads, isOver }) {
  const { setNodeRef } = useDroppable({ id: estado })
  const c = ESTADO_CONFIG[estado]

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
          <span className="text-[12px] font-bold text-[#4A4A4A] truncate">{c.label}</span>
        </div>
        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B] flex-shrink-0 ml-1">
          {leads.length}
        </span>
      </div>

      {/* Línea de color */}
      <div className="h-0.5 rounded-full mb-2.5 opacity-40" style={{ background: c.dot }} />

      {/* Zona droppable */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 flex-1 min-h-[80px] rounded-lg transition-all duration-150 p-1 -m-1 ${
          isOver ? 'bg-[#EEF1FA] ring-2 ring-[#24388C]/30' : ''
        }`}
      >
        {leads.length === 0 ? (
          <div className={`border border-dashed rounded-lg py-6 text-center transition-all ${
            isOver ? 'border-[#24388C] bg-[#EEF1FA]' : 'border-[#E5E5E5]'
          }`}>
            <p className={`text-[11.5px] ${isOver ? 'text-[#24388C] font-semibold' : 'text-[#ABABAB]'}`}>
              {isOver ? 'Soltar aquí' : 'Sin leads'}
            </p>
          </div>
        ) : (
          leads.map(l => <LeadCard key={l.id} lead={l} esCerrada={false} />)
        )}
      </div>
    </div>
  )
}

// ── Vista móvil — tabs, sin DnD ───────────────────────────────
function KanbanTabs({ porEstado }) {
  const [activo, setActivo] = useState('NUEVO')
  const cfg = ESTADO_CONFIG[activo]

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {ESTADOS_ACTIVOS.map(e => {
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
              <span className={`text-[10.5px] font-bold px-1.5 rounded-full ${
                sel ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#6B6B6B]'
              }`}>
                {cnt}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex flex-col gap-2">
        {(porEstado[activo] ?? []).length === 0 ? (
          <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl py-10 text-center">
            <p className="text-[13px] font-semibold text-[#4A4A4A] mb-0.5">Sin leads</p>
            <p className="text-[12px] text-[#ABABAB]">en {cfg.label}</p>
          </div>
        ) : (
          (porEstado[activo] ?? []).map(l => (
            <LeadCard key={l.id} lead={l} esCerrada={false} />
          ))
        )}
      </div>
    </div>
  )
}

// ── Vista desktop — columnas con DnD ─────────────────────────
function KanbanDesktop({ porEstado, onMover }) {
  const [activeLead, setActiveLead]       = useState(null)
  const [overEstado, setOverEstado]       = useState(null)
  const [moviendo, setMoviendo]           = useState(false)
  const [mostrarConvertidos, setMostrarConvertidos] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart  = ({ active }) => setActiveLead(active.data.current.lead)
  const handleDragOver   = ({ over })  => setOverEstado(over?.id ?? null)
  const handleDragCancel = ()          => { setActiveLead(null); setOverEstado(null) }

  const handleDragEnd = async ({ active, over }) => {
    setActiveLead(null); setOverEstado(null)
    if (!over || !active) return
    const estadoDestino = over.id
    const lead = active.data.current.lead
    if (estadoDestino === lead.estado) return
    if (estadoDestino === 'CONVERTIDO') return // conversión solo desde el detalle

    setMoviendo(true)
    try { await onMover(lead.id, estadoDestino) }
    finally { setMoviendo(false) }
  }

  const totalConvertidos = (porEstado['CONVERTIDO'] ?? []).length

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
          <LeadColumn
            key={estado}
            estado={estado}
            leads={porEstado[estado] ?? []}
            isOver={overEstado === estado}
          />
        ))}
      </div>

      {/* Toggle convertidos */}
      <div className="border-t border-[#F0F0F0] pt-3">
        <button
          onClick={() => setMostrarConvertidos(v => !v)}
          className="flex items-center gap-2 text-[12px] font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${mostrarConvertidos ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Convertidos
          <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B]">
            {totalConvertidos}
          </span>
          <span className="text-[10.5px] text-[#1A8754] font-semibold">
            → {totalConvertidos} oportunidade{totalConvertidos !== 1 ? 's' : ''}
          </span>
        </button>

        {mostrarConvertidos && (
          <div className="mt-3">
            {totalConvertidos === 0 ? (
              <p className="text-[12px] text-[#ABABAB]">Sin leads convertidos aún</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {(porEstado['CONVERTIDO'] ?? []).map(l => (
                  <LeadCard key={l.id} lead={l} esCerrada={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay flotante durante drag */}
      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeLead ? (
          <div style={{ width: '100%' }}>
            <LeadCardOverlay lead={activeLead} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function LeadsKanban({ porEstado, onMover }) {
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
