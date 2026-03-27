import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import UsuarioForm from '../components/UsuarioForm'
import { FormCard } from '../../../shared/components/FormField'
import { useUsuarioForm } from '../hooks/useUsuarioForm'

export default function UsuarioCrearPage() {
  const navigate = useNavigate()
  const { form, errors, loading, apiError, setField, submit, myId } = useUsuarioForm({
    onSuccess: () => navigate('/usuarios'),
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/usuarios')}>
            Usuarios
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Crear usuario</span>
        </>
      } />
      <FormCard title="Crear nuevo usuario">
        <UsuarioForm
          form={form} errors={errors} loading={loading}
          apiError={apiError} setField={setField}
          onSubmit={submit} onCancel={() => navigate('/usuarios')}
          isEdit={false} myId={myId}
        />
      </FormCard>
    </AppLayout>
  )
}
