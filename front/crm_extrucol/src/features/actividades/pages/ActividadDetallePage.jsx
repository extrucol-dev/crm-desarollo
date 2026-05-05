import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { actividadesAPI } from '../services/actividadesAPI'

const TIPO_LABEL = {
  VISITA:       'Visita presencial',
  REUNION:      'Reunión',
  LLAMADA:      'Llamada telefónica',
  COTIZACION:   'Envío de cotización',
  PRESENTACION: 'Presentación',
  DEMOSTRACION: 'Demostración',
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[13.5px] text-[#1A1A1A] font-medium">{value || '—'}</div>
    </div>
  )
}

export default function ActividadDetallePage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [actividad, setActividad] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    actividadesAPI.buscar(id)
      .then(setActividad)
      .catch(() => setError('No se pudo cargar la actividad.'))
      .finally(() => setLoading(false))
  }, [id])

  const a         = actividad
  const completada = !!a?.resultado
  const tipo      = a ? (TIPO_LABEL[a.tipo] ?? a.tipo) : '...'

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate(-1)}>
            Actividades
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[160px] sm:max-w-[240px]">{tipo}</span>
        </>
      }>
        <button
          onClick={() => navigate(`/actividades/${id}/editar`)}
          className="px-3 sm:px-4 py-[7px] rounded-md text-[13px] font-semibold border border-[#D5D5D5] bg-white text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
          Editar
        </button>
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando actividad..." />}
        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3">
            {error}
          </div>
        )}

        {!loading && a && (
          <div className="flex flex-col lg:flex-row gap-4 items-start">

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">

              {/* Header */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                    completada ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${completada ? 'bg-[#1A8754]' : 'bg-[#24388C]'}`} />
                    {completada ? 'Completada' : 'Pendiente'}
                  </span>
                  <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF1FA] text-[#24388C]">
                    {tipo}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F0F0F0] text-[#6B6B6B]">
                    {a.virtual ? 'Virtual' : 'Presencial'}
                  </span>
                </div>
                <div className="text-[20px] font-bold text-[#1A1A1A] mb-1">
                  {a.descripcion || tipo}
                </div>
                {a.oportunidad?.nombre && (
                  <div className="text-[13px] text-[#6B6B6B]">
                    {a.oportunidad.nombre} · {a.fecha_actividad
                      ? new Date(a.fecha_actividad).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#F0F0F0]">
                  <Field label="Fecha" value={a.fecha_actividad
                    ? new Date(a.fecha_actividad).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'} />
                  <Field label="Hora" value={a.fecha_actividad
                    ? new Date(a.fecha_actividad).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                    : '—'} />
                  <Field label="Tipo" value={tipo} />
                  {a.usuario?.nombre && <Field label="Ejecutivo" value={a.usuario.nombre} />}
                </div>
              </div>

              {/* Datos */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Datos de la actividad</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {a.lead && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Relacionado con" value="Lead" />
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Lead</div>
                        <span className="text-[13.5px] text-[#24388C] font-medium cursor-pointer hover:underline"
                          onClick={() => navigate(`/leads/${a.lead.id}`)}>
                          {a.lead.nombre}
                        </span>
                      </div>
                    </div>
                  )}
                  {a.oportunidad && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Relacionado con" value="Oportunidad" />
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Oportunidad</div>
                        <span className="text-[13.5px] text-[#24388C] font-medium cursor-pointer hover:underline"
                          onClick={() => navigate(`/oportunidades/${a.oportunidad.id}`)}>
                          {a.oportunidad.nombre}
                        </span>
                      </div>
                    </div>
                  )}
                  {a.empresa && <Field label="Empresa" value={a.empresa} />}
                  <Field label="Descripción" value={a.descripcion} />
                </div>
              </div>

              {/* Resultado */}
              {completada && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#F0F0F0] flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">Resultado</span>
                    <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#1A8754]">
                      Completada
                    </span>
                  </div>
                  <div className="px-5 py-4 text-[14px] text-[#1A1A1A] leading-relaxed">
                    {a.resultado}
                  </div>
                </div>
              )}
            </div>

            {/* ── Side panel ── */}
            <div className="w-full lg:w-[272px] flex-shrink-0 flex flex-col gap-4">

              {a.oportunidad && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-bold text-[#ABABAB] uppercase tracking-wider mb-3">Oportunidad</div>
                  <div className="text-[13.5px] font-bold text-[#1A1A1A] mb-1">{a.oportunidad.nombre}</div>
                  <div className="text-[12px] text-[#6B6B6B] mb-3">{a.oportunidad.tipo} · {a.oportunidad.estado}</div>
                  <button onClick={() => navigate(`/oportunidades/${a.oportunidad.id}`)}
                    className="w-full py-1.5 text-[12.5px] font-semibold border border-[#D5D5D5] rounded-md text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all">
                    Ver oportunidad →
                  </button>
                </div>
              )}

              {a.lead && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-bold text-[#ABABAB] uppercase tracking-wider mb-3">Lead</div>
                  <div className="text-[13.5px] font-bold text-[#1A1A1A] mb-3">{a.lead.nombre}</div>
                  <button onClick={() => navigate(`/leads/${a.lead.id}`)}
                    className="w-full py-1.5 text-[12.5px] font-semibold border border-[#D5D5D5] rounded-md text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all">
                    Ver lead →
                  </button>
                </div>
              )}

              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-bold text-[#ABABAB] uppercase tracking-wider mb-3">Información</div>
                <dl className="flex flex-col gap-2.5">
                  {[
                    ['ID',          a.id ? `ACT-${a.id}` : '—'],
                    ['Canal',       tipo],
                    ['Modalidad',   a.virtual ? 'Virtual' : 'Presencial'],
                    ['Registrado por', a.usuario?.nombre ?? '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-2">
                      <dt className="text-[12px] text-[#ABABAB] flex-shrink-0">{k}</dt>
                      <dd className="text-[12.5px] font-medium text-[#1A1A1A] text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-bold text-[#ABABAB] uppercase tracking-wider mb-3">Acciones</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigate(`/actividades/${id}/editar`)}
                    className="w-full py-2 text-[13px] font-semibold border border-[#D5D5D5] rounded-md text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all">
                    Editar actividad
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
