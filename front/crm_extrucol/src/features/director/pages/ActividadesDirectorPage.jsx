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

export default function ActividadesDirectorPage({ esDirector = true, detallePath = null }) {
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

  const porDia = useMemo(() => {
    const mapa = {}
    filtradas.forEach(a => {
      const dia = a.fecha_actividad?.slice(0, 10) ?? 'Sin fecha'
      if (!mapa[dia]) mapa[dia] = []
      mapa[dia].push(a)
    })
    return Object.entries(mapa).sort(([a], [b]) => b.localeCompare(a))
  }, [filtradas])

  const irADetalle = (actId) => {
    const base = detallePath ?? (esDirector ? '/director/actividades' : null)
    if (base) navigate(`${base}/${actId}`)
  }

  return (
    <AppLayout>
      <Topbar title={esDirector ? 'Actividades del Equipo' : 'Mis Actividades'} />
      <div className="p-4 sm:p-6">

        {/* CONTROLES */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap w-full">

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

          <input type="date" value={inicio} onChange={e => setInicio(e.target.value)}
            className="w-full sm:w-auto text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none focus:border-[#24388C]" />

          <span className="hidden sm:block self-center text-[13px] text-[#6B6B6B]">hasta</span>

          <input type="date" value={fin} onChange={e => setFin(e.target.value)}
            className="w-full sm:w-auto text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none focus:border-[#24388C]" />

          <button onClick={aplicarFiltro}
            className="w-full sm:w-auto px-4 py-[7px] rounded-md text-[13px] font-semibold text-white bg-[#24388C]">
            Filtrar
          </button>

          {esDirector && usuarios.length > 0 && (
            <select value={filtroEjecutivo} onChange={e => setFiltroEjecutivo(e.target.value)}
              className="w-full sm:w-48 text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white">
              <option value="">Todos los ejecutivos</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          )}
        </div>

        {loading && <LoadingSpinner label="Cargando actividades..." />}

        {!loading && porDia.map(([dia, acts]) => (
          <div key={dia} className="mb-4">
            <div className="text-[12px] font-bold text-[#ABABAB] uppercase mb-2 capitalize flex items-center gap-2">
              {formatDate(dia + 'T12:00:00')}
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EEF1FA] text-[#24388C]">
                {acts.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {acts.map(a => (
                <div
                  key={a.id}
                  onClick={() => irADetalle(a.id)}
                  className={`bg-white rounded-xl border border-[#F0F0F0] shadow-sm px-5 py-4 ${
                    (detallePath || esDirector) ? 'cursor-pointer group' : ''
                  }`}
                >

                  {/* CONTENIDO RESPONSIVE */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                    <div className="flex items-start gap-3 min-w-0 w-full">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${a.resultado ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />

                      <div className="min-w-0 w-full">
                        <div className="text-[13.5px] font-semibold text-[#1A1A1A]">
                          {a.tipo}
                        </div>

                        <div className="text-[12.5px] text-[#6B6B6B] mt-0.5 line-clamp-2 sm:line-clamp-1">
                          {a.descripcion}
                        </div>

                        {a.resultado && (
                          <div className="text-[12px] italic text-[#4A4A4A] bg-[#F7F7F7] rounded px-2 py-1 mt-1 line-clamp-2 sm:line-clamp-1">
                            {a.resultado}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 mt-2 text-[11.5px] text-[#ABABAB]">
                          {a.usuario?.nombre && <span>{a.usuario.nombre}</span>}
                          {a.oportunidad?.nombre && <span>{a.oportunidad.nombre}</span>}
                          <span>{formatDateTime(a.fecha_actividad)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF1FA] text-[#24388C]">
                        {a.resultado ? 'Completada' : 'Pendiente'}
                      </span>
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