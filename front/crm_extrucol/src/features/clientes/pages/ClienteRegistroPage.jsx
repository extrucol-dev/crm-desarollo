import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ClienteForm from '../components/ClienteForm'
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
          <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate('/clientes')}>Clientes</span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Registrar nuevo</span>
        </>
      } />
      <div className="p-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0F0F0]">
            <span className="text-[15px] font-bold text-[#1A1A1A]">Registrar nuevo cliente</span>
          </div>
          <ClienteForm form={form} errors={errors} loading={loading} apiError={apiError} setField={setField} onSubmit={submit} onCancel={() => navigate('/clientes')} />
        </div>
      </div>
    </AppLayout>
  )
}
