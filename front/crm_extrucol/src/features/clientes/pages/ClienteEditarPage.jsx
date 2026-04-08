import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ClienteForm from '../components/ClienteForm'
import { FormCard, LoadingSpinner } from '../../../shared/components/FormField'
import { useClienteForm } from '../hooks/useClienteForm'

export default function ClienteEditarPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // ciudades viene del hook — se carga desde GET /api/ciudades
  const { form, errors, loading, fetching, apiError, ciudades, setField, submit } = useClienteForm({
    id,
    onSuccess: () => navigate(`/clientes/${id}`),
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate('/clientes')}>
            Mis Clientes
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate(`/clientes/${id}`)}>
            Detalle
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Editar</span>
        </>
      } />

      {fetching ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando datos del cliente..." />
        </div>
      ) : (
        <FormCard title="Editar cliente">
          <ClienteForm
            form={form} errors={errors} loading={loading}
            apiError={apiError} ciudades={ciudades}
            setField={setField} onSubmit={submit}
            onCancel={() => navigate(`/clientes/${id}`)}
          />
        </FormCard>
      )}
    </AppLayout>
  )
}