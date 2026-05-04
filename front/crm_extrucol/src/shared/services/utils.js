// Constante de compilación — Vite reemplaza import.meta.env.VITE_APEX_MODE
// con el literal "true"/"false" en build time, habilitando tree-shaking del branch muerto.
export const APEX_MODE = String(import.meta.env.VITE_APEX_MODE) === 'true'

// Convierte recursivamente todas las claves de un objeto a minúsculas.
// Oracle devuelve nombres de columna en MAYÚSCULAS; React espera minúsculas.
export const toLower = (val) => {
  if (Array.isArray(val)) return val.map(toLower)
  if (val !== null && typeof val === 'object')
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k.toLowerCase(), toLower(v)]))
  return val
}

// Extrae el array/objeto del envelope que devuelve APEX (data/items/rows/result).
// Si no hay envelope reconocido, normaliza claves y devuelve el payload tal cual.
export const unwrap = (payload) => {
  if (!payload || typeof payload !== 'object') return payload
  const envelope = payload.data ?? payload.items ?? payload.rows ?? payload.result
  return envelope !== undefined ? toLower(envelope) : toLower(payload)
}

// Garantiza que operaciones de lista devuelvan siempre un array,
// aunque el proceso APEX devuelva null o un objeto vacío.
export const unwrapList = (p) => {
  const r = unwrap(p)
  return Array.isArray(r) ? r : (r ? [r] : [])
}

// Garantiza que operaciones de un elemento devuelvan objeto o null.
export const unwrapSingle = (p) => {
  const r = unwrap(p)
  return Array.isArray(r) ? (r[0] ?? null) : r
}
