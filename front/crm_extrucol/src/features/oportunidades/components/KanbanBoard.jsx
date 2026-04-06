import { useState } from 'react'
import KanbanCard from './KanbanCard'
import { ESTADOS } from '../hooks/useOportunidades'

const ESTADO_CONFIG = {
  PROSPECTO:    { label: 'Prospecto',    dot: '#3B82F6' },
  CALIFICACION: { label: 'Calificación', dot: '#F97316' },
  PROPUESTA:    { label: 'Propuesta',    dot: '#A855F7' },
  NEGOCIACION:  { label: 'Negociación',  dot: '#EAB308' },
  GANADA:       { label: 'Ganada',       dot: '#22C55E' },
  PERDIDA:      { label: 'Perdida',      dot: '#EF4444' },
}

// ── En móvil: un tab a la vez ─────────────────────────────────
function KanbanTabs({ porEstado }) {
  const [activo, setActivo] = useState('PROSPECTO')
  const cfg = ESTADO_CONFIG[activo]

  return (
    <div>
      {/* Scroll horizontal de tabs */}
      <div className="flex gap-1.5 overflow-x-scroll pb-3 mb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {ESTADOS.map(e => {
          const c   = ESTADO_CONFIG[e]
          const cnt = (porEstado[e] ?? []).length
          const sel = e === activo
          return (
            <button key={e} onClick={() => setActivo(e)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                sel
                  ? 'text-white border-transparent'
                  : 'bg-white text-[#6B6B6B] border-[#E5E5E5] hover:border-[#ABABAB]'
              }`}
              style={sel ? { background: c.dot, borderColor: c.dot } : {}}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: sel ? 'rgba(255,255,255,0.7)' : c.dot }} />
              {c.label}
              <span className={`text-[10.5px] font-bold px-1.5 rounded-full ${sel ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#6B6B6B]'}`}>
                {cnt}
              </span>
            </button>
          )
        })}
      </div>

      {/* Cards del estado activo */}
      <div className="flex flex-col gap-2">
        {(porEstado[activo] ?? []).length === 0 ? (
          <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl py-10 text-center">
            <p className="text-[13px] font-semibold text-[#4A4A4A] mb-0.5">Sin oportunidades</p>
            <p className="text-[12px] text-[#ABABAB]">en {cfg.label}</p>
          </div>
        ) : (
          (porEstado[activo] ?? []).map(op => <KanbanCard key={op.id} oportunidad={op} />)
        )}
      </div>
    </div>
  )
}

// ── En desktop: columnas que se reparten el espacio ──────────
// Solo muestra las 4 activas por defecto; Ganada/Perdida como columnas colapsables
function KanbanColumns({ porEstado }) {
  const [mostrarCerradas, setMostrarCerradas] = useState(false)

  const estadosActivos  = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION']
  const estadosCerrados = ['GANADA', 'PERDIDA']

  const totalGanadas = (porEstado['GANADA']  ?? []).length
  const totalPerdidas = (porEstado['PERDIDA'] ?? []).length

  return (
    <div>
      {/* Grid de 4 columnas activas — fluid, sin ancho fijo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {estadosActivos.map(estado => {
          const c   = ESTADO_CONFIG[estado]
          const ops = porEstado[estado] ?? []
          return (
            <div key={estado} className="flex flex-col min-w-0">
              {/* Header columna */}
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                  <span className="text-[12px] font-bold text-[#4A4A4A] truncate">{c.label}</span>
                </div>
                <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B] flex-shrink-0 ml-1">
                  {ops.length}
                </span>
              </div>

              {/* Separador de color */}
              <div className="h-0.5 rounded-full mb-2.5 opacity-40" style={{ background: c.dot }} />

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {ops.length === 0 ? (
                  <div className="border border-dashed border-[#E5E5E5] rounded-lg py-6 text-center">
                    <p className="text-[11.5px] text-[#ABABAB]">Sin oportunidades</p>
                  </div>
                ) : (
                  ops.map(op => <KanbanCard key={op.id} oportunidad={op} />)
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Toggle Ganadas / Perdidas */}
      <div className="border-t border-[#F0F0F0] pt-3">
        <button
          onClick={() => setMostrarCerradas(v => !v)}
          className="flex items-center gap-2 text-[12px] font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors group"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${mostrarCerradas ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Cerradas
          <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B]">
            {totalGanadas + totalPerdidas}
          </span>
          <span className="text-[10.5px] text-[#22C55E] font-semibold">
            {totalGanadas} ganadas
          </span>
          <span className="text-[10.5px] text-[#EF4444] font-semibold">
            {totalPerdidas} perdidas
          </span>
        </button>

        {mostrarCerradas && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {estadosCerrados.map(estado => {
              const c   = ESTADO_CONFIG[estado]
              const ops = porEstado[estado] ?? []
              return (
                <div key={estado} className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-2.5 px-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                      <span className="text-[12px] font-bold text-[#4A4A4A]">{c.label}</span>
                    </div>
                    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F0F0F0] text-[#6B6B6B] ml-1">
                      {ops.length}
                    </span>
                  </div>
                  <div className="h-0.5 rounded-full mb-2.5 opacity-40" style={{ background: c.dot }} />
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-0.5">
                    {ops.length === 0 ? (
                      <div className="border border-dashed border-[#E5E5E5] rounded-lg py-4 text-center">
                        <p className="text-[11.5px] text-[#ABABAB]">Sin oportunidades</p>
                      </div>
                    ) : (
                      ops.map(op => <KanbanCard key={op.id} oportunidad={op} />)
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ porEstado }) {
  return (
    <>
      <div className="block lg:hidden">
        <KanbanTabs porEstado={porEstado} />
      </div>
      <div className="hidden lg:block">
        <KanbanColumns porEstado={porEstado} />
      </div>
    </>
  )
}