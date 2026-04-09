import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Input, FormField, ApiErrorAlert } from '../../../shared/components/FormField'

export default function LoginForm() {
  const navigate = useNavigate()
  const { loading, error, submit } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

    const handleGoogleLogin = () => {
  // Redirige al endpoint de Spring que inicia el flujo OAuth2
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

  return (
    <div className="w-full max-w-[380px] px-4 sm:px-0">
      <div className="w-10 h-10 rounded-xl bg-[#EEF1FA] flex items-center justify-center mb-5">
        <svg className="w-5 h-5 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <h2 className="text-[24px] font-extrabold text-[#1A1A1A] mb-1" style={{ letterSpacing: '-0.03em' }}>
        Bienvenido de nuevo
      </h2>
      <p className="text-sm text-[#6B6B6B] mb-7">
        Ingresa con tus credenciales para continuar
      </p>

      <ApiErrorAlert message={error} />

      <form onSubmit={(e) => { e.preventDefault(); submit({ email, password }) }} noValidate>
        <div className="mb-4">
          <FormField label="Correo electrónico">
            <Input type="email" autoComplete="email" placeholder="usuario@extrucol.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
        </div>
        <div className="mb-2">
          <FormField label="Contraseña">
            <Input type="password" autoComplete="current-password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>
        </div>
        <div className="flex justify-end mb-6">
          <button type="button" onClick={() => navigate('/recuperar-password')}
            className="text-[13px] font-semibold text-[#24388C] hover:text-[#1B2C6B] transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <button  type="submit" disabled={loading}
          className="w-full flex items-center mb-3
           justify-center gap-2 py-3 rounded-md text-[13.5px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>Verificando...</>
          ) : 'Ingresar al sistema'}
        </button>

        
        <button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
>
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continuar con Google
</button>
      </form>
      <p className="text-center text-[12px] text-[#ABABAB] mt-6">
        Sistema CRM · Extrucol S.A.S · v1.0
      </p>
    </div>
  )
}
