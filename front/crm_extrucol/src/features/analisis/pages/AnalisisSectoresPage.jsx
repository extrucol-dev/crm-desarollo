import { useState, useEffect, useMemo } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { analisisAPI } from '../services/analisisAPI'

const formatCOP = (n) => {
  if (!n) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n * 1_000_000)
}

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

function StatCard({ label, value, color = '#24388C', subtext }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[24px] font-extrabold tracking-tight" style={{ color }}>{value}</div>
      {subtext && <div className="text-[12px] text-[#6B6B6B] mt-1">{subtext}</div>}
    </div>
  )
}

function SectorCard({ s }) {
  const trendUp = parseInt(s.tendencia) >= 0
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden relative">
      <div className="h-1 w-full" style={{ background: s.color }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 8.586" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-extrabold text-[#1A1A1A]">{s.nombre}</div>
            <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.desc}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-[12px] font-bold ${trendUp ? 'text-[#1A8754]' : 'text-[#C0392B]'}`}>
              {trendUp ? '▲' : '▼'} {s.tendencia}%
            </div>
            <div className="text-[10px] text-[#ABABAB] uppercase font-semibold tracking-wider">YoY</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB] mb-1">Pipeline del sector</div>
          <div className="text-[28px] font-extrabold tracking-tight" style={{ color: s.color }}>
            $ {s.pipelineM} M
          </div>
          <div className="text-[12px] text-[#6B6B6B]">
            {s.pct}% del total · {s.oppActivas} oportunidades activas
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F0F0F0]">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB]">Ganadas</div>
            <div className="text-[15px] font-bold text-[#1A1A1A] mt-0.5">{s.ganadas}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB]">Ventas acum.</div>
            <div className="text-[15px] font-bold text-[#F39610] mt-0.5">$ {s.ventasAcum} M</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB]">Ticket prom.</div>
            <div className="text-[15px] font-bold text-[#1A1A1A] mt-0.5">$ {s.ticketProm} M</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB]">Conversión</div>
            <div className={`text-[15px] font-bold mt-0.5 ${s.conversion >= 35 ? 'text-[#1A8754]' : 'text-[#F39610]'}`}>
              {s.conversion}%
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB] mb-3">Top 3 clientes</div>
          {s.topClientes.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ background: avatarColor(c.name) }}>
                {initials(c.name)}
              </div>
              <span className="flex-1 text-[12.5px] font-medium text-[#1A1A1A] truncate">{c.name}</span>
              <span className="text-[12px] font-bold text-[#F39610]">$ {c.val} M</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AnalisisSectoresPage() {
  const [sectores, setSectores] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('2026')
  const [showComparar, setShowComparar] = useState(false)

  useEffect(() => {
    setLoading(true)
    analisisAPI.sectores({ periodo })
      .then(data => setSectores(Array.isArray(data) && data.length ? data : []))
      .catch(() => setSectores([]))
      .finally(() => setLoading(false))
  }, [periodo])

  const totalPipeline = useMemo(() =>
    sectores.reduce((a, s) => a + (s.pipelineM ?? s.pipeline ?? 0), 0), [sectores])

  const totalOppActivas = useMemo(() =>
    sectores.reduce((a, s) => a + (s.oppActivas ?? s.opp_activas ?? 0), 0), [sectores])

  const lider = useMemo(() =>
    [...sectores].sort((a, b) => (b.pipelineM ?? b.pipeline ?? 0) - (a.pipelineM ?? a.pipeline ?? 0))[0], [sectores])

  const mayorCrecimiento = useMemo(() =>
    [...sectores].sort((a, b) => parseInt(b.tendencia ?? 0) - parseInt(a.tendencia ?? 0))[0], [sectores])

  const oportunidadesCount = useMemo(() => sectores.reduce((a, s) => a + (s.oppActivas ?? s.opp_activas ?? 0), 0), [sectores])

  const topCliente = useMemo(() => {
    const all = sectores.flatMap(s => (s.topClientes ?? []).map(c => ({ ...c, sector: s.nombre })))
    return [...all].sort((a, b) => (b.val ?? 0) - (a.val ?? 0))[0]
  }, [sectores])

  const insights = useMemo(() => {
    const list = []
    if (lider) list.push({ color: lider.color ?? '#24388C', title: `${lider.nombre ?? 'Sector'} lidera`, note: `Pipeline de $${lider.pipelineM ?? lider.pipeline ?? 0}M · ${lider.oppActivas ?? lider.opp_activas ?? 0} oportunidades activas` })
    if (mayorCrecimiento && mayorCrecimiento !== lider) list.push({ color: '#22C55E', title: 'Crecimiento detectado', note: `Sector ${mayorCrecimiento.nombre} con tendencia ${mayorCrecimiento.tendencia > 0 ? '+' : ''}${mayorCrecimiento.tendencia}%` })
    if (topCliente) list.push({ color: '#F39610', title: 'Top cliente', note: `${topCliente.name} (${topCliente.sector})` })
    if (sectores.length > 0) list.push({ color: '#6366F1', title: `${sectores.length} sectores activos`, note: `${oportunidadesCount} oportunidades en pipeline` })
    return list
  }, [sectores, lider, mayorCrecimiento, topCliente, oportunidadesCount])

  const recomendaciones = useMemo(() => {
    return sectores.map(s => ({ color: s.color ?? '#24388C', title: s.nombre ?? s.nombre_sector ?? 'Sin nombre', note: `${s.oppActivas ?? s.opp_activas ?? 0} opp. activas · $${s.pipelineM ?? s.pipeline ?? 0}M pipeline` }))
  }, [sectores])

  return (
    <AppLayout>
      <Topbar title="Análisis por sectores" />
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-[18px] font-extrabold text-[#1A1A1A]">Análisis por sectores</h1>
            <p className="text-[12.5px] text-[#6B6B6B]">Rendimiento del negocio segmentado por sector económico</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none focus:border-[#24388C] transition-all"
              value={periodo}
              onChange={e => setPeriodo(e.target.value)}
            >
              <option value="2026">Año 2026</option>
              <option value="2025">Año 2025</option>
              <option value="Q1-2026">Q1 2026</option>
              <option value="Q2-2026">Q2 2026</option>
            </select>
            <button className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7] transition-all text-nowrap">
              Exportar PDF
            </button>
            <button
              onClick={() => setShowComparar(true)}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all text-nowrap"
            >
              Comparar
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner label="Cargando análisis..." />}

        {!loading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StatCard
                label="Pipeline global"
                value={`$ ${totalPipeline.toLocaleString()} M`}
                color="#F39610"
                subtext={<span className="text-[#1A8754] font-semibold">+15%</span>}
              />
              <StatCard
                label="Ventas totales"
                value={`$ ${totalPipeline.toLocaleString()} M`}
                color="#1A8754"
                subtext={`${sectores.reduce((a, s) => a + (s.ganadas ?? 0), 0)} oportunidades ganadas`}
              />
              <StatCard
                label="Sector líder"
                value={lider?.nombre ?? '—'}
                color="#24388C"
                subtext={`${lider?.pct ?? 0}% del pipeline total`}
              />
              <StatCard
                label="Mayor crecimiento"
                value={mayorCrecimiento?.nombre ?? '—'}
                color="#1A8754"
                subtext={<span className="text-[#1A8754] font-semibold">{mayorCrecimiento?.tendencia ?? '—'} YoY</span>}
              />
            </div>

            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5 mb-4">
              <div className="text-[13.5px] font-bold text-[#1A1A1A] mb-3">Participación en el pipeline</div>
              <div className="flex h-9 rounded-lg overflow-hidden shadow-inner" style={{ background: '#F0F0F0' }}>
                {sectores.map(s => (
                  <div
                    key={s.nombre}
                    className="flex items-center justify-center text-[11.5px] font-bold text-white"
                    style={{ background: s.color, flex: s.pct ?? 1 }}
                    title={`${s.nombre}: ${s.pct}%`}
                  >
                    {s.pct > 8 ? `${s.pct}%` : ''}
                  </div>
                ))}
              </div>
              <div className="flex gap-5 flex-wrap mt-3">
                {sectores.map(s => (
                  <div key={s.nombre} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded" style={{ background: s.color }} />
                    <span className="text-[12.5px] font-semibold text-[#4A4A4A]">{s.nombre}</span>
                    <span className="text-[12px] text-[#6B6B6B]">$ {s.pipelineM ?? s.pipeline} M</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {sectores.map(s => <SectorCard key={s.nombre} s={s} />)}
            </div>

            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden mb-4">
              <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Comparativo de rendimiento</div>
                  <div className="text-[12px] text-[#6B6B6B]">Métricas clave lado a lado · ordenadas por pipeline</div>
                </div>
                <button className="text-[12px] font-semibold text-[#24388C] hover:underline">Exportar tabla</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-[#ABABAB] font-semibold border-b border-[#F0F0F0]">
                      <th className="text-left px-5 py-3">Sector</th>
                      <th className="text-right px-3 py-3">Pipeline</th>
                      <th className="text-center px-3 py-3">% Total</th>
                      <th className="text-center px-3 py-3">Opp. activas</th>
                      <th className="text-center px-3 py-3">Ganadas</th>
                      <th className="text-right px-3 py-3">Ventas acum.</th>
                      <th className="text-center px-3 py-3">Conversión</th>
                      <th className="text-center px-5 py-3">Tendencia YoY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0]">
                    {sectores.map(s => (
                      <tr key={s.nombre} className="hover:bg-[#F7F9FF] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                            <span className="font-semibold text-[#1A1A1A]">{s.nombre}</span>
                          </div>
                        </td>
                        <td className="text-right px-3 py-3.5 font-bold text-[#F39610]">$ {s.pipelineM} M</td>
                        <td className="text-center px-3 py-3.5 font-semibold">{s.pct}%</td>
                        <td className="text-center px-3 py-3.5">{s.oppActivas}</td>
                        <td className="text-center px-3 py-3.5 font-bold text-[#1A8754]">{s.ganadas}</td>
                        <td className="text-right px-3 py-3.5 font-semibold">$ {s.ventasAcum} M</td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{
                                width: `${s.conversion}%`,
                                background: s.conversion >= 35 ? '#1A8754' : '#F39610'
                              }} />
                            </div>
                            <span className="font-bold text-[13px] min-w-[32px]">{s.conversion}%</span>
                          </div>
                        </td>
                        <td className="text-center px-5 py-3.5">
                          <span className={`font-bold text-[12px] ${parseInt(s.tendencia) >= 0 ? 'text-[#1A8754]' : 'text-[#C0392B]'}`}>
                            {parseInt(s.tendencia) >= 0 ? '▲' : '▼'} {s.tendencia}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#F7F7F7] font-bold">
                      <td className="px-5 py-3.5 text-[#1A1A1A]">TOTAL</td>
                      <td className="text-right px-3 py-3.5 text-[#F39610] font-extrabold">$ {totalPipeline.toLocaleString()} M</td>
                      <td className="text-center px-3 py-3.5">100%</td>
                      <td className="text-center px-3 py-3.5">{totalOppActivas}</td>
                      <td className="text-center px-3 py-3.5 text-[#1A8754]">{sectores.reduce((a, s) => a + (s.ganadas ?? 0), 0)}</td>
                      <td className="text-right px-3 py-3.5 text-[#1A8754] font-extrabold">$ {totalPipeline.toLocaleString()} M</td>
                      <td className="text-center px-3 py-3.5">{Math.round(sectores.reduce((a, s) => a + (s.conversion ?? 0), 0) / sectores.length)}%</td>
                      <td className="text-center px-5 py-3.5"><span className="text-[#1A8754] font-bold">▲ +12%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Insights del período</div>
                  <div className="text-[12px] text-[#6B6B6B]">Análisis automático basado en datos</div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {insights.length > 0 ? insights.map((ins, i) => (
                    <div key={i} className="p-3 bg-[#EEF1FA] border-l-3 border-[#24388C] rounded" style={{ borderLeftWidth: 3 }}>
                      <div className="font-bold text-[13px] text-[#24388C] mb-1">◆ {ins.title}</div>
                      <div className="text-[12.5px] text-[#4A4A4A] leading-relaxed">{ins.note}</div>
                    </div>
                  )) : (
                    <div className="text-[12.5px] text-[#ABABAB]">Sin datos disponibles</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Recomendaciones estratégicas</div>
                  <div className="text-[12px] text-[#6B6B6B]">Acciones sugeridas por sector</div>
                </div>
                <div className="p-5 flex flex-col">
                  {recomendaciones.length > 0 ? recomendaciones.map((r, i) => (
                    <div key={i} className={`flex items-start gap-3 py-3 ${i < 3 ? 'border-b border-[#F0F0F0]' : ''}`}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: r.color }} />
                      <div>
                        <div className="font-semibold text-[13px] text-[#1A1A1A]">{r.title}</div>
                        <div className="text-[12px] text-[#6B6B6B]">{r.note}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-[12px] text-[#ABABAB]">Sin datos disponibles</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showComparar && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-6 z-50" onClick={e => e.target === e.currentTarget && setShowComparar(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F0F0F0] flex items-center gap-3">
              <div className="flex-1">
                <div className="font-bold text-[16px] text-[#1A1A1A]">Comparación de sectores</div>
                <div className="text-[12.5px] text-[#6B6B6B]">Selecciona hasta 3 sectores para comparar lado a lado</div>
              </div>
              <button onClick={() => setShowComparar(false)} className="text-[#6B6B6B] hover:text-[#1A1A1A]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-[#ABABAB] font-semibold border-b border-[#F0F0F0]">
                    <th className="text-left py-3 pr-4">Métrica</th>
                    {sectores.slice(0, 3).map(s => (
                      <th key={s.nombre} className="text-center px-4 py-3" style={{ color: s.color }}>{s.nombre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {[
                    { metric: 'Pipeline', get: s => `$ ${s.pipelineM ?? s.pipeline} M` },
                    { metric: '% del total', get: s => `${s.pct}%` },
                    { metric: 'Opp. activas', get: s => String(s.oppActivas ?? 0) },
                    { metric: 'Ganadas', get: s => String(s.ganadas ?? 0) },
                    { metric: 'Ventas acumuladas', get: s => `$ ${s.ventasAcum} M` },
                    { metric: 'Ticket promedio', get: s => `$ ${s.ticketProm} M` },
                    { metric: 'Tasa conversión', get: s => `${s.conversion}%` },
                    { metric: 'Tendencia YoY', get: s => `${s.tendencia}%` },
                  ].map(row => (
                    <tr key={row.metric}>
                      <td className="py-3.5 pr-4 font-semibold text-[#1A1A1A]">{row.metric}</td>
                      {sectores.slice(0, 3).map(s => (
                        <td key={s.nombre} className="text-center px-4 py-3.5 font-bold text-[#1A1A1A]">{row.get(s)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-2 bg-[#F7F7F7]">
              <button onClick={() => setShowComparar(false)} className="px-4 py-2 rounded-md text-[13px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] hover:bg-[#F0F0F0]">Cerrar</button>
              <button className="px-4 py-2 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B]">Exportar comparación</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}