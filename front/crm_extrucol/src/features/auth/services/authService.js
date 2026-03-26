import api from '../../../shared/services/api'

/**
 * POST /api/auth/login
 * Maneja el token y la sesión del usuario.
 */
const login = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password })

  // Detecta el campo del token (el backend puede usar cualquiera de estas claves)
  const token = data.token ?? data.jwt ?? data.accessToken ?? Object.values(data)[0]
  if (!token) throw new Error('El servidor no devolvió un token válido.')

  localStorage.setItem('token', token)

  // Preferencia: backend devuelve { token, rol, nombre }
  if (data.rol && data.nombre) {
    localStorage.setItem('rol', data.rol)
    localStorage.setItem('nombre', data.nombre)
    return { token, rol: data.rol, nombre: data.nombre }
  }

  // Fallback: decodificar el JWT para leer rol y nombre
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log(payload);
    
    const rol    = payload.rol ?? payload.role ?? 'EJECUTIVO'
    const nombre = payload.nombre ?? payload.name ?? payload.sub ?? 'Usuario'
    localStorage.setItem('rol', rol)
    localStorage.setItem('nombre', nombre)
    return { token, rol, nombre }
  } catch {
    localStorage.setItem('rol', 'EJECUTIVO')
    localStorage.setItem('nombre', 'Usuario')
    return { token, rol: 'EJECUTIVO', nombre: 'Usuario' }
  }
}

const logout        = () => localStorage.clear()
const getToken      = () => localStorage.getItem('token')
const getRol        = () => localStorage.getItem('rol')
const getNombre     = () => localStorage.getItem('nombre')
const isAuthenticated = () => !!localStorage.getItem('token')

export const authService = { login, logout, getToken, getRol, getNombre, isAuthenticated }
