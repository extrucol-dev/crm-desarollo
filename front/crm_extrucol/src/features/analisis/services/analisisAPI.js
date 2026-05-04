import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  sectores:   ({ periodo } = {}) => api.get('/api/director/analisis/sectores', { params: { periodo } }).then(r => r.data).catch(() => null),
  forecast:   ({ meses }  = {}) => api.get('/api/director/forecast', { params: { meses } }).then(r => r.data).catch(() => null),
}

const apexOps = {
  sectores:   ({ periodo } = {}) => callProcess('ANALISIS_SECTORES', { x01: periodo ?? '' }).then(unwrapSingle),
  forecast:   ({ meses }  = {}) => callProcess('ANALISIS_FORECAST',  { x01: meses  ?? '' }).then(unwrapSingle),
}

export const analisisAPI = APEX_MODE ? apexOps : restOps
