import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { leadsAPI } from '../services/leadsAPI'

const inputCls = (err) =>
  `w-full px-3 py-2 border rounded-lg text-[13px] focus:outline-none focus:border-[#24388C] transition ${
    err ? 'border-[#C0392B]' : 'border-[#E5E5E5]'
  }`

export default function LeadConversionPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [lead, setLead]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [loadError, setLoadError] = useState('')
  const [apiError, setApiError]   = useState('')
  const [exito, setExito]         = useState(false)

  const [form, setForm] = useState({
    nombre_oportunidad: '',
    valor_estimado:     '',
    fecha_cierre:       '',
  })
  const [errs, setErrs] = useState({})

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  useEffect(() => {
    leadsAPI.buscar(id)
      .then(l => {
        setLead(l)
        if (l) {
          setForm(prev => ({
            ...prev,
            nombre_oportunidad: prev.nombre_oportunidad ||
              `${l.empresa ? `${l.empresa} - ` : ''}${l.nombre}`.slice(0, 120),
          }))
        }
      })
      .catch(() => setLoadError('No se pudo cargar el lead.'))
      .finally(() => setLoading(false))
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.nombre_oportunidad.trim()) e.nombre_oportunidad = 'El título es requerido'
    if (!form.valor_estimado)            e.valor_estimado      = 'El valor estimado es requerido'
    if (!form.fecha_cierre)              e.fecha_cierre        = 'La fecha de cierre es requerida'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrs(v); return }
    setSaving(true); setApiError('')
    try {
      const result = await leadsAPI.convertir(id, {
        ...form,
        valor_estimado: Number(form.valor_estimado),
      })
      if (result?.success || result?.id_oportunidad) {
        setExito(true)
        setTimeout(() => navigate('/leads'), 1800)
      } else {
        setApiError('La conversión no se completó correctamente.')
      }
    } catch {
      setApiError('No se pudo convertir el lead. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const breadcrumb = (
    <>
      <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate('/leads')}>
        Leads
      </span>
      <span className="text-[#D5D5D5]">›</span>
      <span className="text-[#24388C] cursor-pointer hover:underline"
        onClick={() => navigate(`/leads/${id}`)}>
        {lead?.nombre ?? '...'}
      </span>
      <span className="text-[#D5D5D5]">›</span>
      <span>Convertir</span>
    </>
  )

  return (
    <AppLayout>
      <Topbar breadcrumb={breadcrumb} />

      <div className="p-4 sm:p-6 max-w-xl mx-auto">
        {loading && <LoadingSpinner label="Cargando lead..." />}

        {loadError && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-lg px-4 py-3">
            {loadError}
          </div>
        )}

        {exito && (
          <div className="text-sm text-[#1A8754] bg-[#DCFCE7] border border-[#a7f3c3] rounded-lg px-4 py-3">
            ✓ Lead convertido a oportunidad exitosamente. Redirigiendo...
          </div>
        )}

        {!loading && lead && !exito && (
          <>
            <div className="mb-6">
              <h1 className="text-[20px] font-extrabold text-[#1A1A1A]">Convertir a oportunidad</h1>
              <p className="text-[13px] text-[#6B6B6B] mt-1">
                Crea una oportunidad comercial desde este lead
              </p>
            </div>

            {/* Preview del lead */}
            <div className="bg-[#F7F7F7] border border-dashed border-[#24388C] rounded-xl p-4 mb-2">
              <p className="text-[10.5px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">Lead origen</p>
              <p className="text-[14px] font-bold text-[#1A1A1A]">{lead.nombre}</p>
              <p className="text-[12px] text-[#6B6B6B] mt-0.5">
                {lead.empresa || '—'} · Score {lead.score ?? 0}%
              </p>
            </div>

            <div className="flex items-center justify-center py-2">
              <svg className="w-6 h-6 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-3 3-3-3m3 3V3" />
              </svg>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col gap-4">

                  {/* Título */}
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#4A4A4A] mb-1.5">
                      Título de la oportunidad <span className="text-[#C0392B]">*</span>
                    </label>
                    <input value={form.nombre_oportunidad}
                      onChange={e => set('nombre_oportunidad', e.target.value)}
                      className={inputCls(errs.nombre_oportunidad)} />
                    {errs.nombre_oportunidad && (
                      <p className="text-[11.5px] text-[#C0392B] mt-1">{errs.nombre_oportunidad}</p>
                    )}
                  </div>

                  {/* Valor + Fecha */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#4A4A4A] mb-1.5">
                        Valor estimado (COP) <span className="text-[#C0392B]">*</span>
                      </label>
                      <input type="number" min="0" value={form.valor_estimado}
                        onChange={e => set('valor_estimado', e.target.value)}
                        placeholder="0"
                        className={inputCls(errs.valor_estimado)} />
                      {errs.valor_estimado && (
                        <p className="text-[11.5px] text-[#C0392B] mt-1">{errs.valor_estimado}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#4A4A4A] mb-1.5">
                        Fecha de cierre <span className="text-[#C0392B]">*</span>
                      </label>
                      <input type="date" value={form.fecha_cierre}
                        onChange={e => set('fecha_cierre', e.target.value)}
                        className={inputCls(errs.fecha_cierre)} />
                      {errs.fecha_cierre && (
                        <p className="text-[11.5px] text-[#C0392B] mt-1">{errs.fecha_cierre}</p>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-[#EEF1FA] rounded-lg p-3 text-[12px] text-[#24388C]">
                    Se creará una nueva oportunidad y este lead pasará a estado{' '}
                    <strong>Convertido</strong>. Los intereses del lead se usarán para
                    pre-seleccionar productos.
                  </div>

                  {apiError && (
                    <p className="text-[12.5px] text-[#C0392B]">{apiError}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-[#F0F0F0] bg-[#F7F7F7] flex items-center justify-between gap-3">
                  <button type="button" onClick={() => navigate(`/leads/${id}`)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] rounded-lg hover:bg-[#F0F0F0] transition">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2 text-[13px] font-semibold text-white bg-[#1A8754] hover:bg-[#157043] rounded-lg transition disabled:opacity-50">
                    {saving ? 'Convirtiendo...' : 'Convertir a oportunidad'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </AppLayout>
  )
}
