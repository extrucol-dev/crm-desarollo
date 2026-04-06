import api from '../../../shared/services/api'

export const actividadesAPI = {
  // CE-19: crear actividad — usuario lo toma el backend del JWT
  crear: (data) => api.post('/api/actividades', {
    tipo:            data.tipo,
    descripcion:     data.descripcion,
    virtual:         data.virtual,
    fecha_actividad: data.fecha_actividad,
    oportunidad:     Number(data.oportunidad),
  }).then(r => r.data),

  // CE-31: editar actividad
  actualizar: (id, data) => api.put(`/api/actividades/${id}`, {
    tipo:            data.tipo,
    descripcion:     data.descripcion,
    virtual:         data.virtual,
    fecha_actividad: data.fecha_actividad,
    oportunidad:     Number(data.oportunidad),
  }).then(r => r.data),

  // Cerrar con GPS (PUT /api/actividades/{id}/cierre)
  cerrar: (id, { resultado, latitud, longitud }) =>
    api.put(`/api/actividades/${id}/cierre`, { resultado, latitud, longitud }).then(r => r.data),

  buscar: (id) => api.get(`/api/actividades/${id}`).then(r => r.data),
}
