import { useNavigate } from 'react-router-dom'

const AVATAR_COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1', '#B45309']
const avatarColor = (nombre = '') => AVATAR_COLORS[nombre.charCodeAt(0) % AVATAR_COLORS.length]
const initials    = (nombre = '') => nombre.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export default function ClientesTable({ clientes }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F7F7F7]">
            {['Cliente', 'Empresa', 'Sector', 'Ciudad', 'Teléfono', 'Correo'].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[11.5px] font-bold text-[#6B6B6B] uppercase tracking-wide border-b border-[#F0F0F0] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr
              key={c.id}
              onClick={() => navigate(`/clientes/${c.id}`)}
              className="border-b border-[#F0F0F0] hover:bg-[#F7F7F7] cursor-pointer transition-colors last:border-b-0"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: avatarColor(c.nombre) }}>
                    {initials(c.nombre)}
                  </div>
                  <span className="text-[13.5px] font-semibold text-[#1A1A1A]">{c.nombre}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-[13.5px] text-[#4A4A4A]">{c.empresa}</td>
              <td className="px-4 py-3">
                {c.sector && (
                  <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF1FA] text-[#24388C]">
                    {c.sector}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-[13.5px] text-[#4A4A4A]">{c.ciudad}</td>
              <td className="px-4 py-3 text-[13.5px] text-[#4A4A4A]">{c.telefono}</td>
              <td className="px-4 py-3 text-[13.5px] text-[#4A4A4A]">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
