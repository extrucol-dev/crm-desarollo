import { useState, useEffect } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { metasAPI } from '../services/metasAPI'

const formatCOP = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000) return `$ ${(n / 1_000_000).toFixed(0)} M`
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

const META_ICONS = {
  ventas: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  oportunidades: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  actividades: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
}

function MetaCard({ meta }) {
  const pct    = meta.pct ?? 0
  const superada = pct >= 100
  const colorClass = superada ? '#1A8754' : pct >= 75 ? '#F39610' : '#C0392B'
  const color  = meta.color ?? colorClass
  const iconBg = meta.color === '#1A8754' ? '#E8F5EE'
               : meta.color === '#F39610' ? '#FFF4E0'
               : '#EEF1FA'

  return (
    <div className="relative bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg, color }}>
            {META_ICONS[meta.tipo] ?? META_ICONS.actividades}
          </div>
          <span className="text-[10px] font-bold text-white bg-[#24388C] px-2 py-0.5 rounded-full">
            Del sistema
          </span>
        </div>
        <div className="text-[14px] font-bold text-[#1A1A1A] mb-0.5">{meta.titulo}</div>
        <div className="text-[11.5px] text-[#6B6B6B] mb-4">{meta.descripcion}</div>

        <div className="flex items-baseline justify-between mb-1.5">
          <div>
            <span className="text-[22px] font-extrabold tracking-tight" style={{ color }}>
              {meta.tipo === 'ventas' ? formatCOP(meta.actual) : meta.actual}
            </span>
            <span className="text-[12px] text-[#6B6B6B] ml-1">
              / {meta.tipo === 'ventas' ? formatCOP(meta.meta) : `${meta.meta} ${meta.unidad ?? ''}`}
            </span>
          </div>
          <span className="text-[13px] font-bold" style={{ color }}>
            {pct}%
            {superada && (
              <span className="ml-1 text-[10px] font-bold bg-[#E8F5EE] text-[#1A8754] px-1.5 py-0.5 rounded">✓ Superada</span>
            )}
          </span>
        </div>

        <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
        </div>

        {meta.nota && (
          <div className="text-[11.5px] text-[#6B6B6B]">{meta.nota}</div>
        )}
        {superada && !meta.nota && (
          <div className="text-[11.5px] font-semibold" style={{ color: '#1A8754' }}>
            ✓ Meta superada
          </div>
        )}
      </div>
    </div>
  )
}

function HeroRing({ pct = 0 }) {
  return (
    <div className="relative w-36 h-36 rounded-full flex-shrink-0"
      style={{ background: `conic-gradient(#F39610 0 ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}>
      <div className="absolute inset-2.5 rounded-full" style={{ background: '#1B2C6B' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[38px] font-extrabold text-white tracking-tight leading-none">{pct}%</span>
        <span className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mt-1">Completado</span>
      </div>
    </div>
  )
}

export default function MisMetasPage() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    metasAPI.misMetas()
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const resumen  = data?.resumen  ?? {}
  const metas    = data?.metas    ?? []
  const historico = data?.historico ?? []
  const pctGlobal = resumen.pct_global ?? 90
  const nombre   = resumen.nombre ?? 'Ejecutivo'

  const colorHist = (pct) => pct >= 100 ? '#1A8754' : pct >= 80 ? '#1A8754' : pct >= 65 ? '#F39610' : '#C0392B'

  return (
    <AppLayout>
      <Topbar title="Mis metas" />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        {loading && <LoadingSpinner label="Cargando metas..." />}
        {!loading && (
          <>
            {/* ── Hero ── */}
            <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #24388C 0%, #1B2C6B 100%)' }}>
              <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(243,150,16,0.25) 0%, transparent 70%)' }} />
              <div className="relative flex items-center gap-8 flex-wrap">
                <HeroRing pct={pctGlobal} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1.5">
                    Progreso global del mes
                  </div>
                  <div className="text-[26px] font-extrabold text-white leading-tight mb-2">
                    ¡Buen ritmo, {nombre}!{' '}
                    <span style={{ color: '#F39610' }}>
                      {pctGlobal >= 100 ? 'Meta superada' : pctGlobal >= 80 ? 'Vas en buen camino' : 'Sigue adelante'}
                    </span>
                  </div>
                  <div className="text-[14px] text-white/80 max-w-xl leading-relaxed mb-4">
                    Has completado el {pctGlobal}% de tus metas del sistema este mes.
                    {pctGlobal >= 80
                      ? ' Si mantienes este ritmo, cerrarás con cumplimiento completo.'
                      : ' Enfócate en tus actividades prioritarias para alcanzar la meta.'}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {resumen.ranking && (
                      <div className="px-4 py-2.5 rounded-lg flex flex-col" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <span className="text-[10px] text-white/70 uppercase font-semibold tracking-wide">Ranking equipo</span>
                        <span className="text-[17px] font-extrabold text-white">
                          #{resumen.ranking.posicion} de {resumen.ranking.total}
                        </span>
                      </div>
                    )}
                    {resumen.racha_meses != null && (
                      <div className="px-4 py-2.5 rounded-lg flex flex-col" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <span className="text-[10px] text-white/70 uppercase font-semibold tracking-wide">Racha</span>
                        <span className="text-[17px] font-extrabold text-white">{resumen.racha_meses} meses</span>
                      </div>
                    )}
                    {resumen.proyeccion && (
                      <div className="px-4 py-2.5 rounded-lg flex flex-col" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <span className="text-[10px] text-white/70 uppercase font-semibold tracking-wide">Proyección mes</span>
                        <span className="text-[17px] font-extrabold text-white">
                          {resumen.proyeccion.valor ? formatCOP(resumen.proyeccion.valor) : '—'}
                          <span className="text-[11px] text-white/70 ml-1">({resumen.proyeccion.pct}%)</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Meta cards ── */}
            <div className="mb-5">
              <div className="text-[15px] font-bold text-[#1A1A1A] mb-0.5">Metas del mes</div>
              <div className="text-[12px] text-[#6B6B6B] mb-4">Metas del sistema asignadas este mes</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {metas.map((m, i) => <MetaCard key={m.tipo ?? i} meta={m} />)}
              </div>
            </div>

            {/* ── Histórico ── */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F0F0]">
                <div className="text-[14px] font-bold text-[#1A1A1A]">Histórico de cumplimiento</div>
                <div className="text-[12px] text-[#6B6B6B]">Últimos meses · % de cumplimiento global</div>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {historico.map((h, i) => {
                  const color = colorHist(h.pct)
                  return (
                    <div key={i} className={`px-5 py-3 ${h.actual ? 'bg-[#EEF1FA]' : ''}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[#1A1A1A]">{h.mes}</span>
                          {h.actual && (
                            <span className="text-[10px] font-bold text-[#24388C] bg-[#EEF1FA] border border-[#c5cfed] px-1.5 py-0.5 rounded-full">
                              En curso
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[12px]">
                          <span className="text-[#6B6B6B]">{h.valor} / {h.meta}</span>
                          <span className="font-bold text-[13px] w-10 text-right" style={{ color }}>{h.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(h.pct, 100)}%`, background: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="px-5 py-3 border-t border-[#F0F0F0] flex justify-between text-[12.5px]">
                <span className="text-[#6B6B6B]">Promedio del período</span>
                <span className="font-bold text-[#1A8754]">
                  {Math.round(historico.reduce((s, h) => s + h.pct, 0) / historico.length)}% cumplimiento
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
