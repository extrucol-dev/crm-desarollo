import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { FormCard, FormField, Input, Select, Textarea, FormActions, ApiErrorAlert, LoadingSpinner } from '../../../shared/components/FormField'
import { useProyectoForm } from '../hooks/useProyectoForm'
import { ESTADOS_PROYECTO } from '../hooks/useProyectos'

const ESTADO_LABEL = { ACTIVO: 'Activo', PAUSADO: 'Pausado', COMPLETADO: 'Completado', CANCELADO: 'Cancelado' }

export default function ProyectoEditarPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { form, errors, loading, fetching, apiError, setField, submit } = useProyectoForm({
    id,
    onSuccess: () => navigate(`/proyectos/${id}`),
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/proyectos')}>Proyectos</span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate(`/proyectos/${id}`)}>Detalle</span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Editar</span>
        </>
      } />
      {fetching ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando proyecto..." />
        </div>
      ) : (
        <FormCard title="Editar proyecto">
          <form onSubmit={submit} noValidate>
            <ApiErrorAlert message={apiError} />
            <div className="mb-4">
              <FormField label="Nombre del proyecto" required error={errors.nombre}>
                <Input value={form.nombre} onChange={setField('nombre')} error={errors.nombre} />
              </FormField>
            </div>
            <div className="mb-4">
              <FormField label="Estado" required error={errors.estado}>
                <Select value={form.estado} onChange={setField('estado')}>
                  {ESTADOS_PROYECTO.map(e => (
                    <option key={e} value={e}>{ESTADO_LABEL[e] ?? e}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <div className="mb-6">
              <FormField label="Descripción" required error={errors.descripcion}>
                <Textarea rows={4} value={form.descripcion} onChange={setField('descripcion')} error={errors.descripcion} />
              </FormField>
            </div>
            <div className="h-px bg-[#F0F0F0] mb-5" />
            <FormActions onCancel={() => navigate(`/proyectos/${id}`)} loading={loading} submitLabel="Guardar cambios" />
          </form>
        </FormCard>
      )}
    </AppLayout>
  )
}
