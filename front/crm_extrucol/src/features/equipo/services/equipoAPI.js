import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:           () => api.get('/api/director/equipo').then(r => r.data).catch(() => []),
  buscarEjecutivo:  (id) => api.get(`/api/director/equipo/${id}`).then(r => r.data).catch(() => null),
}

const apexOps = {
  listar:           () => callProcess('EQUIPO_LIST').then(unwrapList),
  buscarEjecutivo:  (id) => callProcess('EQUIPO_GET_EJECUTIVO', { x01: id }).then(unwrapSingle),
}

export const equipoAPI = APEX_MODE ? apexOps : restOps
