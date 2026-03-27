import { useNavigate } from 'react-router-dom'
import { Badge } from '../../../shared/components/FormField'

const TIPO_VARIANT = {
  COTIZACION:     'blue',
  VENTA:          'orange',
  ACOMPANAMIENTO: 'purple',
  PROYECTO:       'green',
}

const TIPO_LABEL = {
  COTIZACION:     'Cotización',
  VENTA:          'Venta',
  ACOMPANAMIENTO: 'Acompañamiento',
  PROYECTO:       'Proyecto',
}

const formatCOP = (n) => {
  if (!n) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(n)
}

const formatDate = (iso) => {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

export default function KanbanCard({ oportunidad }) {
  const navigate = useNavigate()
  const op = oportunidad

  return (
    <div
      onClick={() => navigate(`/oportunidades/${op.id}`)}
      className="bg-white border border-[#F0F0F0] rounded-xl p-3.5 cursor-pointer
        hover:border-[#24388C] hover:shadow-md transition-all duration-150 group"
    >
      {/* Tipo */}
      <div className="mb-2">
        <Badge variant={TIPO_VARIANT[op.tipo] ?? 'gray'}>
          {TIPO_LABEL[op.tipo] ?? op.tipo}
        </Badge>
      </div>

      {/* Nombre */}
      <div className="text-[13px] font-bold text-[#1A1A1A] leading-snug mb-1.5 group-hover:text-[#24388C] transition-colors">
        {op.nombre}
      </div>

      {/* Cliente */}
      {op.cliente?.nombre && (
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B6B6B] mb-3">
          <svg className="w-3 h-3 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="truncate">{op.cliente.nombre}</span>
        </div>
      )}

      {/* Footer: valor + fecha */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
        <span className="text-[12.5px] font-bold text-[#24388C]">
          {formatCOP(op.valor_estimado)}
        </span>
        {op.fecha_cierre && (
          <span className="text-[11px] text-[#ABABAB] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            {formatDate(op.fecha_cierre)}
          </span>
        )}
      </div>
    </div>
  )
}
