import { APEX_MODE } from '../../../shared/services/utils'
import { callProcess } from '../../../shared/apex/apexClient'
import api from '../../../shared/services/api'

// ── APEX mode ─────────────────────────────────────────────────────────────────
// Llamado por useApexSession al arrancar la app. APEX ya tiene la sesión activa;
// solo necesitamos obtener el rol y nombre del usuario para el enrutamiento.
const apexInit = async () => {
  const raw = await callProcess('USUARIO_ACTUAL')
  // USUARIO_ACTUAL devuelve { data: [{ ROL, NOMBRE, ID }] } o similar
  const data = Array.isArray(raw?.data) ? raw.data[0] : (raw?.data ?? raw)
  const normalizado = data
    ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k.toLowerCase(), v]))
    : null

  if (!normalizado?.rol)
    throw new Error('USUARIO_ACTUAL no devolvió un rol válido. Verifica el proceso en APEX Builder.')

  localStorage.setItem('rol',    String(normalizado.rol).toUpperCase())
  localStorage.setItem('nombre', normalizado.nombre ?? 'Usuario')
  localStorage.setItem('userId', String(normalizado.id ?? ''))
  return normalizado
}

const apexLogout = () => {
  localStorage.clear()
  const appId = window.apex?.env?.APP_ID ?? import.meta.env.VITE_APEX_FLOW_ID ?? '0'
  window.location.href = `/apex/f?p=${appId}:LOGOUT:0`
}

// ── REST mode ─────────────────────────────────────────────────────────────────
const restLogin = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password })
  const token = data.token ?? data.jwt ?? data.accessToken ?? Object.values(data)[0]
  if (!token) throw new Error('El servidor no devolvió un token válido.')
  localStorage.setItem('token', token)
  if (data.rol && data.nombre) {
    localStorage.setItem('rol',    data.rol)
    localStorage.setItem('nombre', data.nombre)
    return { token, rol: data.rol, nombre: data.nombre }
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const rol    = payload.rol ?? payload.role
    const nombre = payload.nombre ?? payload.name ?? payload.sub
    localStorage.setItem('rol',    rol)
    localStorage.setItem('nombre', nombre)
    return { token, rol, nombre }
  } catch {
    localStorage.clear()
    throw new Error('Token inválido: no se pudo decodificar el payload.')
  }
}

const restLogout = async () => {
  try { await api.post('/api/auth/logout') } catch { /* ignorar */ }
  finally { localStorage.clear() }
}

// ── Superficie unificada ──────────────────────────────────────────────────────
// initApexSession se exporta por separado para que useApexSession lo llame
// sin pasar por el alias 'login' (cuyo nombre implica acción del usuario).
export const initApexSession = APEX_MODE ? apexInit : null

export const authService = {
  login:   APEX_MODE ? apexInit    : restLogin,
  logout:  APEX_MODE ? apexLogout  : restLogout,

  getToken:  () => localStorage.getItem('token'),
  getRol:    () => localStorage.getItem('rol'),
  getNombre: () => localStorage.getItem('nombre'),

  // En APEX mode: autenticado = 'rol' en localStorage (escrito por apexInit).
  // En REST mode: autenticado = 'token' en localStorage (escrito por restLogin).
  isAuthenticated: () =>
    APEX_MODE
      ? !!localStorage.getItem('rol')
      : !!localStorage.getItem('token'),
}
