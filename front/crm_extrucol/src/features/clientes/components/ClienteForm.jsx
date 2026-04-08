import { FormField, Input, Select, FormActions, ApiErrorAlert } from '../../../shared/components/FormField'

const SECTORES = ['Construcción', 'Industrial', 'Metal-mecánico', 'Logística', 'Textil', 'Agropecuario', 'Servicios', 'Otro']

export default function ClienteForm({ form, errors, loading, apiError, ciudades, setField, onSubmit, onCancel }) {
  // ciudades puede llegar undefined mientras el hook carga — usar [] como fallback
  const listaCiudades = ciudades ?? []

  return (
    <form onSubmit={onSubmit} noValidate>
      <ApiErrorAlert message={apiError} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormField label="Nombre del contacto" required error={errors.nombre}>
          <Input placeholder="Ej: Luis García" value={form.nombre} onChange={setField('nombre')} error={errors.nombre} />
        </FormField>
        <FormField label="Empresa" required error={errors.empresa}>
          <Input placeholder="Ej: Constructora ABC Ltda." value={form.empresa} onChange={setField('empresa')} error={errors.empresa} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormField label="Sector" required error={errors.sector}>
          <Select value={form.sector} onChange={setField('sector')} error={errors.sector}>
            <option value="">Seleccionar sector</option>
            {SECTORES.map(s => <option key={s}>{s}</option>)}
          </Select>
        </FormField>

        {/* Ciudad — select desde GET /api/ciudades */}
        <FormField label="Ciudad" required error={errors.ciudad}>
          <Select value={form.ciudad} onChange={setField('ciudad')} error={errors.ciudad}>
            <option value="">
              {listaCiudades.length === 0 ? 'Cargando ciudades...' : 'Seleccionar ciudad'}
            </option>
            {listaCiudades.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <FormField label="Teléfono" required error={errors.telefono} hint="Solo números, entre 7 y 15 dígitos">
          <Input type="tel" placeholder="Ej: 3001234567" value={form.telefono} onChange={setField('telefono')} error={errors.telefono} />
        </FormField>
        <FormField label="Correo electrónico" required error={errors.email}>
          <Input type="email" placeholder="contacto@empresa.com" value={form.email} onChange={setField('email')} error={errors.email} />
        </FormField>
      </div>

      <div className="h-px bg-[#F0F0F0] mb-5" />
      <FormActions onCancel={onCancel} loading={loading} submitLabel="Guardar cliente" />
    </form>
  )
}