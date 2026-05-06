import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'

const SERVICIOS = [
  { label: 'Base de datos Oracle',         detail: 'Latencia promedio: 12ms',    status: 'ok',   value: '99.99%' },
  { label: 'API REST',                      detail: 'Respuesta: 85ms',            status: 'ok',   value: '99.98%' },
  { label: 'Servicio de notificaciones',    detail: 'Cola: 0 mensajes',           status: 'ok',   value: '100%'   },
  { label: 'Almacenamiento',                detail: '68% de capacidad usada',     status: 'warn', value: '82%'    },
  { label: 'Autenticación',                 detail: 'SSO funcionando',            status: 'ok',   value: '100%'   },
  { label: 'Backup automático',             detail: 'Último: hoy 03:00 AM',      status: 'ok',   value: '✓'      },
]

const DB_STATS = [
  { tabla: 'CRM_EMPRESA',     registros: 87,   crec: '+3',    size: '2.4 MB'  },
  { tabla: 'CRM_CONTACTO',    registros: 154,  crec: '+8',    size: '1.8 MB'  },
  { tabla: 'CRM_LEAD',        registros: 542,  crec: '+47',   size: '4.1 MB'  },
  { tabla: 'CRM_OPORTUNIDAD', registros: 324,  crec: '+18',   size: '3.2 MB'  },
  { tabla: 'CRM_ACTIVIDAD',   registros: 1287, crec: '+198',  size: '5.8 MB'  },
  { tabla: 'CRM_AUDITORIA',   registros: 8942, crec: '+1248', size: '12.4 MB' },
]

function StatusDot({ status }) {
  const colors = { ok: '#22C55E', warn: '#F39610', error: '#C0392B' }
  const c = colors[status] ?? colors.ok
  return (
    <span className="relative flex-shrink-0 w-2 h-2">
      <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: c }} />
      <span className="relative block w-2 h-2 rounded-full" style={{ background: c }} />
    </span>
  )
}

export default function DashboardAdminPage() {
  const navigate = useNavigate()
  const { usuarios, loading } = useUsuarios()

  const activos   = (usuarios || []).filter(u => u.activo).length
  const inactivos = (usuarios || []).filter(u => !u.activo).length
  const total     = (usuarios || []).length

  return (
    <AppLayout>
      <Topbar title="Panel de administración">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1A8754] bg-[#E8F5EE] px-3 py-1.5 rounded-full">
          <StatusDot status="ok" />
          Sistema operando normal
        </div>
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando..." />}

        {!loading && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Usuarios activos',  value: activos,   sub: `${inactivos} inactivos`,    color: '#24388C' },
                { label: 'Total usuarios',    value: total,     sub: 'En el sistema',             color: '#1A1A1A' },
                { label: 'Registros totales', value: '2.4K',    sub: 'Leads + Opp + Act.',        color: '#1A8754' },
                { label: 'Uptime',            value: '99.9%',   sub: 'Últimos 30 días',           color: '#1A8754' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
                  <div className="text-[26px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Salud + Acciones rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

              {/* Salud del sistema */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">Salud del sistema</div>
                    <div className="text-[12px] text-[#6B6B6B]">Monitoreo en tiempo real</div>
                  </div>
                  <div className="flex items-center gap-2 text-[11.5px] font-semibold text-[#1A8754]">
                    <StatusDot status="ok" />
                    Todos operativos
                  </div>
                </div>
                <div className="divide-y divide-[#F0F0F0]">
                  {SERVICIOS.map(s => (
                    <div key={s.label} className="flex items-center gap-3 px-5 py-3">
                      <StatusDot status={s.status} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1A1A1A]">{s.label}</div>
                        <div className="text-[11.5px] text-[#6B6B6B]">{s.detail}</div>
                      </div>
                      <span className="text-[13px] font-bold flex-shrink-0"
                        style={{ color: s.status === 'ok' ? '#1A8754' : s.status === 'warn' ? '#F39610' : '#C0392B' }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Acciones rápidas</div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3">
                  {[
                    { icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', label: 'Nuevo usuario',     bg: '#EEF1FA', ic: '#24388C', action: () => navigate('/usuarios/nuevo') },
                    { icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z', label: 'Catálogos',         bg: '#FFF4E0', ic: '#C7770D', action: () => navigate('/admin/catalogos') },
                    { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', label: 'Auditoría',         bg: '#E8F5EE', ic: '#1A8754', action: () => navigate('/admin/auditoria') },
                    { icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z', label: 'Configuración',     bg: '#F3E8FF', ic: '#7C3AED', action: () => {} },
                    { icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3', label: 'Backup manual',     bg: '#FEF9C3', ic: '#A16207', action: () => {} },
                    { icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3M16.5 12L12 7.5m0 0L7.5 12m4.5-4.5v13.5', label: 'Importar datos',    bg: '#EEF1FA', ic: '#24388C', action: () => {} },
                  ].map(a => (
                    <button key={a.label} onClick={a.action}
                      className="flex flex-col items-start gap-2 p-3.5 bg-white border border-[#F0F0F0] rounded-xl text-left hover:border-[#24388C] hover:shadow-sm transition-all group">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: a.bg, color: a.ic }}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                        </svg>
                      </div>
                      <span className="text-[12.5px] font-semibold text-[#1A1A1A] group-hover:text-[#24388C] transition-colors">
                        {a.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DB Stats */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F0F0]">
                <div className="text-[14px] font-bold text-[#1A1A1A]">Estadísticas de base de datos</div>
                <div className="text-[12px] text-[#6B6B6B]">Tablas principales del sistema</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F7F7] border-b border-[#F0F0F0]">
                    <tr>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider">Tabla</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider">Registros</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider">Crecimiento 30d</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider">Tamaño</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {DB_STATS.map(row => (
                      <tr key={row.tabla} className="hover:bg-[#FAFAFA]">
                        <td className="px-5 py-3">
                          <code className="text-[12px] font-bold text-[#24388C] bg-[#EEF1FA] px-2 py-0.5 rounded">
                            {row.tabla}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-right text-[13px] font-bold text-[#1A1A1A]">
                          {row.registros.toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-3 text-right text-[13px] font-bold text-[#1A8754]">
                          {row.crec}
                        </td>
                        <td className="px-5 py-3 text-right text-[12px] text-[#6B6B6B]">
                          {row.size}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
