import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'

const ROL_VARIANT  = { EJECUTIVO: 'blue', DIRECTOR: 'purple', ADMIN: 'orange' }
const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

export default function DashboardAdminPage() {
  const navigate = useNavigate()
  const { usuarios, loading, error } = useUsuarios()

const activos   = (usuarios || []).filter(u => u.activo)
const inactivos = (usuarios || []).filter(u => !u.activo)

  return (
    <AppLayout>
      <Topbar title="Panel de Administración" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando usuarios..." />}
        {error && <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-4">{error}</div>}

        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Total usuarios</div>
                <div className="text-[26px] font-extrabold text-[#24388C]">{usuarios.length}</div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Activos</div>
                <div className="text-[26px] font-extrabold text-[#22C55E]">{activos.length}</div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Inactivos</div>
                <div className="text-[26px] font-extrabold text-[#EF4444]">{inactivos.length}</div>
              </div>
            </div>

            {/* Listado completo */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                <span className="text-[14px] font-bold text-[#1A1A1A]">Usuarios del sistema</span>
                <button onClick={() => navigate('/usuarios/nuevo')}
                  className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all">
                  + Nuevo usuario
                </button>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {usuarios.map(u => (
                  <div key={u.id}
                    onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#F7F9FF] cursor-pointer transition-colors">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor(u.nombre) }}>
                      {initials(u.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#1A1A1A] truncate">{u.nombre}</div>
                      <div className="text-[12px] text-[#6B6B6B] truncate">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={ROL_VARIANT[u.rol] ?? 'gray'}>{u.rol}</Badge>
                      <Badge variant={u.activo ? 'green' : 'red'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
