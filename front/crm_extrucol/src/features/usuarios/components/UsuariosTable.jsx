import { useNavigate } from 'react-router-dom'
import { Badge } from '../../../shared/components/FormField'

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const ROL_VARIANT = { EJECUTIVO: 'blue', DIRECTOR: 'purple', ADMIN: 'orange' }
const ROL_LABEL   = { EJECUTIVO: 'Ejecutivo', DIRECTOR: 'Director', ADMIN: 'Admin' }

function IconEdit() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
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

export default function UsuariosTable({ usuarios, toggling, toggleEstado, myId }) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
      {usuarios.map(u => {
        const isMe = String(u.id) === String(myId)
        return (
          <div
            key={u.id}
            className="border border-[#F0F0F0] rounded-xl p-4 bg-white hover:shadow-sm transition-all duration-150"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                style={{ background: avatarColor(u.nombre) }}
              >
                {initials(u.nombre)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[14px] font-bold text-[#1A1A1A] truncate">
                    {u.nombre}
                  </span>
                  {isMe && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF1FA] text-[#24388C]">
                      Yo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant={ROL_VARIANT[u.rol] ?? 'gray'}>
                    {ROL_LABEL[u.rol] ?? u.rol}
                  </Badge>
                  <Badge variant={u.activo ? 'green' : 'red'}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-[12.5px] text-[#4A4A4A] mb-4">
              <IconEmail />
              <span className="truncate">{u.email}</span>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#F0F0F0]">
              <button
                onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all"
              >
                <IconEdit />
                Editar
              </button>

              {/* CE-21: toggle estado — no aplica al propio admin */}
              {!isMe && (
                <button
                  onClick={() => toggleEstado(u.id, !u.activo)}
                  disabled={toggling === u.id}
                  className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-50 ${
                    u.activo
                      ? 'text-[#C0392B] border border-[#C0392B] hover:bg-[#FDECEA]'
                      : 'text-[#1A8754] border border-[#1A8754] hover:bg-[#E8F5EE]'
                  }`}
                >
                  {toggling === u.id
                    ? '...'
                    : u.activo ? 'Desactivar' : 'Activar'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
