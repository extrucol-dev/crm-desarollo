import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { useLeadDetalle } from '../hooks/useLeadDetalle'

// ── Constantes de presentación ────────────────────────────────
const ESTADO_BADGE = {
  NUEVO:      { label: 'Nuevo',         bg: '#DBEAFE', text: '#1D4ED8' },
  CONTACTADO: { label: 'Contactado',    bg: '#F3E8FF', text: '#7C3AED' },
  CALIFICADO: { label: 'Interesado',    bg: '#FFF4E0', text: '#C7770D' },
  DESCARTADO: { label: 'No interesado', bg: '#FEE2E2', text: '#C0392B' },
  CONVERTIDO: { label: 'Convertido',    bg: '#DCFCE7', text: '#1A8754' },
}

const scoreColor = (s) => {
  if (s >= 80) return { bg: '#E8F5EE', text: '#1A8754' }
  if (s >= 60) return { bg: '#FFF4E0', text: '#C7770D' }
  if (s >= 40) return { bg: '#EEF1FA', text: '#6366F1' }
  return { bg: '#EEF1FA', text: '#24388C' }
}

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

const ageDays = (iso) => {
  if (!iso) return null
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (d === 0) return 'hoy'
  if (d === 1) return 'hace 1 día'
  return `hace ${d} días`
}

// ── Íconos inline ─────────────────────────────────────────────
const IconX = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const IconArrow = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)
const IconXCircle = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// ── Modal base ────────────────────────────────────────────────
function Modal({ children, onClose, maxWidth = 'max-w-lg' }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center px-4 py-16 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} overflow-hidden`}
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}

function ModalHeader({ iconBg, icon, title, subtitle, onClose }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F0F0F0]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-[#1A1A1A]">{title}</div>
        {subtitle && <div className="text-[12px] text-[#6B6B6B] truncate">{subtitle}</div>}
      </div>
      <button onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ABABAB] hover:bg-[#F0F0F0] transition flex-shrink-0">
        <IconX />
      </button>
    </div>
  )
}

// ── Modal: Descalificar ───────────────────────────────────────
const MOTIVOS = [
  { id: 'no_responde',    label: 'No responde',              desc: 'Sin contacto después de múltiples intentos' },
  { id: 'presupuesto',    label: 'Presupuesto insuficiente', desc: 'El lead no tiene recursos para comprar' },
  { id: 'no_responsable', label: 'No es el responsable',     desc: 'Contactó a alguien sin poder de decisión' },
  { id: 'distribuidor',   label: 'Trasladado a distribuidor',desc: 'Lead derivado a red de distribuidores' },
  { id: 'duplicado',      label: 'Lead duplicado',           desc: 'Ya existe un lead o cliente para esta empresa' },
]

function ModalDescalificar({ lead, onClose, onConfirm, saving }) {
  const [motivo, setMotivo] = useState('')

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        iconBg="bg-[#FEE2E2]"
        icon={<span className="text-[#C0392B]"><IconXCircle /></span>}
        title="Descalificar lead"
        subtitle={lead.nombre}
        onClose={onClose}
      />
      <div className="px-6 py-4">
        <div className="bg-[#FEE2E2] rounded-lg p-3 mb-4">
          <div className="text-[13px] font-bold text-[#1A1A1A]">{lead.nombre}</div>
          <div className="text-[11.5px] text-[#6B6B6B] mt-0.5">
            {lead.empresa || '—'} · Score {lead.score ?? 0}%
          </div>
        </div>
        <p className="text-[12.5px] font-semibold text-[#4A4A4A] mb-3">
          Motivo de descalificación <span className="text-[#C0392B]">*</span>
        </p>
        <div className="flex flex-col gap-2">
          {MOTIVOS.map(m => (
            <div key={m.id} onClick={() => setMotivo(m.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                motivo === m.id
                  ? 'border-[#C0392B] bg-[#FEE2E2]'
                  : 'border-[#E5E5E5] hover:border-[#C0392B]'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                motivo === m.id ? 'border-[#C0392B]' : 'border-[#ABABAB]'
              }`}>
                {motivo === m.id && <div className="w-2 h-2 rounded-full bg-[#C0392B]" />}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#1A1A1A]">{m.label}</div>
                <div className="text-[11.5px] text-[#6B6B6B]">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-3 border-t border-[#F0F0F0] bg-[#F7F7F7] flex justify-end gap-2">
        <button onClick={onClose}
          className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] rounded-lg hover:bg-[#F0F0F0] transition">
          Cancelar
        </button>
        <button onClick={() => motivo && onConfirm(motivo)} disabled={!motivo || saving}
          className="px-4 py-2 text-[13px] font-semibold text-white bg-[#C0392B] rounded-lg transition disabled:opacity-50">
          {saving ? 'Descalificando...' : 'Descalificar'}
        </button>
      </div>
    </Modal>
  )
}

// ── Modal: Convertir ──────────────────────────────────────────
function ModalConvertir({ lead, onClose, onConfirm, saving, apiError }) {
  const [form, setForm] = useState({
    nombre_oportunidad: `${lead.empresa ? `${lead.empresa} - ` : ''}${lead.nombre}`.slice(0, 120),
    valor_estimado: '',
    fecha_cierre:   '',
  })
  const [errs, setErrs] = useState({})

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = () => {
    const e = {}
    if (!form.nombre_oportunidad.trim()) e.nombre_oportunidad = 'Requerido'
    if (!form.valor_estimado)            e.valor_estimado      = 'Requerido'
    if (!form.fecha_cierre)              e.fecha_cierre        = 'Requerido'
    if (Object.keys(e).length) { setErrs(e); return }
    onConfirm({ ...form, valor_estimado: Number(form.valor_estimado) })
  }

  const inputCls = (err) =>
    `w-full px-3 py-2 border rounded-lg text-[13px] focus:outline-none focus:border-[#24388C] transition ${
      err ? 'border-[#C0392B]' : 'border-[#E5E5E5]'
    }`

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        iconBg="bg-[#DCFCE7]"
        icon={<span className="text-[#1A8754]"><IconArrow /></span>}
        title="Convertir a oportunidad"
        subtitle="Crea una oportunidad comercial desde este lead"
        onClose={onClose}
      />
      <div className="px-6 py-4">
        {/* Preview lead */}
        <div className="bg-[#F7F7F7] border border-dashed border-[#24388C] rounded-lg p-3 mb-2">
          <p className="text-[10.5px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">Lead origen</p>
          <p className="text-[13px] font-bold text-[#1A1A1A]">{lead.nombre}</p>
          <p className="text-[11.5px] text-[#6B6B6B]">
            {lead.empresa || '—'} · Score {lead.score ?? 0}%
          </p>
        </div>
        <div className="flex items-center justify-center py-2 mb-2 text-[#24388C]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-3 3-3-3m3 3V3" />
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-[#4A4A4A] mb-1.5">
              Título de la oportunidad <span className="text-[#C0392B]">*</span>
            </label>
            <input value={form.nombre_oportunidad}
              onChange={e => set('nombre_oportunidad', e.target.value)}
              className={inputCls(errs.nombre_oportunidad)} />
            {errs.nombre_oportunidad && <p className="text-[11px] text-[#C0392B] mt-0.5">{errs.nombre_oportunidad}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#4A4A4A] mb-1.5">
                Valor estimado (COP) <span className="text-[#C0392B]">*</span>
              </label>
              <input type="number" min="0" value={form.valor_estimado}
                onChange={e => set('valor_estimado', e.target.value)}
                placeholder="0"
                className={inputCls(errs.valor_estimado)} />
              {errs.valor_estimado && <p className="text-[11px] text-[#C0392B] mt-0.5">{errs.valor_estimado}</p>}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4A4A4A] mb-1.5">
                Fecha de cierre <span className="text-[#C0392B]">*</span>
              </label>
              <input type="date" value={form.fecha_cierre}
                onChange={e => set('fecha_cierre', e.target.value)}
                className={inputCls(errs.fecha_cierre)} />
              {errs.fecha_cierre && <p className="text-[11px] text-[#C0392B] mt-0.5">{errs.fecha_cierre}</p>}
            </div>
          </div>

          <div className="bg-[#EEF1FA] rounded-lg p-3 text-[12px] text-[#24388C]">
            Se creará una nueva oportunidad y este lead pasará a estado <strong>Convertido</strong>.
          </div>

          {apiError && <p className="text-[12px] text-[#C0392B]">{apiError}</p>}
        </div>
      </div>
      <div className="px-6 py-3 border-t border-[#F0F0F0] bg-[#F7F7F7] flex justify-end gap-2">
        <button onClick={onClose}
          className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] rounded-lg hover:bg-[#F0F0F0] transition">
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className="px-4 py-2 text-[13px] font-semibold text-white bg-[#1A8754] hover:bg-[#157043] rounded-lg transition disabled:opacity-50">
          {saving ? 'Convirtiendo...' : 'Convertir a oportunidad'}
        </button>
      </div>
    </Modal>
  )
}

// ── Página principal ──────────────────────────────────────────
export default function LeadDetallePage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { lead, loading, error, saving, apiError, cambiarEstado, convertir, cargar } = useLeadDetalle(id)
  const [modal, setModal]       = useState(null) // null | 'descalificar' | 'convertir'
  const [msgExito, setMsgExito] = useState('')

  const badge      = lead ? (ESTADO_BADGE[lead.estado] ?? { label: lead.estado, bg: '#F0F0F0', text: '#4A4A4A' }) : null
  const colors     = lead ? scoreColor(lead.score ?? 0) : null
  const age        = lead ? ageDays(lead.fecha_creacion) : null
  const esTerminal = lead?.estado === 'CONVERTIDO' || lead?.estado === 'DESCARTADO'

  const handleDescalificar = async () => {
    const ok = await cambiarEstado('DESCARTADO')
    if (ok) { setModal(null); setMsgExito('Lead descalificado correctamente.') }
  }

  const handleConvertir = async (datos) => {
    const result = await convertir(datos)
    if (result?.success || result?.id_oportunidad) {
      setModal(null)
      setMsgExito('Lead convertido a oportunidad exitosamente.')
      cargar()
    }
  }

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate('/leads')}>
            Leads
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[200px]">{lead?.nombre ?? '...'}</span>
        </>
      }>
        {lead && !esTerminal && (
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/leads/${id}/editar`)}
              className="px-3 py-[6px] text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] rounded-lg hover:bg-[#F0F0F0] transition">
              Editar
            </button>
            <button onClick={() => setModal('descalificar')}
              className="px-3 py-[6px] text-[13px] font-semibold text-[#C0392B] border border-[#C0392B]/30 rounded-lg hover:bg-[#FEE2E2] transition">
              Descalificar
            </button>
            <button onClick={() => setModal('convertir')}
              className="px-3 py-[6px] text-[13px] font-semibold text-white bg-[#1A8754] hover:bg-[#157043] rounded-lg transition">
              Convertir
            </button>
          </div>
        )}
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando lead..." />}

        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {msgExito && (
          <div className="text-sm text-[#1A8754] bg-[#DCFCE7] border border-[#a7f3c3] rounded-lg px-4 py-3 mb-4">
            {msgExito}
          </div>
        )}

        {!loading && lead && (
          <>
            {/* ── Header card ── */}
            <div className="bg-white border border-[#F0F0F0] rounded-xl p-5 mb-4 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {badge && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ background: badge.bg, color: badge.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.text }} />
                        {badge.label}
                      </span>
                    )}
                    {lead.origen && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0F0F0] text-[#6B6B6B]">
                        {lead.origen}
                      </span>
                    )}
                    {lead.score != null && colors && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ background: colors.bg, color: colors.text }}>
                        🔥 Score {lead.score}%
                      </span>
                    )}
                  </div>
                  <h1 className="text-[20px] font-extrabold text-[#1A1A1A] leading-tight mb-1">
                    {lead.nombre}
                  </h1>
                  <p className="text-[13px] text-[#6B6B6B]">
                    {[lead.empresa, age && `Recibido ${age}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Grid principal ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Columna principal */}
              <div className="lg:col-span-2 flex flex-col gap-4">

                {/* Descripción e intereses */}
                <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Descripción e intereses</h2>
                  </div>
                  <div className="p-5">
                    <p className="text-[13.5px] text-[#4A4A4A] leading-relaxed mb-4">
                      {lead.descripcion || <span className="text-[#ABABAB] italic">Sin descripción registrada</span>}
                    </p>
                    {lead.intereses && lead.intereses.length > 0 && (
                      <div className="pt-4 border-t border-[#F0F0F0]">
                        <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">
                          Intereses
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lead.intereses.map((i, idx) => (
                            <span key={idx}
                              className="px-3 py-1 rounded-full bg-[#EEF1FA] text-[#24388C] text-[12px] font-semibold">
                              {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Historial de estados */}
                <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Historial de estados</h2>
                  </div>
                  <div className="p-5">
                    {lead.historial && lead.historial.length > 0 ? (
                      <div className="flex flex-col">
                        {lead.historial.map((h, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                                idx === 0 ? 'bg-[#24388C]' : 'bg-[#D5D5D5]'
                              }`} />
                              {idx < lead.historial.length - 1 && (
                                <div className="w-px flex-1 bg-[#F0F0F0] my-1" />
                              )}
                            </div>
                            <div className="pb-3 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[13px] font-semibold text-[#1A1A1A]">
                                  {ESTADO_BADGE[h.estado]?.label ?? h.estado}
                                </span>
                                <span className="text-[11.5px] text-[#ABABAB] flex-shrink-0">
                                  {formatDate(h.fecha)}
                                </span>
                              </div>
                              {h.descripcion && (
                                <p className="text-[12.5px] text-[#6B6B6B] mt-0.5">{h.descripcion}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#ABABAB] italic">Sin historial de estados registrado</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Columna lateral */}
              <div className="flex flex-col gap-4">

                {/* Información de contacto */}
                <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Información de contacto</h2>
                  </div>
                  <div className="p-5">
                    {lead.contacto && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF1FA] text-[#24388C] text-[13px] font-bold flex items-center justify-center flex-shrink-0">
                          {lead.contacto.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="text-[13px] font-bold text-[#1A1A1A]">{lead.contacto}</div>
                      </div>
                    )}
                    <div className="flex flex-col gap-2.5">
                      {lead.telefono && (
                        <a href={`tel:${lead.telefono}`}
                          className="flex items-center gap-2.5 text-[13px] text-[#24388C] hover:underline">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                          {lead.telefono}
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`}
                          className="flex items-center gap-2.5 text-[13px] text-[#24388C] hover:underline truncate">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          {lead.email}
                        </a>
                      )}
                      {!lead.contacto && !lead.telefono && !lead.email && (
                        <p className="text-[13px] text-[#ABABAB] italic">Sin datos de contacto</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información del lead */}
                <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A]">Información</h2>
                  </div>
                  <div className="p-5">
                    <dl className="flex flex-col divide-y divide-[#F0F0F0]">
                      {[
                        ['Origen',  lead.origen],
                        ['Empresa', lead.empresa],
                        ['Ciudad',  typeof lead.ciudad === 'object' ? lead.ciudad?.nombre : lead.ciudad],
                        ['Score',   lead.score != null ? `${lead.score}%` : null],
                        ['Edad',    age],
                        ['Creado',  formatDate(lead.fecha_creacion)],
                      ].filter(([, v]) => v).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between py-2.5 text-[13px]">
                          <dt className="text-[#6B6B6B]">{k}</dt>
                          <dd className={`font-semibold ${k === 'Score' ? 'text-[#F39610]' : 'text-[#1A1A1A]'}`}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Acciones rápidas */}
                {!esTerminal && (
                  <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-[#F0F0F0]">
                      <h2 className="text-[14px] font-bold text-[#1A1A1A]">Acciones</h2>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <button onClick={() => setModal('convertir')}
                        className="w-full px-4 py-2.5 text-[13px] font-semibold text-white bg-[#1A8754] hover:bg-[#157043] rounded-lg transition">
                        Convertir a oportunidad
                      </button>
                      <button onClick={() => navigate(`/leads/${id}/editar`)}
                        className="w-full px-4 py-2.5 text-[13px] font-semibold text-[#24388C] border border-[#24388C]/30 hover:bg-[#EEF1FA] rounded-lg transition">
                        Editar lead
                      </button>
                      <button onClick={() => setModal('descalificar')}
                        className="w-full px-4 py-2.5 text-[13px] font-semibold text-[#C0392B] border border-[#C0392B]/30 hover:bg-[#FEE2E2] rounded-lg transition">
                        Descalificar lead
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {modal === 'descalificar' && lead && (
        <ModalDescalificar
          lead={lead}
          onClose={() => setModal(null)}
          onConfirm={handleDescalificar}
          saving={saving}
        />
      )}
      {modal === 'convertir' && lead && (
        <ModalConvertir
          lead={lead}
          onClose={() => setModal(null)}
          onConfirm={handleConvertir}
          saving={saving}
          apiError={apiError}
        />
      )}
    </AppLayout>
  )
}
