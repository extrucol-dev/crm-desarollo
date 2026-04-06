import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { directorAPI } from '../../director/services/directorAPI'

const ESTADOS_ACTIVOS = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION']
const ESTADO_VARIANT  = { PROSPECTO: 'blue', CALIFICACION: 'orange', PROPUESTA: 'purple', NEGOCIACION: 'purple', GANADA: 'green', PERDIDA: 'red' }

const formatCOP = (n) => {
  if (!n) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const getMes = () => {
  const hoy   = new Date()
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const fin    = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
  return {
    inicio: inicio.toISOString().slice(0, 10),
    fin:    fin.toISOString().slice(0, 10),
  }
}
const getSemana = () => {
  const hoy = new Date()
  const dia  = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - dia)
  const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6)
  return { inicio: lunes.toISOString().slice(0, 10), fin: domingo.toISOString().slice(0, 10) }
}

function StatCard({ label, value, color = '#24388C' }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[26px] font-extrabold tracking-tight" style={{ color }}>{value}</div>
    </div>
  )
}

export default function DashboardDirectorPage() {
  const navigate = useNavigate()
  const [oportunidades, setOportunidades] = useState([])
  const [actividadesSemana, setActividadesSemana] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const semana = getSemana()
    Promise.all([
      directorAPI.oportunidades(),
      directorAPI.actividades(semana),
    ]).then(([ops, acts]) => {
      setOportunidades(ops)
      setActividadesSemana(acts)
    }).finally(() => setLoading(false))
  }, [])

  const mes = getMes()
  const activas    = oportunidades.filter(op => ESTADOS_ACTIVOS.includes(op.estado))
  const cerradasMes = oportunidades.filter(op =>
    ['GANADA', 'PERDIDA'].includes(op.estado) &&
    op.fecha_cierre >= mes.inicio && op.fecha_cierre <= mes.fin
  )
  const valorTotal = activas.reduce((s, op) => s + (op.valor_estimado ?? 0), 0)

  // Actividades por ejecutivo esta semana
  const actsPorEjecutivo = useMemo(() => {
    const mapa = {}
    actividadesSemana.forEach(a => {
      const nombre = a.usuario?.nombre ?? 'Desconocido'
      if (!mapa[nombre]) mapa[nombre] = { nombre, count: 0 }
      mapa[nombre].count++
    })
    return Object.values(mapa).sort((a, b) => b.count - a.count)
  }, [actividadesSemana])

  const maxActs = actsPorEjecutivo[0]?.count ?? 1

  return (
    <AppLayout>
      <Topbar title="Dashboard Director" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando dashboard..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard label="Oportunidades activas" value={activas.length} />
              <StatCard label="Pipeline total" value={formatCOP(valorTotal)} color="#F39610" />
              <StatCard label="Actividades esta semana" value={actividadesSemana.length} color="#1A8754" />
              <StatCard label="Cierres este mes" value={cerradasMes.length} color="#7C3AED" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Actividades por ejecutivo */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Actividades por ejecutivo (semana)</span>
                  <button onClick={() => navigate('/director/actividades')}
                    className="text-[12px] font-semibold text-[#24388C] hover:underline">Ver detalle</button>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {actsPorEjecutivo.length === 0 && (
                    <p className="text-[13px] text-[#ABABAB] text-center py-4">Sin actividades registradas esta semana</p>
                  )}
                  {actsPorEjecutivo.map(ej => (
                    <div key={ej.nombre} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: avatarColor(ej.nombre) }}>
                        {initials(ej.nombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-semibold text-[#1A1A1A] truncate">{ej.nombre}</div>
                        <div className="h-1.5 bg-[#F0F0F0] rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-[#24388C] rounded-full"
                            style={{ width: `${(ej.count / maxActs) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-[#24388C] w-5 text-right">{ej.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Oportunidades activas */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Pipeline activo</span>
                  <button onClick={() => navigate('/director/pipeline')}
                    className="text-[12px] font-semibold text-[#24388C] hover:underline">Ver completo</button>
                </div>
                <div className="divide-y divide-[#F0F0F0] max-h-64 overflow-y-auto">
                  {activas.slice(0, 8).map(op => (
                    <div key={op.id} onClick={() => navigate(`/director/oportunidades/${op.id}`)}
                      className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[#F7F9FF] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{op.nombre}</div>
                        <div className="text-[11.5px] text-[#6B6B6B] truncate">{op.usuario?.nombre} — {op.cliente?.empresa}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>{op.estado}</Badge>
                      </div>
                    </div>
                  ))}
                  {activas.length === 0 && (
                    <p className="text-[13px] text-[#ABABAB] text-center py-8">Sin oportunidades activas</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
