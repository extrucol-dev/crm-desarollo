import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export function useAuth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const submit = async ({ email, password }) => {
    setError('')
    if (!email || !password) { setError('Completa todos los campos.'); return }
    setLoading(true)
    try {
      await authService.login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setError(typeof msg === 'string' ? msg : 'Credenciales incorrectas.')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}
