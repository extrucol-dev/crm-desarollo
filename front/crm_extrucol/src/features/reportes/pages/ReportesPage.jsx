import { useState, useEffect, useMemo } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { reportesAPI } from '../services/reportesAPI'

const REPORTES_PREDEFINIDOS = [
  { title: 'Ventas por período', desc: 'Comparativo mensual, trimestral y anual', icon: 'chartBar', cat: 'Ventas', catColor: '#24388C' },
  { title: 'Pipeline por ejecutivo', desc: 'Distribución de oportunidades por vendedor', icon: 'users', cat: 'Equipo', catColor: '#7C3AED' },
  { title: 'Conversión Lead → Oportunidad', desc: 'Tasa de conversión por origen', icon: 'funnel', cat: 'Conversión', catColor: '#F39610' },
  { title: 'Análisis por sector', desc: 'Rendimiento en agua, gas, agro, industria', icon: 'building', cat: 'Sectores', catColor: '#1A8754' },
  { title: 'Motivos de cierre', desc: 'Razones de ganadas y perdidas', icon: 'chartPie', cat: 'Cierre', catColor: '#EF4444' },
  { title: 'Actividades por ejecutivo', desc: 'Número y tipo de actividades registradas', icon: 'clipboardCheck', cat: 'Actividad', catColor: '#0369A1' },
  { title: 'Clientes nuevos vs recurrentes', desc: 'Ratio según monto mínimo configurado', icon: 'users', cat: 'Clientes', catColor: '#7C3AED' },
  { title: 'Forecasting trimestral', desc: 'Proyección de ventas por probabilidad', icon: 'trendingUp', cat: 'Forecast', catColor: '#F39610' },
  { title: 'Origen de leads', desc: 'Eficiencia por canal de captación', icon: 'globe', cat: 'Marketing', catColor: '#24388C' },
]



const ICONS = {
  chartBar: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  funnel: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
  building: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>,
  chartPie: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>,
  clipboardCheck: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  trendingUp: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
  globe: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
  download: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
  view: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  plus: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  search: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
}

function ReporteCard({ r, onVer }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onVer}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-11 h-11 rounded-xl bg-[#EEF1FA] text-[#24388C] flex items-center justify-center flex-shrink-0">
          {ICONS[r.icon]}
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
            style={{ background: r.catColor + '20', color: r.catColor }}>
            {r.cat}
          </span>
          <div className="font-bold text-[14px] text-[#1A1A1A] leading-snug">{r.title}</div>
          <div className="text-[12px] text-[#6B6B6B] mt-0.5">{r.desc}</div>
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-[#F0F0F0]">
        <button
          onClick={e => { e.stopPropagation(); onVer() }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[12.5px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all"
        >
          {ICONS.view} Ver
        </button>
        <button
          onClick={e => e.stopPropagation()}
          className="px-3 py-2 rounded-md text-[12.5px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all"
        >
          {ICONS.download}
        </button>
      </div>
    </div>
  )
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState([])
  const [recientes, setRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroCat, setFiltroCat] = useState('Todos')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      reportesAPI.listar(),
      reportesAPI.recientes(),
    ]).then(([lista, rec]) => {
      setReportes(Array.isArray(lista) && lista.length ? lista : [])
      setRecientes(Array.isArray(rec) && rec.length ? rec : [])
    }).catch(() => {
      setReportes([])
      setRecientes([])
    }).finally(() => setLoading(false))
  }, [])

  const categorias = ['Todos', ...Array.from(new Set(REPORTES_PREDEFINIDOS.map(r => r.cat)))]

  const filtrados = useMemo(() => {
    return reportes.filter(r => {
      const matchBusqueda = !busqueda || r.title.toLowerCase().includes(busqueda.toLowerCase()) || r.desc.toLowerCase().includes(busqueda.toLowerCase())
      const matchCat = filtroCat === 'Todos' || r.cat === filtroCat
      return matchBusqueda && matchCat
    })
  }, [reportes, busqueda, filtroCat])

  return (
    <AppLayout>
      <Topbar title="Reportes" />
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-[18px] font-extrabold text-[#1A1A1A]">Reportes</h1>
            <p className="text-[12.5px] text-[#6B6B6B]">Biblioteca de reportes gerenciales</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7] transition-all">
            {ICONS.plus} Crear reporte personalizado
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ABABAB]">{ICONS.search}</span>
            <input
              className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-[#D5D5D5] rounded-md bg-white text-[#1A1A1A] outline-none focus:border-[#24388C] transition-all"
              placeholder="Buscar reporte..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCat(cat)}
                className={`px-3 py-1.5 rounded-md text-[12.5px] font-semibold transition-all ${filtroCat === cat
                  ? 'bg-[#24388C] text-white'
                  : 'border border-[#D5D5D5] text-[#4A4A4A] bg-white hover:bg-[#F7F7F7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#24388C] to-[#1B2C6B] text-white rounded-xl p-6 mb-5 flex items-center gap-6">
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">Reporte del mes</span>
            <div className="text-[20px] font-extrabold mt-1 mb-1">Análisis comparativo Abril 2026</div>
            <div className="text-[13px] opacity-85">Revisión ejecutiva del período · 9 KPIs principales · Generado automáticamente</div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-bold text-[#1A1A1A] bg-[#F39610] hover:bg-[#D4820E] transition-all flex-shrink-0">
            {ICONS.download} Descargar PDF
          </button>
        </div>

        {loading && <LoadingSpinner label="Cargando reportes..." />}

        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {filtrados.map((r, i) => (
                <ReporteCard key={i} r={r} onVer={() => alert(`Ver reporte: ${r.title}`)} />
              ))}
              {filtrados.length === 0 && (
                <div className="col-span-full text-center py-12 text-[13px] text-[#ABABAB]">
                  No se encontraron reportes con los filtros seleccionados
                </div>
              )}
            </div>

            {recientes.length > 0 && (
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Reportes recientes</div>
                  <div className="text-[12px] text-[#6B6B6B]">Últimos reportes generados por ti</div>
                </div>
                {recientes.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-t border-[#F0F0F0] hover:bg-[#F7F9FF] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#FDECEA] text-[#C0392B] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{r.title}</div>
                      <div className="text-[11.5px] text-[#6B6B6B]">{r.ago} · {r.size}</div>
                    </div>
                    <button className="p-2 rounded-md text-[#6B6B6B] hover:text-[#24388C] hover:bg-[#F7F7F7] transition-all">
                      {ICONS.download}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}