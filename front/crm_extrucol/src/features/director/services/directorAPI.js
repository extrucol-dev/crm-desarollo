import api from '../../../shared/services/api'

export const directorAPI = {
  // GET /api/oportunidades/todas — todas las del equipo
  oportunidades: () => api.get('/api/oportunidades/todas').then(r => r.data),
  // GET /api/actividades/todas?inicio=&fin= — todas las del equipo con filtro de fecha
  actividades: ({ inicio, fin } = {}) => {
    const params = {}
    if (inicio) params.inicio = inicio
    if (fin)    params.fin    = fin
    return api.get('/api/actividades/todas', { params }).then(r => r.data)
  },
  // mis actividades con filtro de fecha (ejecutivo)
  misActividades: ({ inicio, fin } = {}) => {
    const params = {}
    if (inicio) params.inicio = inicio
    if (fin)    params.fin    = fin
    return api.get('/api/actividades', { params }).then(r => r.data)
  },
  // usuarios para filtros
  usuarios: () => api.get('/api/usuarios').then(r => r.data),
}
