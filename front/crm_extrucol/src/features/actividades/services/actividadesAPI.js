import api from '../../../shared/services/api'

export const actividadesAPI = {
  // CE-19: crear actividad
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

  // Cerrar actividad presencial — requiere GPS real (latitud, longitud)
  cerrarPresencial: (id, { resultado, latitud, longitud }) =>
    api.put(`/api/actividades/${id}/cierre`, { resultado, latitud, longitud }).then(r => r.data),

  // Cerrar actividad virtual — el backend exige latitud/longitud,
  // enviamos coordenadas neutras (0,0) como workaround para actividades virtuales
  cerrarVirtual: (id, { resultado }) =>
    api.put(`/api/actividades/${id}/cierre`, {
      resultado,
      latitud:  0,
      longitud: 0,
    }).then(r => r.data),

  buscar: (id) => api.get(`/api/actividades/${id}`).then(r => r.data),
}