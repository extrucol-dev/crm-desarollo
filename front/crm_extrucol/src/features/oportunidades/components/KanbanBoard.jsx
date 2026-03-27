import KanbanCard from './KanbanCard'
import { ESTADOS } from '../hooks/useOportunidades'

const ESTADO_CONFIG = {
  PROSPECTO:    { label: 'Prospecto',    color: '#3B82F6' },
  CALIFICACION: { label: 'Calificación', color: '#F97316' },
  PROPUESTA:    { label: 'Propuesta',    color: '#A855F7' },
  NEGOCIACION:  { label: 'Negociación',  color: '#EAB308' },
  GANADA:       { label: 'Ganada',       color: '#22C55E' },
  PERDIDA:      { label: 'Perdida',      color: '#EF4444' },
}

function KanbanColumn({ estado, oportunidades }) {
  const config = ESTADO_CONFIG[estado]
  return (
    <div className="flex flex-col min-w-[220px] max-w-[220px]">
      {/* Header de columna */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: config.color }} />
          <span className="text-[12.5px] font-bold text-[#4A4A4A]">{config.label}</span>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B]">
          {oportunidades.length}
        </span>
      </div>

      {/* Tarjetas */}
      <div className="flex flex-col gap-2.5 flex-1">
        {oportunidades.length === 0 ? (
          <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-4 text-center">
            <p className="text-[11.5px] text-[#ABABAB]">Sin oportunidades</p>
          </div>
        ) : (
          oportunidades.map(op => <KanbanCard key={op.id} oportunidad={op} />)
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ porEstado }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-1">
      {ESTADOS.map(estado => (
        <KanbanColumn
          key={estado}
          estado={estado}
          oportunidades={porEstado[estado] ?? []}
        />
      ))}
    </div>
  )
}
