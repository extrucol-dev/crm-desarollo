import api from '../../../shared/services/api'

// NOTA: el campo 'usuario' lo extrae el backend del JWT — no se envía desde el frontend.

export const clientesAPI = {
  listar:     ()          => api.get('/api/clientes/listar').then((r) => r.data),
  buscar:     (id)        => api.get(`/api/clientes/${id}`).then((r) => r.data),
  crear:      (cliente)   => api.post('/api/clientes', cliente).then((r) => r.data),
  actualizar: (id, data)  => api.put(`/api/clientes/${id}`, data).then((r) => r.data),
  eliminar:   (id)        => api.delete(`/api/clientes/${id}`),
}
