import { useNavigate } from 'react-router-dom'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const SCORE_COLORS = {
  high:   { bg: '#E8F5EE', text: '#1A8754' },
  medium: { bg: '#FFF4E0', text: '#C7770D' },
  low:    { bg: '#EEF1FA', text: '#6366F1' },
  cold:   { bg: '#EEF1FA', text: '#24388C' },
}
const scoreColor = (score) => {
  if (score >= 80) return SCORE_COLORS.high
  if (score >= 60) return SCORE_COLORS.medium
  if (score >= 40) return SCORE_COLORS.low
  return SCORE_COLORS.cold
}

const ageDays = (fechaCreacion) => {
  if (!fechaCreacion) return null
  const diff = Math.floor((Date.now() - new Date(fechaCreacion)) / 86400000)
  if (diff === 0) return 'hoy'
  if (diff === 1) return '1d'
  return `${diff}d`
}

const IconGlobe = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
  </svg>
)

const IconFire = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
  </svg>
)

// Overlay visual que flota mientras la tarjeta está siendo arrastrada
export function LeadCardOverlay({ lead }) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#24388C] shadow-2xl p-3.5 rotate-1 cursor-grabbing w-full">
      <div className="text-[12.5px] font-bold text-[#24388C] leading-snug line-clamp-2 mb-1">
        {lead.nombre}
      </div>
      {lead.empresa && (
        <div className="text-[11px] text-[#6B6B6B] truncate">{lead.empresa}</div>
      )}
    </div>
  )
}

export default function LeadCard({ lead, esCerrada }) {
  const navigate = useNavigate()
  const colors = scoreColor(lead.score ?? 0)
  const age    = ageDays(lead.fecha_creacion)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id:       String(lead.id),
    data:     { lead },
    disabled: esCerrada,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity:   isDragging ? 0.3 : 1,
    transition: isDragging ? 'none' : 'opacity 0.15s',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && navigate(`/leads/${lead.id}`)}
      className={`bg-white rounded-xl border border-[#EBEBEB] p-3.5 flex flex-col gap-2
        select-none group transition-all duration-150
        ${esCerrada
          ? 'cursor-pointer hover:border-[#24388C] hover:shadow-sm'
          : 'cursor-grab active:cursor-grabbing hover:border-[#24388C] hover:shadow-sm'
        }`}
    >
      {/* Origen */}
      {lead.origen && (
        <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-[#ABABAB] pointer-events-none">
          <IconGlobe />
          {lead.origen}
        </div>
      )}

      {/* Título */}
      <div className="text-[12.5px] font-bold text-[#1A1A1A] leading-snug line-clamp-2
        group-hover:text-[#24388C] transition-colors pointer-events-none">
        {lead.nombre}
      </div>

      {/* Empresa */}
      {lead.empresa && (
        <div className="text-[11.5px] text-[#6B6B6B] truncate pointer-events-none">
          {lead.empresa}
        </div>
      )}

      {/* Intereses */}
      {lead.intereses && lead.intereses.length > 0 && (
        <div className="flex flex-wrap gap-1 pointer-events-none">
          {lead.intereses.slice(0, 2).map((interes, idx) => (
            <span key={idx}
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF1FA] text-[#24388C]">
              {interes}
            </span>
          ))}
          {lead.intereses.length > 2 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#6B6B6B]">
              +{lead.intereses.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer: score + age */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0] mt-auto pointer-events-none">
        {lead.score != null ? (
          <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: colors.bg, color: colors.text }}>
            <IconFire />
            {lead.score}%
          </span>
        ) : <span />}
        {age && <span className="text-[10.5px] text-[#ABABAB]">{age}</span>}
      </div>
    </div>
  )
}
