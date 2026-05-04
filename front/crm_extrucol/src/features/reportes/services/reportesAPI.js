import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  listar:    ()                       => api.get('/api/reportes').then(r => r.data).catch(() => []),
  recientes: ()                       => api.get('/api/reportes/recientes').then(r => r.data).catch(() => []),
  generar:   ({ tipo, inicio, fin })  => api.post('/api/reportes/generar', { tipo, inicio, fin }).then(r => r.data),
}

const apexOps = {
  listar:    ()                       => callProcess('REPORTES_LIST').then(unwrapList),
  recientes: ()                       => callProcess('REPORTES_RECIENTES').then(unwrapList),
  generar:   ({ tipo, inicio, fin })  => callProcess('REPORTES_GENERAR', { x01: tipo, x02: inicio ?? '', x03: fin ?? '' }).then(unwrapSingle),
}

export const reportesAPI = APEX_MODE ? apexOps : restOps
