import { FormField, Input, Select, Textarea, FormActions, ApiErrorAlert } from '../../../shared/components/FormField'

const TIPO_LABEL = {
  VISITA:        'Visita presencial',
  REUNION:       'Reunión',
  LLAMADA:       'Llamada telefónica',
  COTIZACION:    'Envío de cotización',
  PRESENTACION:  'Presentación',
  DEMOSTRACION:  'Demostración',
}

export default function ActividadForm({ form, errors, loading, apiError, setField, onSubmit, onCancel, isEdit, TIPOS }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <ApiErrorAlert message={apiError} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Tipo */}
        <FormField label="Tipo de actividad" required error={errors.tipo}>
          <Select value={form.tipo} onChange={setField('tipo')} error={errors.tipo}
            disabled={isEdit}>
            <option value="">Seleccionar tipo</option>
            {TIPOS.map(t => (
              <option key={t} value={t}>{TIPO_LABEL[t] ?? t}</option>
            ))}
          </Select>
          {isEdit && (
            <p className="text-[11.5px] text-[#ABABAB] mt-1">El tipo no es editable</p>
          )}
        </FormField>

        {/* Fecha — no editable en CE-31 */}
        <FormField label="Fecha y hora" required error={errors.fecha_actividad}>
          <Input
            type="datetime-local"
            value={form.fecha_actividad}
            onChange={setField('fecha_actividad')}
            error={errors.fecha_actividad}
            disabled={isEdit}
          />
          {isEdit && (
            <p className="text-[11.5px] text-[#ABABAB] mt-1">La fecha no es editable</p>
          )}
        </FormField>
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <FormField label="Descripción" required error={errors.descripcion}>
          <Textarea
            rows={3}
            placeholder="Describe el objetivo y contexto de la actividad... (mínimo 10 caracteres)"
            value={form.descripcion}
            onChange={setField('descripcion')}
            error={errors.descripcion}
          />
        </FormField>
      </div>

      {/* Virtual toggle — no editable en CE-31 */}
      {!isEdit && (
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.virtual}
                onChange={setField('virtual')}
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.virtual ? 'bg-[#24388C]' : 'bg-[#D5D5D5]'}`} />
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.virtual ? 'left-5' : 'left-1'}`} />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-[#1A1A1A]">
                {form.virtual ? 'Actividad virtual' : 'Actividad presencial'}
              </div>
              <div className="text-[12px] text-[#6B6B6B]">
                {form.virtual
                  ? 'No se requerirá verificación de ubicación GPS'
                  : 'Se capturará tu ubicación GPS al registrar el resultado'}
              </div>
            </div>
          </label>
        </div>
      )}

      <div className="h-px bg-[#F0F0F0] mb-5" />
      <FormActions
        onCancel={onCancel}
        loading={loading}
        submitLabel={isEdit ? 'Guardar cambios' : 'Registrar actividad'}
      />
    </form>
  )
}
