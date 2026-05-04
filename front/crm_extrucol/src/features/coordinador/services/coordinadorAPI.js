import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  stats:               () => api.get('/api/coordinador/dashboard').then(r => r.data).catch(() => null),
  equipo:              () => api.get('/api/coordinador/equipo').then(r => r.data).catch(() => []),
  alertas:             () => api.get('/api/alertas').then(r => r.data).catch(() => []),
  logNotificaciones:   ({ inicio, fin } = {}) =>
    api.get('/api/alertas/log', { params: { inicio, fin } }).then(r => r.data).catch(() => []),
  variablesSistema:    () => api.get('/api/configuracion').then(r => r.data).catch(() => null),
  marcarAlertaLeida:   (id) => api.put(`/api/alertas/${id}/leida`).then(r => r.data),
  estancadas:          () => api.get('/api/coordinador/estancadas').then(r => r.data).catch(() => []),
}

const apexOps = {
  stats:               () => callProcess('DASHBOARD_COORDINADOR').then(unwrapSingle),
  equipo:              () => callProcess('EQUIPO_LIST').then(unwrapList),
  alertas:             () => callProcess('ALERTAS_LIST').then(unwrapList),
  logNotificaciones:   ({ inicio, fin } = {}) =>
    callProcess('ALERTAS_LOG', { x01: inicio ?? '', x02: fin ?? '' }).then(unwrapList),
  variablesSistema:    () => callProcess('CONFIGURACION_GET').then(unwrapSingle),
  marcarAlertaLeida:   (id) => callProcess('ALERTAS_MARCAR_LEIDA', { x01: id }).then(unwrapSingle),
  estancadas:          () => callProcess('OPORTUNIDADES_ESTANCADAS').then(unwrapList),
}

export const coordinadorAPI = APEX_MODE ? apexOps : restOps
