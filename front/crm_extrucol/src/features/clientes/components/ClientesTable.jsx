import { useNavigate } from 'react-router-dom'
import { Badge } from '../../../shared/components/FormField'

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1', '#B45309']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function IconLocation() {
  return (
    <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}
function IconPhone() {
  return (
    <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}
function IconEmail() {
  return (
    <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}
function IconChevron() {
  return (
    <svg className="w-4 h-4 text-[#ABABAB] group-hover:text-[#24388C] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

export default function ClientesTable({ clientes }) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
      {clientes.map(c => (
        <div
          key={c.id}
          onClick={() => navigate(`/clientes/${c.id}`)}
          className="border border-[#F0F0F0] rounded-xl p-4 cursor-pointer
            hover:border-[#24388C] hover:shadow-md transition-all duration-150 group bg-white"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
              style={{ background: avatarColor(c.nombre) }}
            >
              {initials(c.nombre)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-[#1A1A1A] truncate group-hover:text-[#24388C] transition-colors">
                {c.nombre}
              </div>
              <div className="text-[12.5px] text-[#6B6B6B] truncate">{c.empresa}</div>
            </div>
            {c.sector && <Badge variant="blue">{c.sector}</Badge>}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1.5 text-[12.5px] text-[#4A4A4A]">
            <div className="flex items-center gap-2">
              <IconLocation />
              <span className="truncate">{c.ciudad || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone />
              <span>{c.telefono || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconEmail />
              <span className="truncate">{c.email || '—'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
            <span className="text-[11.5px] text-[#ABABAB]">
              Registrado {formatDate(c.fecha_creacion)}
            </span>
            <IconChevron />
          </div>
        </div>
      ))}
    </div>
  )
}