import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { monitoreoAPI } from '../services/monitoreoAPI'
import MapaBase, { createPinIcon, Marker, Popup } from '../components/MapaBase'

// Colombia center / zoom
const COLOMBIA_CENTER = [4.5, -74.0]
const COLOMBIA_ZOOM   = 5

const CIUDAD_COORDS = {
  'Bucaramanga':   [7.1254, -73.1198],
  'Medellín':      [6.2442, -75.5812],
  'Cali':          [3.4516, -76.5320],
  'Barranquilla':  [10.9685, -74.7813],
  'Bogotá':        [4.7110, -74.0721],
  'Cartagena':     [10.3910, -75.4794],
  'Pereira':       [4.8143, -75.6946],
  'Manizales':     [5.0703, -75.5136],
  'Santa Marta':   [11.2408, -74.2110],
  'Ibagué':        [4.4389, -75.2322],
}

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']



const TIPO_CFG = {
  visita:  { bg: '#EEF1FA', color: '#24388C', label: 'Visita' },
  llamada: { bg: '#E8F5EE', color: '#1A8754', label: 'Llamada' },
  reunion: { bg: '#FFF8E5', color: '#B87E15', label: 'Reunión' },
}

const ESTADO_CFG = {
  completada:   { bg: '#E8F5EE', color: '#1A8754',  label: 'Completada',   pin: '#1A8754' },
  pendiente:    { bg: '#FFF8E5', color: '#B87E15',  label: 'Pendiente',    pin: '#F39610' },
  no_realizada: { bg: '#FDECEA', color: '#C0392B',  label: 'No realizada', pin: '#C0392B' },
}

function VisitaIcon({ tipo }) {
  const paths = {
    visita:  'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    llamada: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
    reunion: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  }
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[tipo] ?? paths.visita} />
    </svg>
  )
}

export default function MapaActividadesPage() {
  const navigate  = useNavigate()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [fecha,   setFecha]   = useState(new Date().toISOString().split('T')[0])
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    setLoading(true)
    monitoreoAPI.mapaActividades({ fecha })
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [fecha])

  const actividades   = data?.actividades ?? []
  const departamentos = data?.departamentos ?? []

  const filtradas = useMemo(() =>
    filtroTipo === 'todos' ? actividades : actividades.filter(a => a.tipo === filtroTipo),
    [actividades, filtroTipo]
  )

  const completadas  = actividades.filter(a => a.estado === 'completada').length
  const pendientes   = actividades.filter(a => a.estado === 'pendiente').length
  const noRealizadas = actividades.filter(a => a.estado === 'no_realizada').length

  // Build marker list — resolve city → lat/lon, skip unknown
  const markers = useMemo(() =>
    filtradas
      .map(act => {
        const coords = act.lat && act.lon
          ? [act.lat, act.lon]
          : CIUDAD_COORDS[act.ciudad]
        return coords ? { ...act, coords } : null
      })
      .filter(Boolean),
    [filtradas]
  )

  // flyTo selected activity
  const flyTarget = seleccionada
    ? markers.find(m => m.id === seleccionada)?.coords ?? null
    : null

  return (
    <AppLayout>
      <Topbar title="Mapa de actividades" />
      <div className="p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Completadas',   value: completadas,  color: '#1A8754' },
            { label: 'Pendientes',    value: pendientes,   color: '#F39610' },
            { label: 'No realizadas', value: noRealizadas, color: '#C0392B' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
              <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
              <div className="text-[26px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[12px] text-[#6B6B6B] mt-0.5">De {actividades.length} total</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition" />
          <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setSeleccionada(null) }}
            className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition">
            <option value="todos">Todos los tipos</option>
            <option value="visita">Visitas</option>
            <option value="llamada">Llamadas</option>
            <option value="reunion">Reuniones</option>
          </select>

          {/* Map legend */}
          <div className="ml-auto flex items-center gap-3 text-[11.5px]">
            {Object.entries(ESTADO_CFG).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: v.pin }} />
                {v.label}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Cargando actividades..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            {/* Leaflet Map */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                <div className="text-[14px] font-bold text-[#1A1A1A]">Distribución geográfica</div>
                <div className="text-[12px] text-[#6B6B6B]">{fecha} · {markers.length} actividades en el mapa</div>
              </div>
              <div style={{ height: '400px' }}>
                <MapaBase
                  center={COLOMBIA_CENTER}
                  zoom={COLOMBIA_ZOOM}
                  flyTo={flyTarget}
                  flyZoom={12}
                >
                  {markers.map(act => {
                    const estadoCfg = ESTADO_CFG[act.estado] ?? ESTADO_CFG.pendiente
                    const iniciales = (act.ejecutivo ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    const icon = createPinIcon(estadoCfg.pin, iniciales)

                    return (
                      <Marker
                        key={act.id}
                        position={act.coords}
                        icon={icon}
                        eventHandlers={{ click: () => setSeleccionada(act.id) }}
                      >
                        <Popup>
                          <div style={{ fontFamily: 'Roboto, sans-serif', minWidth: 190 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1A1A', marginBottom: 4 }}>
                              {act.titulo}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#6B6B6B', marginBottom: 2 }}>
                              {act.ejecutivo} · {act.ciudad}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#6B6B6B', marginBottom: 6 }}>
                              {TIPO_CFG[act.tipo]?.label ?? act.tipo} · {act.hora}
                            </div>
                            <span style={{
                              display: 'inline-block',
                              fontSize: 10.5, fontWeight: 700,
                              padding: '2px 8px', borderRadius: 999,
                              background: estadoCfg.bg, color: estadoCfg.color,
                            }}>
                              {estadoCfg.label}
                            </span>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapaBase>
              </div>
            </div>

            {/* Departamento panel */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                <div className="text-[14px] font-bold text-[#1A1A1A]">Por departamento</div>
                <div className="text-[12px] text-[#6B6B6B]">Cobertura territorial</div>
              </div>
              <div className="p-3">
                {departamentos.map(d => (
                  <div key={d.nombre} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F7F7F7] transition mb-1">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#1A1A1A]">{d.nombre}</div>
                      <div className="text-[11px] text-[#6B6B6B]">{d.ejecutivos} ejecutivo{d.ejecutivos !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[12px] font-bold text-[#1A1A1A]">{d.completadas}/{d.actividades}</div>
                      <div className="text-[10px] text-[#ABABAB]">completadas</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-[#F0F0F0]">
                <button onClick={() => navigate('/coordinador/monitoreo')}
                  className="w-full text-[12.5px] font-semibold text-[#24388C] hover:underline text-left">
                  ← Ver tabla de monitoreo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity list */}
        {!loading && (
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0F0]">
              <div className="text-[14px] font-bold text-[#1A1A1A]">Actividades del día</div>
              <div className="text-[12px] text-[#6B6B6B]">{filtradas.length} actividades · click para centrar el mapa</div>
            </div>
            {filtradas.length === 0 ? (
              <div className="text-center py-12 text-[13px] text-[#ABABAB]">Sin actividades para los filtros seleccionados</div>
            ) : (
              filtradas.map((act, i) => {
                const tipoCfg   = TIPO_CFG[act.tipo]     ?? TIPO_CFG.visita
                const estadoCfg = ESTADO_CFG[act.estado] ?? ESTADO_CFG.pendiente
                const avatarColor = AVATAR_COLORS[(act.ejecutivo_idx ?? i) % 6]
                const isSelected = seleccionada === act.id
                const haCoords = !!CIUDAD_COORDS[act.ciudad]

                return (
                  <div key={act.id ?? i}
                    onClick={() => haCoords && setSeleccionada(isSelected ? null : act.id)}
                    className="flex items-center gap-3.5 px-5 py-3.5 border-t border-[#F0F0F0] transition"
                    style={{
                      cursor: haCoords ? 'pointer' : 'default',
                      background: isSelected ? '#EEF1FA' : 'transparent',
                    }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: tipoCfg.bg, color: tipoCfg.color }}>
                      <VisitaIcon tipo={act.tipo} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#1A1A1A] truncate">{act.titulo}</div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[11.5px] text-[#6B6B6B]">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                            style={{ background: avatarColor }}>
                            {(act.ejecutivo ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span>{act.ejecutivo}</span>
                        </div>
                        <span className="text-[#D5D5D5]">·</span>
                        <span>{act.ciudad}</span>
                        <span className="text-[#D5D5D5]">·</span>
                        <span className="font-semibold text-[#4A4A4A]">{act.hora}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: tipoCfg.bg, color: tipoCfg.color }}>
                        {tipoCfg.label}
                      </span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: estadoCfg.bg, color: estadoCfg.color }}>
                        {estadoCfg.label}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
