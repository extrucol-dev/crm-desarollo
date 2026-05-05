import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { analisisAPI } from '../services/analisisAPI'

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
  const [monthsData, setMonthsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFiltros, setShowFiltros] = useState(false)

  useEffect(() => {
    analisisAPI.forecast({ meses })
      .then(data => {
        setMonthsData(data?.meses ?? [])
      })
      .catch(() => setMonthsData([]))
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
  const pipelinePonderado = totalEsperado

  const confianzaPromedio = 0

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

            

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[13px] font-bold text-[#ABABAB] mb-3">Distribución por probabilidad</div>
                <div className="text-[12px] text-[#ABABAB]">Sin datos disponibles</div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[13px] font-bold text-[#ABABAB] mb-3">Factores de confianza</div>
                <div className="text-[12px] text-[#ABABAB]">Sin datos disponibles</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
              <div className="text-[14px] font-bold text-[#ABABAB] mb-3">Oportunidades clave del forecast</div>
              <div className="text-[12px] text-[#ABABAB]">Sin datos disponibles</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[13px] font-bold text-[#ABABAB] mb-3">Forecast Q2 por sector</div>
                <div className="text-[12px] text-[#ABABAB]">Sin datos disponibles</div>
              </div>

              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[13px] font-bold text-[#ABABAB] mb-3">Riesgos del forecast</div>
                <div className="text-[12px] text-[#ABABAB]">Sin datos disponibles</div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}