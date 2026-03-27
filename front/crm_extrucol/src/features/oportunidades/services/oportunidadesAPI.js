import api from '../../../shared/services/api'

// Helper: extrae el id del usuario del JWT guardado en localStorage
const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem('token')
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id ?? payload.userId ?? payload.sub
  } catch {
    return null
  }
}

export const oportunidadesAPI = {
  // CE-15: listar todas las oportunidades del ejecutivo
  listar: () => api.get('/api/oportunidades').then(r => r.data),

  // CE-29: detalle completo
  buscar: (id) => api.get(`/api/oportunidades/${id}`).then(r => r.data),

  // CE-16: crear — el backend valida usuario y estado internamente,
  // pero el DTO los exige como campos. Se envían desde el frontend.
  crear: (data) => api.post('/api/oportunidades', {
    ...data,
    usuario: 1,
    estado:  'PROSPECTO',
  }).then(r => r.data),

  // CE-28: editar — se envía usuario del JWT y estado actual
  actualizar: (id, data, estadoActual) => api.put(`/api/oportunidades/${id}`, {
    ...data,
    usuario: getUserIdFromToken(),
    estado:  estadoActual,
  }).then(r => r.data),

  // CE-17: avanzar estado
  avanzarEstado: (id, estado) =>
    api.put(`/api/oportunidades/${id}/estado`, { estado }).then(r => r.data),

  // CE-18: cerrar como ganada o perdida
  cerrar: (id, { estado, fecha_cierre, motivo_cierre }) =>
    api.put(`/api/oportunidades/${id}/cierre`, { estado, fecha_cierre, motivo_cierre }).then(r => r.data),
}
