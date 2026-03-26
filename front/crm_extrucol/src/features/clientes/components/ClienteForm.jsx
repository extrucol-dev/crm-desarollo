const SECTORES = ['Construcción', 'Industrial', 'Metal-mecánico', 'Logística', 'Textil', 'Agropecuario', 'Servicios', 'Otro']

function Field({ label, type = 'text', placeholder, required, value, onChange, error }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
        {label} {required && <span className="text-[#C0392B]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white border rounded-md outline-none placeholder:text-[#ABABAB] transition-all duration-150
          ${error ? 'border-[#C0392B] ring-2 ring-[#C0392B]/10' : 'border-[#D5D5D5] focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15'}`}
      />
      {error && <p className="text-[11.5px] text-[#C0392B] mt-1">⚠️ {error}</p>}
    </div>
  )
}

export default function ClienteForm({ form, errors, loading, apiError, setField, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} noValidate className="p-6">
      {apiError && (
        <div className="flex items-start gap-2 text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-5">
          <span className="flex-shrink-0">⚠️</span> {apiError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Nombre del contacto" placeholder="Ej: Luis García" required value={form.nombre} onChange={setField('nombre')} error={errors.nombre} />
        <Field label="Empresa" placeholder="Ej: Constructora ABC Ltda." required value={form.empresa} onChange={setField('empresa')} error={errors.empresa} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
            Sector <span className="text-[#C0392B]">*</span>
          </label>
          <select
            value={form.sector}
            onChange={setField('sector')}
            className={`w-full px-3 py-[9px] text-[13.5px] bg-white border rounded-md outline-none transition-all duration-150
              ${errors.sector ? 'border-[#C0392B] ring-2 ring-[#C0392B]/10' : 'border-[#D5D5D5] focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15'}`}
          >
            <option value="">Seleccionar sector</option>
            {SECTORES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.sector && <p className="text-[11.5px] text-[#C0392B] mt-1">⚠️ {errors.sector}</p>}
        </div>
        <Field label="Ciudad" placeholder="Ej: Bogotá" required value={form.ciudad} onChange={setField('ciudad')} error={errors.ciudad} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Teléfono" placeholder="Ej: 3001234567" required value={form.telefono} onChange={setField('telefono')} error={errors.telefono} />
        <Field label="Correo electrónico" type="email" placeholder="contacto@empresa.com" required value={form.email} onChange={setField('email')} error={errors.email} />
      </div>

      <div className="h-px bg-[#F0F0F0] mb-5" />

      <div className="flex gap-2.5 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-md text-[13px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {loading ? (
            <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Guardando...</>
          ) : 'Guardar cliente'}
        </button>
      </div>
    </form>
  )
}
