import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { actividadesAPI } from '../../actividades/services/actividadesAPI'

// ── Helpers ───────────────────────────────────────────────────
const formatDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const TIPO_LABEL = {
  VISITA:       'Visita presencial',
  REUNION:      'Reunión',
  LLAMADA:      'Llamada telefónica',
  COTIZACION:   'Envío de cotización',
  PRESENTACION: 'Presentación',
  DEMOSTRACION: 'Demostración',
}

// ── Mapa con Leaflet (OpenStreetMap, sin API key) ─────────────
// Carga Leaflet dinámicamente para no aumentar el bundle
function MapaUbicacion({ latitud, longitud }) {
  const mapId = `mapa-actividad-${latitud}-${longitud}`

  useEffect(() => {
    // Cargar CSS de Leaflet
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    let map = null

    const initMap = (L) => {
      const el = document.getElementById(mapId)
      if (!el) return

      map = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView(
        [latitud, longitud], 15
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Marcador personalizado con el color del CRM
      const iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="24" height="32">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z"
            fill="#24388C" stroke="white" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      `
      const icon = L.divIcon({
        html:      iconSvg,
        iconSize:  [24, 32],
        iconAnchor:[12, 32],
        className: '',
      })

      L.marker([latitud, longitud], { icon })
        .addTo(map)
        .bindPopup(`<b>Ubicación verificada</b><br>${latitud.toFixed(6)}, ${longitud.toFixed(6)}`)
        .openPopup()
    }

    // Cargar Leaflet si no está disponible aún
    if (window.L) {
      initMap(window.L)
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => initMap(window.L)
      document.head.appendChild(script)
    }

    return () => {
      if (map) { map.remove(); map = null }
    }
  }, [latitud, longitud, mapId])

  return (
    <div
      id={mapId}
      className="w-full rounded-lg overflow-hidden border border-[#F0F0F0]"
      style={{ height: '300px', zIndex: 0 }}
    />
  )
}

// ── Field helper ──────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[13.5px] text-[#1A1A1A] font-medium">{value || '—'}</div>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────
export default function ActividadDetalleDirectorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [actividad, setActividad] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    actividadesAPI.buscar(id)
      .then(setActividad)
      .catch(() => setError('No se pudo cargar la actividad.'))
      .finally(() => setLoading(false))
  }, [id])

  const a = actividad
  const completada  = !!a?.resultado
  const tieneUbicacion = a?.ubicacion?.latitud && a?.ubicacion?.longitud

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate(-1)}>
            Actividades
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[160px] sm:max-w-[240px]">
            {a?.tipo ? (TIPO_LABEL[a.tipo] ?? a.tipo) : '...'}
          </span>
        </>
      }>
        <span className="text-[12px] text-[#ABABAB] bg-[#F0F0F0] px-3 py-1.5 rounded-full">
          Solo lectura
        </span>
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando actividad..." />}
        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3">
            {error}
          </div>
        )}

        {!loading && a && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ── Izquierda — detalles ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Info principal */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg className="w-4 h-4 text-[#24388C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                    <span className="text-[15px] font-bold text-[#1A1A1A] truncate">
                      {TIPO_LABEL[a.tipo] ?? a.tipo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${
                      completada ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'
                    }`}>
                      {completada ? 'Completada' : 'Pendiente'}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded text-[10.5px] ${
                      a.virtual ? 'bg-[#F0F0F0] text-[#6B6B6B]' : 'bg-[#EEF1FA] text-[#24388C]'
                    }`}>
                      {a.virtual ? 'Virtual' : 'Presencial'}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-5 flex flex-col gap-4">
                  <Field label="Fecha y hora"   value={formatDateTime(a.fecha_actividad)} />
                  <Field label="Descripción"     value={a.descripcion} />
                  {completada && (
                    <div>
                      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Resultado</div>
                      <div className="text-[13.5px] text-[#1A1A1A] font-medium bg-[#F7F7F7] rounded-lg px-3 py-2.5 italic">
                        {a.resultado}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mapa — solo si es presencial y tiene ubicación */}
              {!a.virtual && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#24388C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="text-[14px] font-bold text-[#1A1A1A]">Ubicación verificada</span>
                  </div>
                  <div className="p-4">
                    {tieneUbicacion ? (
                      <>
                        <MapaUbicacion
                          latitud={a.ubicacion.latitud}
                          longitud={a.ubicacion.longitud}
                        />
                        <div className="flex items-center gap-2 mt-3 text-[12px] text-[#6B6B6B]">
                          <svg className="w-3.5 h-3.5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          Ubicación GPS registrada al completar la actividad —
                          <span className="font-mono text-[11px]">
                            {a.ubicacion.latitud.toFixed(5)}, {a.ubicacion.longitud.toFixed(5)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 py-4 text-[13px] text-[#ABABAB]">
                        <svg className="w-5 h-5 text-[#D5D5D5] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {completada
                          ? 'No se registró ubicación GPS en esta actividad'
                          : 'La ubicación se registrará cuando el ejecutivo complete la actividad'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Derecha — ejecutivo + oportunidad ── */}
            <div className="flex flex-col gap-4">

              {/* Ejecutivo */}
              {a.usuario && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[13px] font-bold text-[#ABABAB] uppercase tracking-wider mb-3">Ejecutivo</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor(a.usuario.nombre) }}>
                      {initials(a.usuario.nombre)}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-[#1A1A1A]">{a.usuario.nombre}</div>
                      <div className="text-[12px] text-[#6B6B6B]">{a.usuario.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Oportunidad relacionada */}
              {a.oportunidad && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[13px] font-bold text-[#ABABAB] uppercase tracking-wider mb-3">Oportunidad</div>
                  <div
                    onClick={() => navigate(`/director/oportunidades/${a.oportunidad.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="text-[13.5px] font-bold text-[#1A1A1A] group-hover:text-[#24388C] transition-colors mb-1">
                      {a.oportunidad.nombre}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11.5px] text-[#6B6B6B]">{a.oportunidad.tipo}</span>
                      <span className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full ${
                        ['GANADA'].includes(a.oportunidad.estado) ? 'bg-[#E8F5EE] text-[#1A8754]' :
                        ['PERDIDA'].includes(a.oportunidad.estado) ? 'bg-[#FFF1F2] text-[#EF4444]' :
                        'bg-[#EEF1FA] text-[#24388C]'
                      }`}>
                        {a.oportunidad.estado}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}