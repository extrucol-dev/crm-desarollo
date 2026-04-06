import api from '../../../shared/services/api'

export const clientesAPI = {
  listar:     ()         => api.get('/api/clientes/listar').then(r => r.data),
  buscar:     (id)       => api.get(`/api/clientes/${id}`).then(r => r.data),
  crear:      (data)     => api.post('/api/clientes', data).then(r => r.data),
  actualizar: (id, data) => api.put(`/api/clientes/${id}`, data).then(r => r.data),
}
