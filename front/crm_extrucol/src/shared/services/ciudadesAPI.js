import api from './api'
export const ciudadesAPI = {
  listar: () => api.get('/api/ciudades').then(r => r.data),
}
