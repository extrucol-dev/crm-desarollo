import api from '../../../shared/services/api'

export const oportunidadesAPI = {
  listar:  ()    => api.get('/api/oportunidades').then(r => r.data),
  buscar:  (id)  => api.get(`/api/oportunidades/${id}/actividades`).then(r => r.data),
  actividades: (id) => api.get(`/api/oportunidades/${id}/actividades`).then(r => r.data),

  // CE-16: estado lo toma el backend del contexto; solo enviamos los campos del negocio
  crear: (data) => api.post('/api/oportunidades', {
    nombre:         data.nombre,
    descripcion:    data.descripcion,
    tipo:           data.tipo,
    estado:         'PROSPECTO',
    valor_estimado: data.valor_estimado,
    fecha_cierre:   data.fecha_cierre || undefined,
    cliente:        data.cliente,
  }).then(r => r.data),

  // CE-28: igual, sin usuario
  actualizar: (id, data) => api.put(`/api/oportunidades/${id}`, {
    nombre:         data.nombre,
    descripcion:    data.descripcion,
    tipo:           data.tipo,
    estado:         data.estado,
    valor_estimado: data.valor_estimado,
    fecha_cierre:   data.fecha_cierre || undefined,
    cliente:        data.cliente,
  }).then(r => r.data),

  // CE-17
  avanzarEstado: (id, estado) =>
    api.put(`/api/oportunidades/${id}/estado`, { estado }).then(r => r.data),

  // CE-18
  cerrar: (id, payload) =>
    api.put(`/api/oportunidades/${id}/cierre`, payload).then(r => r.data),
}
