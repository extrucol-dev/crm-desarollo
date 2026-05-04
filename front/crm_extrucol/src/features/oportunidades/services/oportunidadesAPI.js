import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:  ()    => api.get('/api/oportunidades').then(r => r.data),
  buscar:  (id)  => api.get(`/api/oportunidades/${id}/detalles`).then(r => r.data),
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

const apexOps = {
  listar: () =>
    callProcess('OPORTUNIDADES_LIST').then(unwrapList),
  buscar: (id) =>
    callProcess('OPORTUNIDADES_GET', { x01: id }).then(unwrapSingle),
  actividades: (id) =>
    callProcess('OPORTUNIDADES_ACTIVIDADES', { x01: id }).then(unwrapList),
  crear: (data) =>
    callProcess('OPORTUNIDADES_CREATE', {
      x01: data.nombre,
      x02: data.descripcion,
      x03: data.tipo,
      x04: data.valor_estimado,
      x05: data.fecha_cierre || '',
      x06: data.cliente,
    }).then(unwrapSingle),
  actualizar: (id, data) =>
    callProcess('OPORTUNIDADES_UPDATE', {
      x01: id,
      x02: data.nombre,
      x03: data.descripcion,
      x04: data.tipo,
      x05: data.estado,
      x06: data.valor_estimado,
      x07: data.fecha_cierre || '',
      x08: data.cliente,
    }).then(unwrapSingle),
  avanzarEstado: (id, estado) =>
    callProcess('OPORTUNIDADES_AVANZAR', { x01: id, x02: estado }).then(unwrapSingle),
  cerrar: (id, payload) =>
    callProcess('OPORTUNIDADES_CERRAR', {
      x01: id,
      x02: payload.estado,
      x03: payload.fecha_cierre || '',
      x04: payload.motivo_cierre || '',
    }).then(unwrapSingle),
}

export const oportunidadesAPI = APEX_MODE ? apexOps : restOps
