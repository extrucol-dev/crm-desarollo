import { useNavigate } from 'react-router-dom'

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

const isVencida = (iso) => {
  if (!iso) return false
  return new Date(iso) < new Date()
}

export default function KanbanCard({ oportunidad: op }) {
  const navigate = useNavigate()
  const vencida  = isVencida(op.fecha_cierre)
  const tipoColor = TIPO_COLOR[op.tipo] ?? '#6B6B6B'

  return (
    <div
      onClick={() => navigate(`/oportunidades/${op.id}`)}
      className="bg-white rounded-lg border border-[#EBEBEB] px-3 py-2.5 cursor-pointer
        hover:border-[#24388C] hover:shadow-sm transition-all duration-150 group"
    >
      {/* Nombre */}
      <div className="text-[12.5px] font-semibold text-[#1A1A1A] leading-snug mb-2
        group-hover:text-[#24388C] transition-colors line-clamp-2">
        {op.nombre}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Tipo pill — muy compacto */}
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: tipoColor + '18', color: tipoColor }}>
          {TIPO_LABEL[op.tipo] ?? op.tipo}
        </span>

        {/* Valor */}
        {op.valor_estimado && (
          <span className="text-[11.5px] font-bold text-[#24388C] ml-auto">
            {formatCOP(op.valor_estimado)}
          </span>
        )}

        {/* Fecha */}
        {op.fecha_cierre && (
          <span className={`text-[10.5px] font-medium flex-shrink-0 ${vencida ? 'text-[#EF4444]' : 'text-[#ABABAB]'}`}>
            {formatDate(op.fecha_cierre)}
          </span>
        )}
      </div>
    </div>
  )
}