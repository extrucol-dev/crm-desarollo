import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import UsuarioForm from '../components/UsuarioForm'
import { FormCard, LoadingSpinner } from '../../../shared/components/FormField'
import { useUsuarioForm } from '../hooks/useUsuarioForm'

export default function UsuarioEditarPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { form, errors, loading, fetching, apiError, setField, submit, myId } = useUsuarioForm({
    id,
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
          <span>Editar usuario</span>
        </>
      } />

      {fetching ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando usuario..." />
        </div>
      ) : (
        <FormCard title="Editar usuario">
          <UsuarioForm
            form={form} errors={errors} loading={loading}
            apiError={apiError} setField={setField}
            onSubmit={submit} onCancel={() => navigate('/usuarios')}
            isEdit userId={id} myId={myId}
          />
        </FormCard>
      )}
    </AppLayout>
  )
}
