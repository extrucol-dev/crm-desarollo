import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  catalogoList: (tabla) =>
    api.get(`/api/admin/catalogos/${tabla}`).then(r => r.data).catch(() => []),

  catalogoCreate: (tabla, nombre, descripcion) =>
    api.post(`/api/admin/catalogos/${tabla}`, { nombre, descripcion }).then(r => r.data),

  catalogoUpdate: (tabla, id, nombre, descripcion) =>
    api.put(`/api/admin/catalogos/${tabla}/${id}`, { nombre, descripcion }).then(r => r.data),

  auditoriaList: ({ inicio, fin, tipo, tabla } = {}) =>
    api.get('/api/admin/auditoria', { params: { inicio, fin, tipo, tabla } })
      .then(r => r.data)
      .catch(() => []),
}

const apexOps = {
  catalogoList: (tabla) =>
    callProcess('CATALOGO_LIST', { x01: tabla }).then(unwrapList),

  catalogoCreate: (tabla, nombre, descripcion) =>
    callProcess('CATALOGO_CREATE', {
      x01: tabla,
      x02: nombre,
      x03: descripcion ?? '',
    }).then(unwrapSingle),

  catalogoUpdate: (tabla, id, nombre, descripcion) =>
    callProcess('CATALOGO_UPDATE', {
      x01: tabla,
      x02: String(id),
      x03: nombre,
      x04: descripcion ?? '',
    }).then(unwrapSingle),

  auditoriaList: ({ inicio, fin, tipo, tabla } = {}) =>
    callProcess('ADMIN_AUDITORIA_LIST', {
      x01: inicio ?? '',
      x02: fin    ?? '',
      x03: tipo   ?? '',
      x04: tabla  ?? '',
    }).then(unwrapList),
}

export const adminAPI = APEX_MODE ? apexOps : restOps
