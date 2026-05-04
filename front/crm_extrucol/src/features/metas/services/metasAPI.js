import { APEX_MODE, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  misMetas:     ({ mes, anio } = {}) =>
    api.get('/api/metas/mis-metas', { params: { mes, anio } }).then(r => r.data).catch(() => null),
  cumplimiento: ({ mes, anio } = {}) =>
    api.get('/api/metas/cumplimiento', { params: { mes, anio } }).then(r => r.data).catch(() => null),
}

const apexOps = {
  misMetas:     ({ mes, anio } = {}) =>
    callProcess('METAS_MIS_METAS', { x01: mes ?? '', x02: anio ?? '' }).then(unwrapSingle),
  cumplimiento: ({ mes, anio } = {}) =>
    callProcess('METAS_CUMPLIMIENTO', { x01: mes ?? '', x02: anio ?? '' }).then(unwrapSingle),
}

export const metasAPI = APEX_MODE ? apexOps : restOps
