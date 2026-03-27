import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Input, FormField, ApiErrorAlert } from '../../../shared/components/FormField'

export default function LoginForm() {
  const navigate = useNavigate()
  const { loading, error, submit } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

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
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-[13.5px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>Verificando...</>
          ) : 'Ingresar al sistema'}
        </button>
      </form>
      <p className="text-center text-[12px] text-[#ABABAB] mt-6">
        Sistema CRM · Extrucol · v1.0
      </p>
    </div>
  )
}
