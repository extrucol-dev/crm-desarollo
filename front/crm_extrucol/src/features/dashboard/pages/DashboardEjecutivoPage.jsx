import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { oportunidadesAPI } from '../../oportunidades/services/oportunidadesAPI'
import { directorAPI } from '../../director/services/directorAPI'

const ESTADO_VARIANT = { PROSPECTO: 'blue', CALIFICACION: 'orange', PROPUESTA: 'purple', NEGOCIACION: 'purple', GANADA: 'green', PERDIDA: 'red' }
const ESTADOS_ACTIVOS = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION']

const formatCOP = (n) => {
  if (!n) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}
const formatDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// Inicio y fin de la semana actual
const getSemanaActual = () => {
  const hoy = new Date()
  const dia  = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1 // lunes = 0
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - dia); lunes.setHours(0,0,0,0)
  const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6)
  return {
    inicio: lunes.toISOString().slice(0, 10),
    fin:    domingo.toISOString().slice(0, 10),
  }
}

function StatCard({ label, value, sub, color = '#24388C' }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[26px] font-extrabold tracking-tight" style={{ color }}>{value}</div>
      {sub && <div className="text-[12px] text-[#6B6B6B] mt-0.5">{sub}</div>}
    </div>
  )
}

export default function DashboardEjecutivoPage() {
  const navigate = useNavigate()
  const [oportunidades, setOportunidades] = useState([])
  const [actividades, setActividades]     = useState([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    const { inicio, fin } = getSemanaActual()
    Promise.all([
      oportunidadesAPI.listar(),
      directorAPI.misActividades({ inicio, fin }),
    ]).then(([ops, acts]) => {
      setOportunidades(ops)
      setActividades(acts)
    }).finally(() => setLoading(false))
  }, [])

  const activas = oportunidades.filter(op => ESTADOS_ACTIVOS.includes(op.estado))
  const valorPipeline = activas.reduce((s, op) => s + (op.valor_estimado ?? 0), 0)
  const ultimasActividades = [...actividades]
    .sort((a, b) => new Date(b.fecha_actividad) - new Date(a.fecha_actividad))
    .slice(0, 5)

  // Agrupar activas por estado
  const porEstado = ESTADOS_ACTIVOS.reduce((acc, e) => {
    acc[e] = oportunidades.filter(op => op.estado === e).length
    return acc
  }, {})

  return (
    <AppLayout>
      <Topbar title="Mi Dashboard" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando dashboard..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard label="Oportunidades activas" value={activas.length} />
              <StatCard label="Pipeline activo" value={formatCOP(valorPipeline)} color="#F39610" />
              <StatCard label="Actividades esta semana" value={actividades.length} color="#1A8754" />
              <StatCard label="Oportunidades ganadas" value={oportunidades.filter(op => op.estado === 'GANADA').length} color="#22C55E" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pipeline por estado */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Oportunidades por estado</span>
                  <button onClick={() => navigate('/oportunidades')}
                    className="text-[12px] font-semibold text-[#24388C] hover:underline">
                    Ver kanban
                  </button>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {ESTADOS_ACTIVOS.map(estado => (
                    <div key={estado} className="flex items-center gap-3">
                      <Badge variant={ESTADO_VARIANT[estado]}>{estado}</Badge>
                      <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#24388C] rounded-full transition-all"
                          style={{ width: activas.length ? `${(porEstado[estado] / activas.length) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-[13px] font-bold text-[#1A1A1A] w-5 text-right">{porEstado[estado]}</span>
                    </div>
                  ))}
                  {activas.length === 0 && (
                    <p className="text-[13px] text-[#ABABAB] text-center py-4">Sin oportunidades activas</p>
                  )}
                </div>
              </div>

              {/* Últimas actividades */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Mis últimas actividades</span>
                </div>
                <div className="divide-y divide-[#F0F0F0]">
                  {ultimasActividades.length === 0 && (
                    <p className="text-[13px] text-[#ABABAB] text-center py-8">Sin actividades esta semana</p>
                  )}
                  {ultimasActividades.map(a => (
                    <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.resultado ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{a.tipo}</div>
                        <div className="text-[12px] text-[#6B6B6B] truncate">{a.descripcion}</div>
                        <div className="text-[11.5px] text-[#ABABAB] mt-0.5">{formatDateTime(a.fecha_actividad)}</div>
                      </div>
                      <span className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${a.resultado ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'}`}>
                        {a.resultado ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
