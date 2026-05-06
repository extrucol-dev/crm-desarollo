import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:        ()         => api.get('/api/leads').then(r => r.data),
  buscar:        (id)       => api.get(`/api/leads/${id}`).then(r => r.data),
  crear:         (data)     => api.post('/api/leads', data).then(r => r.data),
  actualizar:    (id, data) => api.put(`/api/leads/${id}`, data).then(r => r.data),
  cambiarEstado: (id, est)  => api.put(`/api/leads/${id}/estado`, { estado: est }).then(r => r.data),
  convertir:     (id, data) => api.post(`/api/leads/${id}/convertir`, data).then(r => r.data),
}

const apexOps = {
  listar: () =>
    callProcess('LEADS_LIST').then(unwrapList),

  buscar: (id) =>
    callProcess('LEADS_GET', { x01: id }).then(unwrapSingle),

  crear: (data) =>
    callProcess('LEADS_CREATE', {
      x01: data.nombre,
      x02: data.descripcion,
      x03: data.origen,
      x04: data.estado,
      x05: data.empresa,
      x06: data.contacto ?? '',
      x07: data.telefono ?? '',
      x08: data.email ?? '',
      x09: data.score ?? 0,
    }).then(unwrapSingle),

  actualizar: (id, data) =>
    callProcess('LEADS_UPDATE', {
      x01: id,
      x02: data.nombre,
      x03: data.descripcion,
      x04: data.estado,
      x05: data.score,
      x06: data.empresa,
      x07: data.contacto ?? '',
      x08: data.telefono ?? '',
      x09: data.email ?? '',
    }).then(unwrapSingle),

  cambiarEstado: (id, estado) =>
    callProcess('LEADS_ESTADO', { x01: id, x02: estado }).then(unwrapSingle),

  convertir: (id, datos) =>
    callProcess('LEADS_CONVERTIR', {
      x01: id,
      x02: datos.nombre_oportunidad,
      x03: datos.valor_estimado,
      x04: datos.fecha_cierre,
    }).then(unwrapSingle),
}

export const leadsAPI = APEX_MODE ? apexOps : restOps
