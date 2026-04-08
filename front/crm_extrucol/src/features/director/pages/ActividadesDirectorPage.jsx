import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { directorAPI } from '../services/directorAPI'

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })
}
const formatDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getSemana = () => {
  const hoy = new Date()
  const dia  = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - dia); lunes.setHours(0,0,0,0)
  const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6)
  return { inicio: lunes.toISOString().slice(0, 10), fin: domingo.toISOString().slice(0, 10) }
}
const getHoy = () => {
  const hoy = new Date().toISOString().slice(0, 10)
  return { inicio: hoy, fin: hoy }
}

export default function ActividadesDirectorPage({ esDirector = true }) {
  const navigate  = useNavigate()
  const semana    = getSemana()
  const [actividades, setActividades]         = useState([])
  const [usuarios, setUsuarios]               = useState([])
  const [loading, setLoading]                 = useState(true)
  const [vista, setVista]                     = useState('semana')
  const [filtroEjecutivo, setFiltroEjecutivo] = useState('')
  const [inicio, setInicio]                   = useState(semana.inicio)
  const [fin, setFin]                         = useState(semana.fin)

  const cargar = (params = {}) => {
    setLoading(true)
    const fn = esDirector ? directorAPI.actividades : directorAPI.misActividades
    fn(params)
      .then(setActividades)
      .catch(() => setActividades([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (esDirector) {
      directorAPI.usuarios()
        .then(u => setUsuarios(u.filter(x => x.rol === 'EJECUTIVO')))
        .catch(() => {})
    }
    cargar({ inicio, fin })
  }, [])

  const aplicarFiltro = () => cargar({ inicio, fin })

  const cambiarVista = (v) => {
    setVista(v)
    const rango = v === 'hoy' ? getHoy() : getSemana()
    setInicio(rango.inicio); setFin(rango.fin)
    cargar(rango)
  }

  const filtradas = useMemo(() =>
    actividades.filter(a => !filtroEjecutivo || String(a.usuario?.id) === filtroEjecutivo)
  , [actividades, filtroEjecutivo])

  // Agrupar por día
  const porDia = useMemo(() => {
    const mapa = {}
    filtradas.forEach(a => {
      const dia = a.fecha_actividad?.slice(0, 10) ?? 'Sin fecha'
      if (!mapa[dia]) mapa[dia] = []
      mapa[dia].push(a)
    })
    return Object.entries(mapa).sort(([a], [b]) => b.localeCompare(a))
  }, [filtradas])

  // Ruta de detalle según el rol
  const irADetalle = (actId) => {
    if (esDirector) navigate(`/director/actividades/${actId}`)
    // El ejecutivo no tiene ruta de detalle — solo editar
  }

  return (
    <AppLayout>
      <Topbar title={esDirector ? 'Actividades del Equipo' : 'Mis Actividades'} />
      <div className="p-4 sm:p-6">
        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
          {/* Tabs hoy / semana */}
          <div className="flex rounded-md border border-[#D5D5D5] overflow-hidden">
            {['hoy', 'semana'].map(v => (
              <button key={v} onClick={() => cambiarVista(v)}
                className={`px-4 py-[7px] text-[13px] font-semibold transition-all capitalize ${
                  vista === v ? 'bg-[#24388C] text-white' : 'bg-white text-[#4A4A4A] hover:bg-[#F7F7F7]'
                }`}>
                {v === 'hoy' ? 'Hoy' : 'Esta semana'}
              </button>
            ))}
          </div>

          {/* Rango personalizado */}
          <input type="date" value={inicio} onChange={e => setInicio(e.target.value)}
            className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none focus:border-[#24388C] transition-all" />
          <span className="self-center text-[13px] text-[#6B6B6B]">hasta</span>
          <input type="date" value={fin} onChange={e => setFin(e.target.value)}
            className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none focus:border-[#24388C] transition-all" />
          <button onClick={aplicarFiltro}
            className="px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all whitespace-nowrap">
            Filtrar
          </button>

          {/* Filtro ejecutivo (solo director) */}
          {esDirector && usuarios.length > 0 && (
            <select value={filtroEjecutivo} onChange={e => setFiltroEjecutivo(e.target.value)}
              className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all sm:w-48">
              <option value="">Todos los ejecutivos</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          )}
        </div>

        {loading && <LoadingSpinner label="Cargando actividades..." />}

        {!loading && filtradas.length === 0 && (
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm text-center py-12">
            <p className="text-[14px] font-semibold text-[#4A4A4A] mb-1">Sin actividades</p>
            <p className="text-[12.5px] text-[#ABABAB]">No hay actividades registradas en el período seleccionado</p>
          </div>
        )}

        {/* Agrupadas por día */}
        {!loading && porDia.map(([dia, acts]) => (
          <div key={dia} className="mb-4">
            <div className="text-[12px] font-bold text-[#ABABAB] uppercase tracking-wider mb-2 capitalize flex items-center gap-2">
              {formatDate(dia + 'T12:00:00')}
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EEF1FA] text-[#24388C]">
                {acts.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {acts.map(a => (
                <div
                  key={a.id}
                  onClick={() => esDirector && irADetalle(a.id)}
                  className={`bg-white rounded-xl border border-[#F0F0F0] shadow-sm px-5 py-4 transition-all duration-150 ${
                    esDirector ? 'cursor-pointer hover:border-[#24388C] hover:shadow-md group' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Dot de estado */}
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${a.resultado ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />
                      <div className="min-w-0">
                        <div className={`text-[13.5px] font-semibold text-[#1A1A1A] transition-colors ${esDirector ? 'group-hover:text-[#24388C]' : ''}`}>
                          {a.tipo}
                        </div>
                        <div className="text-[12.5px] text-[#6B6B6B] mt-0.5 line-clamp-1">{a.descripcion}</div>
                        {a.resultado && (
                          <div className="text-[12px] italic text-[#4A4A4A] bg-[#F7F7F7] rounded px-2 py-1 mt-1 line-clamp-1">
                            {a.resultado}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-[11.5px] text-[#ABABAB] flex-wrap">
                          {a.usuario?.nombre && <span>{a.usuario.nombre}</span>}
                          {a.oportunidad?.nombre && (
                            <span className="flex items-center gap-1 truncate">
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18A48.23 48.23 0 0112 20.25" />
                              </svg>
                              {a.oportunidad.nombre}
                            </span>
                          )}
                          <span>{formatDateTime(a.fecha_actividad)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10.5px] font-semibold ${
                            a.virtual ? 'bg-[#F0F0F0] text-[#6B6B6B]' : 'bg-[#EEF1FA] text-[#24388C]'
                          }`}>
                            {a.virtual ? 'Virtual' : 'Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        a.resultado ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'
                      }`}>
                        {a.resultado ? 'Completada' : 'Pendiente'}
                      </span>
                      {/* Flecha indicadora solo para el director */}
                      {esDirector && (
                        <svg className="w-4 h-4 text-[#ABABAB] group-hover:text-[#24388C] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}