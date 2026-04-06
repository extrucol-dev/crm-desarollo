import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { directorAPI } from '../services/directorAPI'

const ESTADO_VARIANT = { PROSPECTO: 'blue', CALIFICACION: 'orange', PROPUESTA: 'purple', NEGOCIACION: 'purple', GANADA: 'green', PERDIDA: 'red' }
const TIPOS = ['COTIZACION', 'VENTA', 'ACOMPANAMIENTO', 'PROYECTO']
const TIPO_LABEL = { COTIZACION: 'Cotización', VENTA: 'Venta', ACOMPANAMIENTO: 'Acompañamiento', PROYECTO: 'Proyecto' }

const formatCOP = (n) => {
  if (!n) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}
const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PipelineDirectorPage() {
  const navigate = useNavigate()
  const [oportunidades, setOportunidades] = useState([])
  const [usuarios, setUsuarios]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [filtroEjecutivo, setFiltroEjecutivo] = useState('')
  const [filtroTipo, setFiltroTipo]           = useState('')
  const [filtroEstado, setFiltroEstado]       = useState('')

  useEffect(() => {
    Promise.all([directorAPI.oportunidades(), directorAPI.usuarios()])
      .then(([ops, usrs]) => {
        setOportunidades(ops)
        setUsuarios(usrs.filter(u => u.rol === 'EJECUTIVO'))
      })
      .finally(() => setLoading(false))
  }, [])

  // CE-37: filtros combinados
  const filtradas = useMemo(() => oportunidades.filter(op => {
    const matchEjec   = !filtroEjecutivo || String(op.usuario?.id) === filtroEjecutivo
    const matchTipo   = !filtroTipo   || op.tipo === filtroTipo
    const matchEstado = !filtroEstado || op.estado === filtroEstado
    return matchEjec && matchTipo && matchEstado
  }), [oportunidades, filtroEjecutivo, filtroTipo, filtroEstado])

  const hayFiltros = filtroEjecutivo || filtroTipo || filtroEstado
  const limpiar = () => { setFiltroEjecutivo(''); setFiltroTipo(''); setFiltroEstado('') }

  return (
    <AppLayout>
      <Topbar title="Pipeline del Equipo" />
      <div className="p-4 sm:p-6">
        {/* CE-37: Filtros */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
          <select className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all sm:w-44"
            value={filtroEjecutivo} onChange={e => setFiltroEjecutivo(e.target.value)}>
            <option value="">Todos los ejecutivos</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
          </select>
          <select className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all sm:w-40"
            value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {TIPOS.map(t => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
          </select>
          <select className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] transition-all sm:w-40"
            value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {['PROSPECTO','CALIFICACION','PROPUESTA','NEGOCIACION','GANADA','PERDIDA'].map(e =>
              <option key={e} value={e}>{e}</option>)}
          </select>
          {hayFiltros && (
            <button onClick={limpiar}
              className="text-[12.5px] text-[#6B6B6B] hover:text-[#C0392B] underline transition-colors self-center">
              Limpiar filtros
            </button>
          )}
        </div>

        {loading && <LoadingSpinner label="Cargando pipeline..." />}

        {!loading && (
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-3">
              <span className="text-[14px] font-bold text-[#1A1A1A]">Oportunidades</span>
              <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#EEF1FA] text-[#24388C]">
                {filtradas.length}
              </span>
            </div>

            {filtradas.length === 0 ? (
              <div className="text-center py-10 text-[13px] text-[#ABABAB]">Sin oportunidades con los filtros seleccionados</div>
            ) : (
              <div className="divide-y divide-[#F0F0F0]">
                {filtradas.map(op => (
                  /* CE-34 + CE-36: clic lleva al detalle en solo lectura */
                  <div key={op.id}
                    onClick={() => navigate(`/director/oportunidades/${op.id}`)}
                    className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#F7F9FF] transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#1A1A1A] group-hover:text-[#24388C] transition-colors truncate">
                        {op.nombre}
                      </div>
                      <div className="text-[12px] text-[#6B6B6B] truncate mt-0.5">
                        {op.usuario?.nombre} — {op.cliente?.empresa ?? op.cliente?.nombre}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      <span className="text-[12px] text-[#ABABAB]">{formatDate(op.fecha_cierre)}</span>
                      <span className="text-[12.5px] font-bold text-[#24388C]">{formatCOP(op.valor_estimado)}</span>
                      <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>{op.estado}</Badge>
                    </div>
                    <div className="sm:hidden flex-shrink-0">
                      <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>{op.estado}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
