import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ActividadForm from '../components/ActividadForm'
import { FormCard, LoadingSpinner } from '../../../shared/components/FormField'
import { useActividadForm } from '../hooks/useActividadForm'

export default function ActividadEditarPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { form, errors, loading, fetching, apiError, setField, submit, TIPOS } =
    useActividadForm({
      id,
      onSuccess: () => {
        const opId = form.oportunidad
        if (opId) navigate(`/oportunidades/${opId}`)
        else navigate('/oportunidades')
      },
    })

  const handleCancel = () => {
    const opId = form.oportunidad
    if (opId) navigate(`/oportunidades/${opId}`)
    else navigate('/oportunidades')
  }

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={handleCancel}>
            Oportunidad
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Editar actividad</span>
        </>
      } />

      {fetching ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando actividad..." />
        </div>
      ) : (
        <FormCard title="Editar actividad">
          {/* CE-31: aviso de campos no editables */}
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#F59E0B]/30 rounded-lg px-4 py-3 mb-5 text-[12.5px] text-[#92400E]">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>
              El <strong>tipo</strong> y la <strong>fecha</strong> de la actividad no son editables una vez registrada.
            </span>
          </div>

          <ActividadForm
            form={form} errors={errors} loading={loading}
            apiError={apiError} setField={setField} onSubmit={submit}
            onCancel={handleCancel}
            isEdit={true}
            TIPOS={TIPOS}
          />
        </FormCard>
      )}
    </AppLayout>
  )
}
