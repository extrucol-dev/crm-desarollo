import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { FormCard, FormField, Input, Textarea, FormActions, ApiErrorAlert } from '../../../shared/components/FormField'
import { useProyectoForm } from '../hooks/useProyectoForm'

export default function ProyectoCrearPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const oportunidadId = location.state?.oportunidadId ?? ''

  const { form, errors, loading, apiError, setField, submit } = useProyectoForm({
    oportunidadId,
    onSuccess: () => navigate('/proyectos'),
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/proyectos')}>Proyectos</span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Nuevo proyecto</span>
        </>
      } />
      <FormCard title="Crear proyecto comercial">
        <form onSubmit={submit} noValidate>
          <ApiErrorAlert message={apiError} />
          <div className="mb-4">
            <FormField label="Nombre del proyecto" required error={errors.nombre}>
              <Input placeholder="Ej: Proyecto Tuberías PVC Norte"
                value={form.nombre} onChange={setField('nombre')} error={errors.nombre} />
            </FormField>
          </div>
          <div className="mb-6">
            <FormField label="Descripción" required error={errors.descripcion}>
              <Textarea rows={4}
                placeholder="Describe el alcance del proyecto y compromisos con el cliente... (mínimo 10 caracteres)"
                value={form.descripcion} onChange={setField('descripcion')} error={errors.descripcion} />
            </FormField>
          </div>
          <div className="h-px bg-[#F0F0F0] mb-5" />
          <FormActions
            onCancel={() => oportunidadId
              ? navigate(`/oportunidades/${oportunidadId}`)
              : navigate('/proyectos')}
            loading={loading}
            submitLabel="Crear proyecto"
          />
        </form>
      </FormCard>
    </AppLayout>
  )
}
