import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:           ()           => api.get('/api/usuarios').then(r => r.data),
  buscar:           (id)         => api.get(`/api/usuarios/${id}`).then(r => r.data),
  crear:            (data)       => api.post('/api/usuarios', data).then(r => r.data),
  actualizar:       (id, data)   => api.put(`/api/usuarios/${id}`, data).then(r => r.data),
  actualizarEstado: (id, activo) => api.put(`/api/usuarios/${id}/estado`, { activo }).then(r => r.data),
  // CE-23 — PENDIENTE: endpoint aún no existe en el backend
  // resetPassword: (id) => api.put(`/api/usuarios/${id}/reset-password`).then(r => r.data),
}

const apexOps = {
  listar: () =>
    callProcess('USUARIOS_LIST').then(unwrapList),
  buscar: (id) =>
    callProcess('USUARIOS_GET', { x01: id }).then(unwrapSingle),
  crear: (data) =>
    callProcess('USUARIOS_CREATE', {
      x01: data.nombre,
      x02: data.email,
      x03: data.rol,
      x04: data.ciudad_id ?? data.ciudad,
    }).then(unwrapSingle),
  actualizar: (id, data) =>
    callProcess('USUARIOS_UPDATE', {
      x01: id,
      x02: data.nombre,
      x03: data.email,
      x04: data.rol,
      x05: data.ciudad_id ?? data.ciudad,
    }).then(unwrapSingle),
  actualizarEstado: (id, activo) =>
    callProcess('USUARIOS_ESTADO', { x01: id, x02: activo ? '1' : '0' }).then(unwrapSingle),
}

export const usuariosAPI = APEX_MODE ? apexOps : restOps
