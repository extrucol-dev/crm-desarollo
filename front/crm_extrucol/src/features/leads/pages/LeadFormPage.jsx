import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { leadsAPI } from '../services/leadsAPI'
import { ciudadesAPI } from '../../../shared/services/ciudadesAPI'

const ORIGENES    = ['WhatsApp', 'Instagram', 'Facebook', 'Web', 'Referido', 'Feria', 'Llamada']
const INTERESES   = ['Tubería PE100', 'Tubería PE80', 'Accesorios PE', 'Válvulas', 'Riego', 'Sello FM', 'Manifold']

const SCORES = [
  { value: 20,  label: 'Frío',     desc: 'Sin intención clara',    dot: '#93C5FD', bg: '#EEF1FA', text: '#24388C' },
  { value: 40,  label: 'Tibio',    desc: 'Algo de interés',        dot: '#A5B4FC', bg: '#EEF1FA', text: '#6366F1' },
  { value: 60,  label: 'Moderado', desc: 'Necesidad identificada', dot: '#FCD34D', bg: '#FFF4E0', text: '#C7770D' },
  { value: 80,  label: 'Caliente', desc: 'Alta intención',         dot: '#FB923C', bg: '#FFF4E0', text: '#EA580C' },
  { value: 100, label: 'Urgente',  desc: 'Listo para comprar',     dot: '#4ADE80', bg: '#E8F5EE', text: '#1A8754' },
]

const EMPTY = {
  nombre: '', descripcion: '', empresa: '', email: '', telefono: '',
  origen: 'WhatsApp', sector: '', ciudad_id: '', contacto: '',
  intereses: [], score: 60,
}

const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label className="block text-[12.5px] font-semibold text-[#4A4A4A] mb-1.5">
      {label} {required && <span className="text-[#C0392B]">*</span>}
    </label>
    {children}
    {error && <p className="text-[11.5px] text-[#C0392B] mt-1">{error}</p>}
    {hint && !error && <p className="text-[11.5px] text-[#ABABAB] mt-1">{hint}</p>}
  </div>
)

const inputCls = (err) =>
  `w-full px-3 py-2 border rounded-lg text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#24388C] transition ${
    err ? 'border-[#C0392B]' : 'border-[#E5E5E5]'
  }`

export default function LeadFormPage() {
  const navigate   = useNavigate()
  const { id }     = useParams()
  const esEdicion  = Boolean(id)

  const [form, setForm]         = useState(EMPTY)
  const [ciudades, setCiudades] = useState([])
  const [loadingLead, setLoadingLead] = useState(esEdicion)
  const [saving, setSaving]     = useState(false)
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const toggleInteres = (interes) =>
    set('intereses', form.intereses.includes(interes)
      ? form.intereses.filter(i => i !== interes)
      : [...form.intereses, interes]
    )

  useEffect(() => {
    ciudadesAPI.listar().then(list => setCiudades(list ?? []))
  }, [])

  useEffect(() => {
    if (!esEdicion) return
    leadsAPI.buscar(id)
      .then(lead => {
        if (lead) setForm({
          nombre:      lead.nombre      ?? '',
          descripcion: lead.descripcion ?? '',
          empresa:     lead.empresa     ?? '',
          email:       lead.email       ?? '',
          telefono:    lead.telefono    ?? '',
          origen:      lead.origen      ?? 'WhatsApp',
          sector:      lead.sector      ?? '',
          ciudad_id:   lead.ciudad_id   ?? '',
          contacto:    lead.contacto    ?? '',
          intereses:   lead.intereses   ?? [],
          score:       lead.score       ?? 60,
        })
      })
      .catch(() => setApiError('No se pudo cargar el lead.'))
      .finally(() => setLoadingLead(false))
  }, [id, esEdicion])

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El título es requerido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true); setApiError('')
    try {
      if (esEdicion) {
        await leadsAPI.actualizar(id, form)
        navigate(`/leads/${id}`)
      } else {
        const result = await leadsAPI.crear(form)
        navigate(result?.id ? `/leads/${result.id}` : '/leads')
      }
    } catch {
      setApiError('No se pudo guardar el lead. Intenta de nuevo.')
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
      <span>{esEdicion ? 'Editar lead' : 'Nuevo lead'}</span>
    </>
  )

  if (loadingLead) return (
    <AppLayout>
      <Topbar breadcrumb={breadcrumb} />
      <div className="p-6"><LoadingSpinner label="Cargando lead..." /></div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <Topbar breadcrumb={breadcrumb} />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-[20px] font-extrabold text-[#1A1A1A]">
            {esEdicion ? 'Editar lead' : 'Nuevo lead'}
          </h1>
          <p className="text-[13px] text-[#6B6B6B] mt-1">
            Registra un prospecto y sus intereses comerciales
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-[#F0F0F0] rounded-xl shadow-sm overflow-hidden">

            {/* ── Información básica ── */}
            <div className="p-5 border-b border-[#F0F0F0]">
              <h2 className="text-[11px] font-bold text-[#24388C] uppercase tracking-wider mb-4">
                Información básica
              </h2>
              <div className="flex flex-col gap-4">
                <Field label="Título del lead" required error={errors.nombre}
                  hint="Un resumen breve de la necesidad del prospecto">
                  <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                    placeholder="Ej: Cotización tubería PE100 para proyecto"
                    className={inputCls(errors.nombre)} />
                </Field>
                <Field label="Descripción">
                  <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                    rows={3} placeholder="Detalles adicionales sobre el lead..."
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#24388C] transition resize-none" />
                </Field>
              </div>
            </div>

            {/* ── Origen ── */}
            <div className="p-5 border-b border-[#F0F0F0]">
              <h2 className="text-[11px] font-bold text-[#24388C] uppercase tracking-wider mb-4">
                Origen del lead
              </h2>
              <div className="flex flex-wrap gap-2">
                {ORIGENES.map(origen => (
                  <button key={origen} type="button" onClick={() => set('origen', origen)}
                    className={`px-3 py-2 rounded-lg border text-[12.5px] font-semibold transition-all ${
                      form.origen === origen
                        ? 'border-[#24388C] bg-[#EEF1FA] text-[#24388C]'
                        : 'border-[#E5E5E5] text-[#4A4A4A] hover:border-[#24388C]'
                    }`}>
                    {origen}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Empresa y contacto ── */}
            <div className="p-5 border-b border-[#F0F0F0]">
              <h2 className="text-[11px] font-bold text-[#24388C] uppercase tracking-wider mb-4">
                Empresa y contacto
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Empresa">
                  <input value={form.empresa} onChange={e => set('empresa', e.target.value)}
                    placeholder="Nombre de la empresa" className={inputCls()} />
                </Field>
                <Field label="Ciudad">
                  <select value={form.ciudad_id} onChange={e => set('ciudad_id', e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-[13px] text-[#4A4A4A] focus:outline-none focus:border-[#24388C] transition bg-white">
                    <option value="">Seleccionar ciudad...</option>
                    {ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </Field>
                <Field label="Nombre del contacto">
                  <input value={form.contacto} onChange={e => set('contacto', e.target.value)}
                    placeholder="Nombre del contacto" className={inputCls()} />
                </Field>
                <Field label="Teléfono">
                  <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                    placeholder="+57 300 000 0000" className={inputCls()} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email del contacto">
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="cliente@empresa.com" className={inputCls()} />
                  </Field>
                </div>
              </div>
            </div>

            {/* ── Intereses ── */}
            <div className="p-5 border-b border-[#F0F0F0]">
              <h2 className="text-[11px] font-bold text-[#24388C] uppercase tracking-wider mb-1.5">
                Intereses
              </h2>
              <p className="text-[11.5px] text-[#ABABAB] mb-3">
                Selecciona todos los productos o servicios de interés
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESES.map(interes => {
                  const sel = form.intereses.includes(interes)
                  return (
                    <button key={interes} type="button" onClick={() => toggleInteres(interes)}
                      className={`px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all ${
                        sel
                          ? 'border-[#24388C] bg-[#EEF1FA] text-[#24388C]'
                          : 'border-[#E5E5E5] text-[#4A4A4A] hover:border-[#24388C]'
                      }`}>
                      {sel && <span className="mr-1">✓</span>}
                      {interes}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Score ── */}
            <div className="p-5 border-b border-[#F0F0F0]">
              <h2 className="text-[11px] font-bold text-[#24388C] uppercase tracking-wider mb-1.5">
                Score inicial
              </h2>
              <p className="text-[11.5px] text-[#ABABAB] mb-3">
                Calificación prospectiva — ayuda a priorizar el seguimiento
              </p>
              <div className="grid grid-cols-5 gap-2">
                {SCORES.map(s => {
                  const sel = form.score === s.value
                  return (
                    <button key={s.value} type="button" onClick={() => set('score', s.value)}
                      className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        sel ? 'border-[#24388C] bg-[#EEF1FA]' : 'border-[#F0F0F0] bg-white hover:border-[#24388C]/40'
                      }`}>
                      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                        style={{ background: s.dot }} />
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 text-[14px] font-extrabold"
                        style={{ background: s.bg, color: s.text }}>
                        {s.value}
                      </div>
                      <div className="text-[10.5px] font-bold text-[#4A4A4A] uppercase tracking-wide">
                        {s.label}
                      </div>
                      <div className="text-[10px] text-[#ABABAB] text-center mt-0.5 hidden sm:block">
                        {s.desc}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Acciones ── */}
            <div className="p-5 bg-[#F7F7F7] flex items-center gap-3 flex-wrap">
              {apiError && (
                <p className="text-[12.5px] text-[#C0392B] flex-1 min-w-full sm:min-w-0">{apiError}</p>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button type="button" onClick={() => navigate('/leads')}
                  className="px-4 py-2 text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] rounded-lg hover:bg-[#F0F0F0] transition">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] rounded-lg transition disabled:opacity-60">
                  {saving ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Guardar lead'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
