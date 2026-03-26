import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginForm() {
  const navigate = useNavigate()
  const { loading, error, submit } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    submit({ email, password })
  }

  return (
    <div className="w-full max-w-[380px]">
      <h2 className="text-[26px] font-extrabold text-[#1A1A1A] mb-1" style={{ letterSpacing: '-0.03em' }}>
        Bienvenido de nuevo
      </h2>
      <p className="text-sm text-[#6B6B6B] mb-8">
        Ingresa con tus credenciales para continuar
      </p>

      {error && (
        <div className="flex items-start gap-2 text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-5">
          <span className="flex-shrink-0"></span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
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
            className="w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white border border-[#D5D5D5] rounded-md outline-none placeholder:text-[#ABABAB] transition-all duration-150 focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
          />
        </div>

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
            className="w-full px-3 py-[9px] text-[13.5px] text-[#1A1A1A] bg-white border border-[#D5D5D5] rounded-md outline-none placeholder:text-[#ABABAB] transition-all duration-150 focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
          />
        </div>

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => navigate('/recuperar-password')}
            className="text-[13px] font-semibold text-[#24388C] hover:text-[#1B2C6B] transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-[13.5px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Verificando...
            </>
          ) : 'Ingresar al sistema'}
        </button>
      </form>

      <p className="text-center text-[12px] text-[#ABABAB] mt-6">
        Sistema CRM · Extrucol · v1.0
      </p>
    </div>
  )
}
