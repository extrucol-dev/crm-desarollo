import { FormField, Input, Select, FormActions, ApiErrorAlert } from '../../../shared/components/FormField'

const ROLES = [
  { value: 'EJECUTIVO', label: 'Ejecutivo Comercial' },
  { value: 'DIRECTOR',  label: 'Director Comercial' },
  { value: 'ADMIN',     label: 'Administrador' },
]

export default function UsuarioForm({ form, errors, loading, apiError, setField, onSubmit, onCancel, isEdit, myId, userId }) {
  const isSelf = isEdit && String(userId) === String(myId)

  return (
    <form onSubmit={onSubmit} noValidate>
      <ApiErrorAlert message={apiError} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormField label="Nombre completo" required error={errors.nombre}
          hint="Mínimo 5 caracteres">
          <Input placeholder="Ej: María Rodríguez" value={form.nombre}
            onChange={setField('nombre')} error={errors.nombre} />
        </FormField>
        <FormField label="Correo electrónico" required error={errors.email}>
          <Input type="email" placeholder="usuario@extrucol.com" value={form.email}
            onChange={setField('email')} error={errors.email} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormField
          label={isEdit ? 'Nueva contraseña' : 'Contraseña'}
          required={!isEdit}
          error={errors.password}
          hint={isEdit ? 'Dejar vacío para no cambiarla' : 'Mínimo 6 caracteres'}
        >
          <Input type="password" placeholder="••••••••" value={form.password}
            onChange={setField('password')} error={errors.password} />
        </FormField>

        <FormField label="Rol" required error={errors.rol}>
          {/* CE-22: deshabilitar cambio de rol si es el propio admin */}
          <Select value={form.rol} onChange={setField('rol')} error={errors.rol}
            disabled={isSelf}>
            <option value="">Seleccionar rol</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Select>
          {isSelf && (
            <p className="text-[11.5px] text-[#6B6B6B] mt-1">
              No puedes modificar tu propio rol
            </p>
          )}
        </FormField>
      </div>

      {/* Solo mostrar toggle activo en edición */}
      {isEdit && !isSelf && (
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={form.activo}
                onChange={setField('activo')} />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.activo ? 'bg-[#24388C]' : 'bg-[#D5D5D5]'}`} />
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.activo ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-[13px] font-semibold text-[#4A4A4A]">
              Usuario {form.activo ? 'activo' : 'inactivo'}
            </span>
          </label>
        </div>
      )}

      <div className="h-px bg-[#F0F0F0] mb-5" />
      <FormActions onCancel={onCancel} loading={loading}
        submitLabel={isEdit ? 'Guardar cambios' : 'Crear usuario'} />
    </form>
  )
}
