import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  ejecutivos:       () => api.get('/api/coordinador/monitoreo').then(r => r.data).catch(() => []),
  mapaActividades:  ({ fecha } = {}) => api.get('/api/coordinador/mapa-actividades', { params: { fecha } }).then(r => r.data).catch(() => null),
}

const apexOps = {
  ejecutivos:       () => callProcess('MONITOREO_EJECUTIVOS').then(unwrapList),
  mapaActividades:  ({ fecha } = {}) => callProcess('MONITOREO_ACTIVIDADES_MAPA', { x01: fecha ?? '' }).then(unwrapSingle),
}

export const monitoreoAPI = APEX_MODE ? apexOps : restOps
