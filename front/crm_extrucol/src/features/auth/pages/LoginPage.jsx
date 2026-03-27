import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Panel izquierdo */}
      <div className="relative hidden lg:flex flex-col justify-center px-16 py-20 overflow-hidden"
        style={{ background: '#24388C' }}>
        <div className="absolute pointer-events-none" style={{ width: 400, height: 400, top: -100, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,150,16,0.22) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ width: 300, height: 300, bottom: -80, left: -80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <h1 className="text-[32px] font-extrabold text-white mb-1" style={{ letterSpacing: '-0.04em' }}>
            CRM <span style={{ color: '#F39610' }}>Extrucol</span>
          </h1>
          <p className="text-[15px] mb-12" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Gestión comercial inteligente
          </p>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Gestión centralizada de clientes y oportunidades', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
              { label: 'Registro de actividades con verificación de ubicación', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
              { label: 'Pipeline visual en tiempo real para el equipo', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
            ].map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Panel derecho */}
      <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <LoginForm />
      </div>
    </div>
  )
}
