import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%]  font-['DM_Sans',sans-serif]">

      {/* Panel izquierdo — azul corporativo */}
      <div className="relative hidden lg:flex flex-col justify-center px-16 py-20 overflow-hidden" style={{ background: '#24388C' }}>
        <div className="absolute pointer-events-none" style={{ width: 400, height: 400, top: -100, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,150,16,0.22) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ width: 300, height: 300, bottom: -80, left: -80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <h1 className="text-[32px] font-extrabold text-white mb-1" style={{ letterSpacing: '-0.04em' }}>
            CRM <span style={{ color: '#F39610' }}>Extrucol</span>
          </h1>
          <p className="text-[15px] mb-12" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Gestión comercial inteligente
          </p>
         {/* <div className="flex flex-col gap-5">
            {[
              { icon: ' ', text: 'Gestión centralizada de clientes y oportunidades' },
              { icon: ' ', text: 'Registro de actividades con verificación GPS' },
              { icon: ' ', text: 'Pipeline visual en tiempo real para el equipo' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.10)' }}>
                  {icon}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{text}</span>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex items-center justify-center bg-white px-8 py-16 ">
        <LoginForm />
      </div>
    </div>
  )
}
