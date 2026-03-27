import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import OportunidadForm from '../components/OportunidadForm'
import { FormCard, LoadingSpinner } from '../../../shared/components/FormField'
import { useOportunidadForm } from '../hooks/useOportunidadForm'

export default function OportunidadEditarPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { form, errors, loading, fetching, apiError, clientes, cerrada, setField, submit } =
    useOportunidadForm({
      id,
      onSuccess: () => navigate(`/oportunidades/${id}`),
    })

  // CE-28: no mostrar edición si está cerrada
  if (!fetching && cerrada) {
    return (
      <AppLayout>
        <Topbar breadcrumb={
          <>
            <span className="text-[#24388C] cursor-pointer hover:underline"
              onClick={() => navigate('/oportunidades')}>
              Oportunidades
            </span>
            <span className="text-[#D5D5D5]">›</span>
            <span>Editar</span>
          </>
        } />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="text-[15px] font-bold text-[#1A1A1A] mb-2">Oportunidad cerrada</div>
            <div className="text-[13px] text-[#6B6B6B] mb-5">
              Las oportunidades cerradas (Ganada o Perdida) no pueden editarse.
            </div>
            <button
              onClick={() => navigate(`/oportunidades/${id}`)}
              className="px-5 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/oportunidades')}>
            Oportunidades
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate(`/oportunidades/${id}`)}>
            Detalle
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Editar</span>
        </>
      } />

      {fetching ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando oportunidad..." />
        </div>
      ) : (
        <FormCard title="Editar oportunidad">
          <OportunidadForm
            form={form} errors={errors} loading={loading}
            apiError={apiError} clientes={clientes}
            setField={setField} onSubmit={submit}
            onCancel={() => navigate(`/oportunidades/${id}`)}
            isEdit
          />
        </FormCard>
      )}
    </AppLayout>
  )
}
