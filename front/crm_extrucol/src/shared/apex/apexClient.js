import { APEX_MODE } from '../services/utils'

// Lee el contexto de sesión que APEX inyecta en window.apex.env.
// Fallback a campos ocultos del DOM para compatibilidad con APEX 20.1+.
const getApexEnv = () => {
  if (typeof window !== 'undefined' && window.apex?.env) {
    return {
      appId:   String(window.apex.env.APP_ID      ?? import.meta.env.VITE_APEX_FLOW_ID ?? '0'),
      pageId:  String(window.apex.env.APP_PAGE_ID ?? '0'),
      session: String(window.apex.env.APP_SESSION ?? '0'),
    }
  }
  const byId = (id) => document.getElementById(id)?.value ?? '0'
  return {
    appId:   byId('pFlowId'),
    pageId:  byId('pFlowStepId'),
    session: byId('pInstance'),
  }
}

// Llama a un Application Process de Oracle APEX vía wwv_flow.ajax.
// processName: nombre exacto del proceso en APEX Builder (ej. 'CLIENTES_LIST')
// extras: objeto de parámetros adicionales { x01: valor, x02: valor, ... }
export const callProcess = async (processName, extras = {}) => {
  if (!APEX_MODE)
    throw new Error(`callProcess('${processName}') fue llamado en modo REST. Verifica VITE_APEX_MODE.`)

  const { appId, pageId, session } = getApexEnv()

  const body = new URLSearchParams({
    p_request:      `APPLICATION_PROCESS=${processName}`,
    p_flow_id:      appId,
    p_flow_step_id: pageId,
    p_instance:     session,
    p_debug:        '',
  })

  Object.entries(extras).forEach(([k, v]) => {
    if (v !== undefined && v !== null) body.append(k, String(v))
  })

  const res = await fetch('/apex/wwv_flow.ajax', {
    method:      'POST',
    body,
    credentials: 'include', // CRÍTICO: envía la cookie de sesión APEX
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':       'application/json',
    },
  })

  if (!res.ok)
    throw new Error(`APEX process "${processName}" falló: HTTP ${res.status} ${res.statusText}`)

  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`APEX process "${processName}" devolvió no-JSON: ${text.slice(0, 200)}`)
  }
}
