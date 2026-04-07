import { useNavigate } from 'react-router-dom'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const TIPO_COLOR = {
  COTIZACION:     '#3B82F6',
  VENTA:          '#F97316',
  ACOMPANAMIENTO: '#A855F7',
  PROYECTO:       '#1A8754',
}
const TIPO_LABEL = {
  COTIZACION:     'Cot.',
  VENTA:          'Venta',
  ACOMPANAMIENTO: 'Acomp.',
  PROYECTO:       'Proy.',
}

const formatCOP = (n) => {
  if (!n) return null
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}
const formatDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  return `${d.getDate()} ${d.toLocaleString('es', { month: 'short' })}`
}
const isVencida = (iso) => iso && new Date(iso) < new Date()

// Overlay visual que se muestra mientras la tarjeta está siendo arrastrada
export function KanbanCardOverlay({ oportunidad: op }) {
  const tipoColor = TIPO_COLOR[op.tipo] ?? '#6B6B6B'
  return (
    <div className="bg-white rounded-lg border-2 border-[#24388C] shadow-2xl px-3 py-2.5 rotate-1 cursor-grabbing w-full">
      <div className="text-[12.5px] font-semibold text-[#24388C] leading-snug mb-2 line-clamp-2">
        {op.nombre}
      </div>
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: tipoColor + '18', color: tipoColor }}>
          {TIPO_LABEL[op.tipo] ?? op.tipo}
        </span>
        {op.valor_estimado && (
          <span className="text-[11.5px] font-bold text-[#24388C] ml-auto">
            {formatCOP(op.valor_estimado)}
          </span>
        )}
      </div>
    </div>
  )
}

export default function KanbanCard({ oportunidad: op, esCerrada }) {
  const navigate  = useNavigate()
  const vencida   = isVencida(op.fecha_cierre)
  const tipoColor = TIPO_COLOR[op.tipo] ?? '#6B6B6B'

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id:       String(op.id),
    data:     { oportunidad: op },
    disabled: esCerrada, // GANADA y PERDIDA no se pueden arrastrar
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    // La tarjeta original se vuelve transparente mientras se arrastra
    opacity:   isDragging ? 0.3 : 1,
    transition: isDragging ? 'none' : 'opacity 0.15s',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && navigate(`/oportunidades/${op.id}`)}
      className={`bg-white rounded-lg border border-[#EBEBEB] px-3 py-2.5 
        select-none group transition-all duration-150
        ${esCerrada
          ? 'cursor-pointer hover:border-[#24388C] hover:shadow-sm'
          : 'cursor-grab active:cursor-grabbing hover:border-[#24388C] hover:shadow-sm'
        }`}
    >
      {/* Nombre */}
      <div className="text-[12.5px] font-semibold text-[#1A1A1A] leading-snug mb-2
        group-hover:text-[#24388C] transition-colors line-clamp-2 pointer-events-none">
        {op.nombre}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-1.5 pointer-events-none">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
          style={{ background: tipoColor + '18', color: tipoColor }}>
          {TIPO_LABEL[op.tipo] ?? op.tipo}
        </span>
        {op.valor_estimado && (
          <span className="text-[11.5px] font-bold text-[#24388C] ml-auto">
            {formatCOP(op.valor_estimado)}
          </span>
        )}
        {op.fecha_cierre && (
          <span className={`text-[10.5px] font-medium flex-shrink-0 ${vencida ? 'text-[#EF4444]' : 'text-[#ABABAB]'}`}>
            {formatDate(op.fecha_cierre)}
          </span>
        )}
      </div>
    </div>
  )
}