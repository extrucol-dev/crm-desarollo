import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { analisisAPI } from '../services/analisisAPI'

const MONTHS_DEFAULT = [
  { month: 'Feb', real: 820, optimista: null, esperada: null, pesimista: null },
  { month: 'Mar', real: 1080, optimista: null, esperada: null, pesimista: null },
  { month: 'Abr', real: 1240, optimista: null, esperada: null, pesimista: null },
  { month: 'May', real: null, optimista: 1380, esperada: 1100, pesimista: 820 },
  { month: 'Jun', real: null, optimista: 1720, esperada: 1400, pesimista: 1050 },
  { month: 'Jul', real: null, optimista: 1150, esperada: 890, pesimista: 640 },
  { month: 'Ago', real: null, optimista: 1320, esperada: 1020, pesimista: 720 },
  { month: 'Sep', real: null, optimista: 1480, esperada: 1180, pesimista: 830 },
]

const PROB_BUCKETS = [
  { range: '90-100%', label: 'Compromiso cliente', count: 8, value: 680, color: '#1A8754' },
  { range: '70-89%', label: 'Alta probabilidad', count: 14, value: 1120, color: '#3B82F6' },
  { range: '50-69%', label: 'Media probabilidad', count: 22, value: 1580, color: '#F39610' },
  { range: '30-49%', label: 'Baja probabilidad', count: 15, value: 980, color: '#A855F7' },
  { range: '< 30%', label: 'Incierto', count: 6, value: 460, color: '#C0392B' },
]

const FACTORES = [
  { factor: 'Histórico de precisión', score: 82, note: 'Forecasts pasados con error < 10%' },
  { factor: 'Frescura del pipeline', score: 75, note: '87% de opp actualizadas esta semana' },
  { factor: 'Tamaño de muestra', score: 88, note: '65 oportunidades activas' },
  { factor: 'Diversificación sectores', score: 70, note: 'Concentración máxima 30%' },
  { factor: 'Estabilidad del equipo', score: 65, note: '6 ejecutivos · 2 bajo meta' },
]

const TOP_OPPS = [
  { op: 'Licitación acueducto Bucaramanga', emp: 'EMPAS S.A.', execName: 'María García', exec: 'MG', color: 3, valor: 560, prob: 75, cierre: '30 Abr', urgent: true },
  { op: 'Proyecto acueducto rural', emp: 'EMPAS S.A.', execName: 'Juan Pérez', exec: 'JP', color: 1, valor: 485, prob: 65, cierre: '25 Abr', urgent: true },
  { op: 'Suministro anual tubería', emp: 'Constructora Andina', execName: 'Juan Pérez', exec: 'JP', color: 1, valor: 420, prob: 65, cierre: '15 May' },
  { op: 'Línea conducción 8km', emp: 'Distriaguas Caribe', execName: 'Laura Jiménez', exec: 'LJ', color: 2, valor: 380, prob: 70, cierre: '05 May' },
  { op: 'Ampliación red matriz', emp: 'Acueducto Metropolitano', execName: 'Ana Martínez', exec: 'AM', color: 4, valor: 340, prob: 40, cierre: '10 Jun' },
  { op: 'Gasoducto Santa Marta', emp: 'Gas Natural Fenosa', execName: 'María García', exec: 'MG', color: 3, valor: 320, prob: 60, cierre: '20 May' },
  { op: 'Red gas sector norte', emp: 'Hidgas', execName: 'Laura Jiménez', exec: 'LJ', color: 2, valor: 280, prob: 75, cierre: '08 May' },
  { op: 'Sistema riego Palmeras', emp: 'Palmares del Sur', execName: 'Ana Martínez', exec: 'AM', color: 4, valor: 225, prob: 55, cierre: '25 May' },
  { op: 'Tubería industrial Ecopetrol', emp: 'Ecopetrol', execName: 'Carlos Rodríguez', exec: 'CR', color: 5, valor: 215, prob: 50, cierre: '30 Jun' },
  { op: 'Sistema presurizado', emp: 'Ingenio del Cauca', execName: 'María García', exec: 'MG', color: 3, valor: 180, prob: 50, cierre: '20 May' },
]

const COLORS_AV = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS_AV[n.charCodeAt(0) % COLORS_AV.length]

function StatCard({ label, value, color = '#24388C', subtext, icon }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: icon.bg, color: icon.color }}>{icon.svg}</span>}
        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider">{label}</div>
      </div>
      <div className="text-[22px] font-extrabold tracking-tight" style={{ color }}>{value}</div>
      {subtext && <div className="text-[12px] text-[#6B6B6B] mt-1">{subtext}</div>}
    </div>
  )
}

function ScenarioCard({ type, label, value, sublabel }) {
  const styles = {
    best: { border: 'border-[#1A8754]', bg: '#F4FBF7', badgeColor: '#1A8754', labelColor: '#1A8754', valueColor: '#1A8754' },
    expected: { border: 'border-[#24388C]', bg: '#EEF1FA', badgeColor: '#24388C', labelColor: '#24388C', valueColor: '#24388C' },
    worst: { border: 'border-[#C0392B]', bg: '#FEF4F3', badgeColor: '#C0392B', labelColor: '#C0392B', valueColor: '#C0392B' },
  }[type]
  return (
    <div className={`rounded-xl border-2 ${styles.border} ${styles.bg} p-4 text-center relative`}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ color: styles.badgeColor }}>
        {label}
      </div>
      <div className="mt-2">
        <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: styles.labelColor }}>{sublabel}</div>
        <div className="text-[22px] font-extrabold mt-1" style={{ color: styles.valueColor }}>{value}</div>
      </div>
    </div>
  )
}

function CircularGauge({ value }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#F0F0F0" strokeWidth="12" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke="#1A8754" strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[32px] font-extrabold text-[#1A8754]">{value}%</div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#ABABAB]">Confianza</div>
      </div>
    </div>
  )
}

export default function ForecastingPage() {
  const navigate = useNavigate()
  const [meses, setMeses] = useState('6')
  const [monthsData, setMonthsData] = useState(MONTHS_DEFAULT)
  const [loading, setLoading] = useState(true)
  const [showFiltros, setShowFiltros] = useState(false)

  useEffect(() => {
    analisisAPI.forecast({ meses })
      .then(data => {
        if (data && data.meses) {
          setMonthsData(data.meses)
        } else {
          setMonthsData(MONTHS_DEFAULT)
        }
      })
      .catch(() => setMonthsData(MONTHS_DEFAULT))
      .finally(() => setLoading(false))
  }, [meses])

  const MAX_Y = 1800
  const SVG_W = 100
  const SVG_H = 100
  const xStep = SVG_W / (monthsData.length - 1)

  const buildPoly = (key) =>
    monthsData
      .map((m, i) => m[key] !== null ? `${i * xStep},${SVG_H - (m[key] / MAX_Y * SVG_H)}` : null)
      .filter(Boolean)
      .join(' ')

  const realPts = buildPoly('real')
  const optPts = buildPoly('optimista')
  const espPts = buildPoly('esperada')
  const pesPts = buildPoly('pesimista')

  const pivotIdx = monthsData.findIndex(m => m.real !== null && monthsData[monthsData.indexOf(m) + 1]?.real === null)
  const pivotX = pivotIdx >= 0 ? pivotIdx * xStep : 0
  const pivotY = pivotIdx >= 0 ? SVG_H - (monthsData[pivotIdx].real / MAX_Y * SVG_H) : 0

  const totalEsperado = monthsData.filter(m => m.esperada !== null).reduce((a, m) => a + (m.esperada ?? 0), 0)
  const totalOpt = monthsData.filter(m => m.optimista !== null).reduce((a, m) => a + (m.optimista ?? 0), 0)
  const totalPes = monthsData.filter(m => m.pesimista !== null).reduce((a, m) => a + (m.pesimista ?? 0), 0)
  const pipelinePonderado = 2940

  const q2Total = { opt: 4250, esp: 3390, pes: 2510 }
  const q3Total = { opt: 3900, esp: 3200, pes: 2400 }

  const confianzaPromedio = Math.round(FACTORES.reduce((a, f) => a + f.score, 0) / FACTORES.length)

  return (
    <AppLayout>
      <Topbar title="Forecasting" />
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-[18px] font-extrabold text-[#1A1A1A]">Forecasting</h1>
            <p className="text-[12.5px] text-[#6B6B6B]">Proyección de ventas basada en pipeline ponderado · Horizonte {meses} meses</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none focus:border-[#24388C]"
              value={meses} onChange={e => setMeses(e.target.value)}>
              <option value="6">6 meses</option>
              <option value="3">3 meses</option>
              <option value="12">12 meses</option>
            </select>
            <button className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7]">Configurar</button>
            <button className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7]">Exportar</button>
            <button className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B]">Comparar</button>
          </div>
        </div>

        {loading && <LoadingSpinner label="Cargando forecast..." />}

        {!loading && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StatCard
                label="Ventas proyectadas Q2+Q3"
                value={`$ ${totalEsperado.toLocaleString()} M`}
                color="#F39610"
                subtext="Escenario esperado"
              />
              <StatCard
                label="Mejor escenario"
                value={`$ ${totalOpt.toLocaleString()} M`}
                color="#1A8754"
                subtext={`+${Math.round((totalOpt - totalEsperado) / totalEsperado * 100)}% vs esperado`}
                icon={{ bg: '#E8F5EE', color: '#1A8754', svg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> }}
              />
              <StatCard
                label="Peor escenario"
                value={`$ ${totalPes.toLocaleString()} M`}
                color="#C0392B"
                subtext={`-${Math.round((totalEsperado - totalPes) / totalEsperado * 100)}% vs esperado`}
                icon={{ bg: '#FDECEA', color: '#C0392B', svg: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.694-4.5m5.036-1.053l4.306-1.22M2.25 18l-4.5-4.5m0 0l5.94 2.28m-5.94-2.28l2.28 5.94" /></svg> }}
              />
              <StatCard
                label="Pipeline ponderado"
                value={`$ ${pipelinePonderado.toLocaleString()} M`}
                color="#24388C"
                subtext="$ 4.820 M en pipeline × prob."
              />
            </div>

            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm mb-4">
              <div className="px-5 py-4 border-b border-[#F0F0F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Proyección de ventas mensuales</div>
                  <div className="text-[12px] text-[#6B6B6B]">Línea continua: datos reales · Líneas discontinuas: proyecciones</div>
                </div>
                <select className="text-[12.5px] px-3 py-1.5 border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none">
                  <option>Todos los sectores</option>
                  <option>Agua Potable</option>
                  <option>Gas Natural</option>
                </select>
              </div>
              <div className="px-6 pb-4">
                <div className="relative h-72">
                  <div className="absolute top-4 right-10 flex gap-4 bg-white border border-[#F0F0F0] rounded-lg px-3 py-1.5 text-[11.5px]">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#24388C] inline-block"></span> Real</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1A8754] inline-block"></span> Optimista</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#F39610] inline-block"></span> Esperado</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#C0392B] inline-block"></span> Pesimista</span>
                  </div>

                  <svg className="w-full h-full" viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#F39610" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#F39610" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {[450, 900, 1350, 1800].map(v => (
                      <line key={v} x1="0" y1={SVG_H - v / MAX_Y * SVG_H} x2={SVG_W} y2={SVG_H - v / MAX_Y * SVG_H}
                        stroke="#E5E5E5" strokeWidth="0.3" strokeDasharray="1,1" />
                    ))}

                    <polygon
                      points={`${pivotX},${pivotY} ${optPts} ${pesPts.split(' ').reverse().join(' ')}`}
                      fill="url(#areaGrad)"
                    />

                    <polyline points={`${pivotX},${pivotY} ${optPts}`} fill="none" stroke="#1A8754" strokeWidth="1.5" strokeDasharray="2,1.5" />
                    <polyline points={`${pivotX},${pivotY} ${espPts}`} fill="none" stroke="#F39610" strokeWidth="2" strokeDasharray="3,1.5" />
                    <polyline points={`${pivotX},${pivotY} ${pesPts}`} fill="none" stroke="#C0392B" strokeWidth="1.5" strokeDasharray="2,1.5" />
                    <polyline points={realPts} fill="none" stroke="#24388C" strokeWidth="2.5" />

                    {monthsData.map((m, i) => m.real !== null && (
                      <circle key={i} cx={i * xStep} cy={SVG_H - m.real / MAX_Y * SVG_H} r="2" fill="#24388C" stroke="white" strokeWidth="0.5" />
                    ))}
                  </svg>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[11px] text-[#ABABAB] font-semibold uppercase tracking-wider">
                    {monthsData.map(m => <span key={m.month}>{m.month}</span>)}
                  </div>
                </div>
                <div className="text-center pt-2 text-[11px] text-[#ABABAB]">
                  <span className="px-2 py-0.5 bg-[#F7F7F7] rounded">← Histórico | Proyección →</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm mb-4">
              <div className="px-5 py-4 border-b border-[#F0F0F0]">
                <div className="text-[14px] font-bold text-[#1A1A1A]">Escenarios por trimestre</div>
                <div className="text-[12px] text-[#6B6B6B]">Comparativa de los tres escenarios de cierre basados en probabilidad</div>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Q2 2026 (May-Jun-Jul)', ...q2Total },
                  { label: 'Q3 2026 (Ago-Sep-Oct)', ...q3Total },
                ].map(q => (
                  <div key={q.label}>
                    <div className="font-bold text-[13px] uppercase tracking-wider text-[#1A1A1A] mb-3">{q.label}</div>
                    <div className="grid grid-cols-3 gap-2">
                      <ScenarioCard type="best" label="Mejor" sublabel="Optimista ≥80%" value={`$ ${q.opt.toLocaleString()} M`} />
                      <ScenarioCard type="expected" label="★ Esperado" sublabel="Más probable ≥50%" value={`$ ${q.esp.toLocaleString()} M`} />
                      <ScenarioCard type="worst" label="Peor" sublabel="100% compromiso" value={`$ ${q.pes.toLocaleString()} M`} />
                    </div>
                    <div className="flex justify-between items-center mt-3 px-3 py-2 bg-[#F7F7F7] rounded-lg text-[12px]">
                      <span className="text-[#6B6B6B]">Delta del rango:</span>
                      <strong className="text-[#1A1A1A]">$ {(q.opt - q.pes).toLocaleString()} M <span className="font-normal text-[#6B6B6B]">±{Math.round((q.opt - q.esp) / q.esp * 100)}%</span></strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Distribución por probabilidad</div>
                  <div className="text-[12px] text-[#6B6B6B]">Oportunidades activas agrupadas por probabilidad de cierre</div>
                </div>
                <div className="p-5">
                  {PROB_BUCKETS.map((p, i) => {
                    const total = PROB_BUCKETS.reduce((a, x) => a + x.value, 0)
                    const pct = Math.round(p.value / total * 100)
                    return (
                      <div key={p.range} className={`py-2.5 ${i < 4 ? 'border-b border-[#F0F0F0]' : ''}`}>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                          <span className="font-bold text-[12.5px] text-[#1A1A1A] min-w-[60px]">{p.range}</span>
                          <span className="flex-1 text-[12px] text-[#6B6B6B] truncate">{p.label}</span>
                          <span className="font-bold text-[13px] text-[#F39610]">$ {p.value.toLocaleString()} M</span>
                          <span className="text-[11.5px] text-[#6B6B6B] min-w-[48px] text-right">{p.count} opp</span>
                        </div>
                        <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: p.color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Factores de confianza del forecast</div>
                  <div className="text-[12px] text-[#6B6B6B]">Calidad de los datos y precisión histórica</div>
                </div>
                <div className="p-5 flex flex-col items-center">
                  <CircularGauge value={confianzaPromedio} />
                  <div className="text-[12.5px] font-semibold text-[#1A8754] mt-2">Nivel alto de confianza</div>

                  <div className="w-full mt-4 pt-4 border-t border-[#F0F0F0] flex flex-col gap-3">
                    {FACTORES.map(f => (
                      <div key={f.factor}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[12.5px] font-semibold text-[#1A1A1A]">{f.factor}</span>
                          <span className={`font-bold text-[13px] ${f.score >= 80 ? 'text-[#1A8754]' : f.score >= 65 ? 'text-[#F39610]' : 'text-[#C0392B]'}`}>
                            {f.score}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${f.score}%`,
                            background: f.score >= 80 ? '#1A8754' : f.score >= 65 ? '#F39610' : '#C0392B'
                          }} />
                        </div>
                        <div className="text-[11px] text-[#6B6B6B] mt-0.5">{f.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm mb-4 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Oportunidades clave del forecast</div>
                  <div className="text-[12px] text-[#6B6B6B]">Top 10 oportunidades que más impactan la proyección</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowFiltros(!showFiltros)} className="px-3 py-1.5 rounded-md text-[12px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7]">Filtros</button>
                  <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7]">Exportar</button>
                </div>
              </div>

              {showFiltros && (
                <div className="px-5 py-4 bg-[#F7F7F7] border-b border-[#F0F0F0] flex flex-wrap gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B6B6B] mb-1">Sector</label>
                    <select className="text-[12.5px] px-3 py-1.5 border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none">
                      <option>Todos los sectores</option>
                      <option>Agua Potable</option>
                      <option>Gas Natural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B6B6B] mb-1">Ejecutivo</label>
                    <select className="text-[12.5px] px-3 py-1.5 border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none">
                      <option>Todos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B6B6B] mb-1">Probabilidad</label>
                    <select className="text-[12.5px] px-3 py-1.5 border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none">
                      <option>Todas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B6B6B] mb-1">Valor mínimo</label>
                    <input className="text-[12.5px] px-3 py-1.5 border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none w-32" placeholder="$ 0 M" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B6B6B] mb-1">Cierre hasta</label>
                    <input type="date" className="text-[12.5px] px-3 py-1.5 border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] outline-none" />
                  </div>
                  <button onClick={() => setShowFiltros(false)} className="px-3 py-1.5 rounded-md text-[12px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white">Cerrar</button>
                </div>
              )}

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-12 gap-3 px-5 py-2.5 bg-[#F7F7F7] text-[10.5px] font-bold uppercase tracking-wider text-[#ABABAB]">
                    <div className="col-span-3">Oportunidad</div>
                    <div className="col-span-2">Ejecutivo</div>
                    <div className="text-right">Valor</div>
                    <div className="text-center">Probabilidad</div>
                    <div className="text-right">Valor ponderado</div>
                    <div className="text-center">Cierre est.</div>
                    <div></div>
                  </div>
                  {TOP_OPPS.map((o, i) => {
                    const ponderado = Math.round(o.valor * o.prob / 100)
                    const probColor = o.prob >= 70 ? '#1A8754' : o.prob >= 50 ? '#F39610' : '#C0392B'
                    return (
                      <div key={i} className="grid grid-cols-12 gap-3 px-5 py-3 border-t border-[#F0F0F0] hover:bg-[#F7F9FF] transition-colors items-center">
                        <div className="col-span-3 min-w-0">
                          <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{o.op}</div>
                          <div className="flex items-center gap-1.5 text-[11.5px] text-[#6B6B6B]">
                            {o.emp}
                            {o.urgent && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#FDECEA] text-[#C0392B]">◆ Esta semana</span>}
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: avatarColor(o.exec) }}>
                            {o.exec}
                          </div>
                          <span className="text-[12px] text-[#4A4A4A] truncate">{o.execName}</span>
                        </div>
                        <div className="text-right font-bold text-[#1A1A1A]">$ {o.valor} M</div>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${o.prob}%`, background: probColor }} />
                          </div>
                          <strong className="text-[12px]" style={{ color: probColor }}>{o.prob}%</strong>
                        </div>
                        <div className="text-right font-extrabold text-[#F39610]">$ {ponderado} M</div>
                        <div className="text-center text-[12px] text-[#6B6B6B]">{o.cierre}</div>
                        <div>
                          <button onClick={() => navigate(`/director/oportunidades/${o.id ?? i}`)} className="text-[#6B6B6B] hover:text-[#24388C]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  <div className="px-5 py-3 bg-[#F7F7F7] border-t border-[#F0F0F0] flex justify-between text-[13px]">
                    <span className="text-[#6B6B6B]">Mostrando 10 de 65 oportunidades activas</span>
                    <strong className="text-[#F39610]">Suma ponderada Top 10: $ 2.020 M</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Forecast Q2 por sector</div>
                  <div className="text-[12px] text-[#6B6B6B]">Distribución esperada del cierre</div>
                </div>
                <div className="p-5">
                  {[
                    { sector: 'Agua Potable', color: '#24388C', val: 1020, pct: 30 },
                    { sector: 'Gas Natural', color: '#F39610', val: 745, pct: 22 },
                    { sector: 'Agro / Riego', color: '#A855F7', val: 610, pct: 18 },
                    { sector: 'Construcción', color: '#22C55E', val: 508, pct: 15 },
                    { sector: 'Industria', color: '#EF4444', val: 508, pct: 15 },
                  ].map(s => (
                    <div key={s.sector} className="py-2.5 border-b border-[#F0F0F0] last:border-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                          <strong className="text-[13px] text-[#1A1A1A]">{s.sector}</strong>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="text-[14px] text-[#F39610]">$ {s.val} M</strong>
                          <span className="text-[11.5px] text-[#6B6B6B]">{s.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.pct * 3}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 flex justify-between font-bold">
                    <span className="text-[#1A1A1A]">Total Q2 esperado</span>
                    <span className="text-[17px] text-[#F39610]">$ 3.390 M</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Riesgos del forecast</div>
                  <div className="text-[12px] text-[#6B6B6B]">Factores que pueden afectar negativamente la proyección</div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    { severity: 'Alto', title: 'Licitación EMPAS en riesgo', desc: '$ 560 M pueden caer si competencia gana. Representa 16% del Q2.', color: '#C0392B', bg: '#FDECEA' },
                    { severity: 'Medio', title: '2 ejecutivos bajo meta', desc: 'Pedro S. (48%) y Carlos R. (62%) impactan $ 420 M de pipeline.', color: '#C7770D', bg: '#FFF4E0' },
                    { severity: 'Medio', title: 'Concentración en EMPAS', desc: '2 oportunidades del mismo cliente suman 31% del Q2.', color: '#C7770D', bg: '#FFF4E0' },
                    { severity: 'Bajo', title: 'Cierre Q2 apretado', desc: '$ 1.045 M con fecha de cierre en los últimos 10 días de cada mes.', color: '#24388C', bg: '#EEF1FA' },
                  ].map(r => (
                    <div key={r.title} className="p-3 rounded" style={{ background: r.bg, borderLeft: `3px solid ${r.color}` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white" style={{ background: r.color }}>{r.severity}</span>
                        <strong className="text-[13px] text-[#1A1A1A]">{r.title}</strong>
                      </div>
                      <div className="text-[12.5px] text-[#4A4A4A] leading-relaxed">{r.desc}</div>
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