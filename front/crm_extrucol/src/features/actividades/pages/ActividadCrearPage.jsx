import { useNavigate, useLocation } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import ActividadForm from '../components/ActividadForm'
import { FormCard } from '../../../shared/components/FormField'
import { useActividadForm } from '../hooks/useActividadForm'

export default function ActividadCrearPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const oportunidadId = location.state?.oportunidadId ?? ''

  const { form, errors, loading, apiError, setField, submit, TIPOS } = useActividadForm({
    oportunidadIdInicial: oportunidadId,
    onSuccess: () => {
      // Volver al detalle de la oportunidad si venimos desde allí
      if (oportunidadId) navigate(`/oportunidades/${oportunidadId}`)
      else navigate('/oportunidades')
    },
  })

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => oportunidadId
              ? navigate(`/oportunidades/${oportunidadId}`)
              : navigate('/oportunidades')}>
            {oportunidadId ? 'Oportunidad' : 'Oportunidades'}
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span>Registrar actividad</span>
        </>
      } />
      <FormCard title="Registrar actividad">
        {/* Aviso GPS para actividades presenciales */}
        {!form.virtual && (
          <div className="flex items-start gap-3 bg-[#EEF1FA] border border-[#24388C]/20 rounded-lg px-4 py-3 mb-5 text-[12.5px] text-[#24388C]">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>
              Esta actividad es <strong>presencial</strong>. Al registrar el resultado se capturará tu ubicación GPS automáticamente. Asegúrate de tener el GPS activado.
            </span>
          </div>
        )}
        <ActividadForm
          form={form} errors={errors} loading={loading}
          apiError={apiError} setField={setField} onSubmit={submit}
          onCancel={() => oportunidadId
            ? navigate(`/oportunidades/${oportunidadId}`)
            : navigate('/oportunidades')}
          isEdit={false}
          TIPOS={TIPOS}
        />
      </FormCard>
    </AppLayout>
  )
}
