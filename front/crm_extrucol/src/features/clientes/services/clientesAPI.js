import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:     ()         => api.get('/api/clientes/listar').then(r => r.data),
  buscar:     (id)       => api.get(`/api/clientes/${id}`).then(r => r.data),
  crear:      (data)     => api.post('/api/clientes', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/api/clientes/${id}`, data).then(r => r.data),
}

const apexOps = {
  listar: () =>
    callProcess('CLIENTES_LIST').then(unwrapList),
  buscar: (id) =>
    callProcess('CLIENTES_GET', { x01: id }).then(unwrapSingle),
  crear: (data) =>
    callProcess('CLIENTES_CREATE', {
      x01: data.empresa,
      x02: data.no_documento ?? '',
      x03: data.ciudad_id ?? '',
      x04: data.documento ?? '',
      x05: data.modalidad ?? '',
      x06: data.nombre,
      x07: data.cargo ?? '',
      x08: data.email ?? '',
      x09: data.telefono ?? '',
    }).then(unwrapSingle),
  actualizar: (id, data) =>
    callProcess('CLIENTES_UPDATE', {
      x01: id,
      x02: data.empresa,
      x03: data.no_documento ?? '',
      x04: data.ciudad_id ?? '',
      x05: data.documento ?? '',
      x06: data.modalidad ?? '',
    }).then(unwrapSingle),
}

export const clientesAPI = APEX_MODE ? apexOps : restOps
