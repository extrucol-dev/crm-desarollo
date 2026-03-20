
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
 
async function postData(e,p) {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: e, password: p })
  });
  const data = await response.json();
  console.log(data);
}



  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
 
    if (!email || !password) {
      setError('Completa todos los campos para continuar.')
      return
    }
 
    setLoading(true)
    try {
      // TODO: reemplazar con llamada real al backend
      // const res = await authService.login({ email, password })
      // navigate('/dashboard')
      await postData(email, password) // simulación
      navigate('/dashboard')
    } catch {
      setError('Credenciales incorrectas. Verifica e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-['DM_Sans',sans-serif]">
 
      {/* ── Panel izquierdo — Azul corporativo ── */}
      <div
        className="relative hidden lg:flex flex-col justify-center px-16 py-20 overflow-hidden"
        style={{ background: '#24388C' }}
      >
        {/* Blob naranja superior derecho */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            top: -100,
            right: -100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(243,150,16,0.22) 0%, transparent 70%)',
          }}
        />
        {/* Blob blanco inferior izquierdo */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            bottom: -80,
            left: -80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          }}
        />
 
        {/* Brand */}
        <div className="relative z-10">
          <h1
            className="text-[32px] font-extrabold text-white mb-1"
            style={{ letterSpacing: '-0.04em' }}
          >
            CRM{' '}
            <span style={{ color: '#F39610' }}>Extrucol</span>
          </h1>
          <p className="text-[15px] mb-12" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Gestión comercial inteligente
          </p>
 
          {/* Features */}
          <div className="flex flex-col gap-5">
            {[
              { icon: '', text: 'Gestión centralizada de clientes y oportunidades' },
              { icon: '', text: 'Registro de actividades con verificación GPS' },
              { icon: '', text: 'Pipeline visual en tiempo real para el equipo' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                >
                  {icon}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Panel derecho — Formulario ── */}
      <div className="flex items-center justify-center bg-white px-8 py-16">
        <div className="w-full max-w-[380px]">
 
          {/* Saludo */}
          <h2
            className="text-[26px] font-extrabold text-[#1A1A1A] mb-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            Bienvenido de nuevo
          </h2>
          <p className="text-sm text-[#6B6B6B] mb-8">
            Ingresa con tus credenciales para continuar
          </p>
 
          {/* Error global */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-5">
              <span className="mt-px flex-shrink-0"></span>
              <span>{error}</span>
            </div>
          )}
 
          <form onSubmit={handleSubmit} noValidate>
 
            {/* Email */}
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="usuario@extrucol.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white
                  border border-[#D5D5D5] rounded-md outline-none
                  placeholder:text-[#ABABAB] transition-all duration-150
                  focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
              />
            </div>
 
            {/* Contraseña */}
            <div className="mb-2">
              <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white
                  border border-[#D5D5D5] rounded-md outline-none
                  placeholder:text-[#ABABAB] transition-all duration-150
                  focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
              />
            </div>
 
            {/* Olvidé contraseña */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => navigate('/recuperar-password')}
                className="text-[13px] font-semibold text-[#24388C] hover:text-[#1B2C6B] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
 
            {/* Botón ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md
                text-[13.5px] font-semibold text-white
                bg-[#24388C] hover:bg-[#1B2C6B] active:scale-[0.98]
                transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Verificando...
                </>
              ) : (
                'Ingresar al sistema'
              )}
            </button>
 
          </form>
 
          {/* Footer */}
          <p className="text-center text-[12px] text-[#ABABAB] mt-6">
            Sistema CRM · Extrucol S.A.S · v1.0
          </p>
        </div>
      </div>
 
    </div>
  )
}
