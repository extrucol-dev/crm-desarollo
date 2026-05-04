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
      x01: data.nombre,
      x02: data.empresa,
      x03: data.sector,
      x04: data.ciudad_id ?? data.ciudad,
      x05: data.email,
      x06: data.telefono,
    }).then(unwrapSingle),
  actualizar: (id, data) =>
    callProcess('CLIENTES_UPDATE', {
      x01: id,
      x02: data.nombre,
      x03: data.empresa,
      x04: data.sector,
      x05: data.ciudad_id ?? data.ciudad,
      x06: data.email,
      x07: data.telefono,
    }).then(unwrapSingle),
}

export const clientesAPI = APEX_MODE ? apexOps : restOps
