import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import OportunidadForm from '../components/OportunidadForm'
import { FormCard } from '../../../shared/components/FormField'
import { useOportunidadForm } from '../hooks/useOportunidadForm'

export default function OportunidadCrearPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  // Puede venir pre-seleccionado desde detalle del cliente
  const clienteIdInicial = location.state?.clienteId ?? ''

  const { form, errors, loading, apiError, clientes, setField, submit } = useOportunidadForm({
    clienteIdInicial,
    onSuccess: () => navigate('/oportunidades'),
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/oportunidades')}>
            Oportunidades
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Nueva oportunidad</span>
        </>
      } />
      <FormCard title="Nueva oportunidad comercial">
        <OportunidadForm
          form={form} errors={errors} loading={loading}
          apiError={apiError} clientes={clientes}
          setField={setField} onSubmit={submit}
          onCancel={() => navigate('/oportunidades')}
          isEdit={false}
        />
      </FormCard>
    </AppLayout>
  )
}
