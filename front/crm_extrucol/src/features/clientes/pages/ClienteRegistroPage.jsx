import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ClienteForm from '../components/ClienteForm'
import { FormCard } from '../../../shared/components/FormField'
import { useClienteForm } from '../hooks/useClienteForm'

export default function ClienteRegistroPage() {
  const navigate = useNavigate()
  const { form, errors, loading, apiError, setField, submit } = useClienteForm({
    onSuccess: () => navigate('/clientes'),
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate('/clientes')}>
            Mis Clientes
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Registrar nuevo</span>
        </>
      } />
      <FormCard title="Registrar nuevo cliente">
        <ClienteForm form={form} errors={errors} loading={loading} apiError={apiError}
          setField={setField} onSubmit={submit} onCancel={() => navigate('/clientes')} />
      </FormCard>
    </AppLayout>
  )
}
