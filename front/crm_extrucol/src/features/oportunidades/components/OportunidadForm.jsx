import { FormField, Input, Select, Textarea, FormActions, ApiErrorAlert } from '../../../shared/components/FormField'

const TIPOS = [
  { value: 'COTIZACION',     label: 'Cotización' },
  { value: 'VENTA',          label: 'Venta de producto' },
  { value: 'ACOMPANAMIENTO', label: 'Acompañamiento técnico' },
  { value: 'PROYECTO',       label: 'Proyecto' },
]

export default function OportunidadForm({ form, errors, loading, apiError, clientes, setField, onSubmit, onCancel, isEdit }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <ApiErrorAlert message={apiError} />

      {/* Nombre */}
      <div className="mb-4">
        <FormField label="Nombre de la oportunidad" required error={errors.nombre}>
          <Input placeholder="Ej: Propuesta Tuberías PVC Q2"
            value={form.nombre} onChange={setField('nombre')} error={errors.nombre} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Cliente */}
        <FormField label="Cliente" required error={errors.cliente}>
          <Select value={form.cliente} onChange={setField('cliente')} error={errors.cliente}>
            <option value="">Seleccionar cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} — {c.empresa}</option>
            ))}
          </Select>
        </FormField>

        {/* Tipo */}
        <FormField label="Tipo" required error={errors.tipo}>
          <Select value={form.tipo} onChange={setField('tipo')} error={errors.tipo}>
            <option value="">Seleccionar tipo</option>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Valor estimado */}
        <FormField label="Valor estimado (COP)" required error={errors.valor_estimado}>
          <Input type="number" placeholder="Ej: 18000000" min={0}
            value={form.valor_estimado} onChange={setField('valor_estimado')} error={errors.valor_estimado} />
        </FormField>

        {/* Fecha de cierre */}
        <FormField label="Fecha de cierre esperada" error={errors.fecha_cierre}>
          <Input type="date" value={form.fecha_cierre} onChange={setField('fecha_cierre')} error={errors.fecha_cierre} />
        </FormField>
      </div>

      {/* Descripción */}
      <div className="mb-6">
        <FormField label="Descripción" required error={errors.descripcion}>
          <Textarea rows={3} placeholder="Describe el alcance y contexto de la oportunidad..."
            value={form.descripcion} onChange={setField('descripcion')} error={errors.descripcion} />
        </FormField>
      </div>

      <div className="h-px bg-[#F0F0F0] mb-5" />
      <FormActions
        onCancel={onCancel}
        loading={loading}
        submitLabel={isEdit ? 'Guardar cambios' : 'Crear oportunidad'}
      />
    </form>
  )
}
