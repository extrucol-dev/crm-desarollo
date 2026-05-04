import { useState, useEffect } from 'react'
import { APEX_MODE } from '../services/utils'
import { initApexSession } from '../../features/auth/services/authService'

// En REST mode retorna { ready: true, error: null } inmediatamente sin llamadas async.
// En APEX mode llama a USUARIO_ACTUAL y bloquea el render de rutas hasta obtener el rol.
export function useApexSession() {
  const [ready, setReady] = useState(!APEX_MODE)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!APEX_MODE) return
    initApexSession()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('[APEX] Error al inicializar sesión:', err)
        setError(err.message ?? 'No se pudo obtener la sesión de APEX.')
        setReady(true) // permitir render para mostrar el mensaje de error
      })
  }, [])

  return { ready, error }
}
