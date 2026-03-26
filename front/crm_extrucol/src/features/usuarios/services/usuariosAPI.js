import api from '../../../shared/services/api'

// NOTA: el campo 'usuario' lo extrae el backend del JWT — no se envía desde el frontend.

export const usuariosAPI = {
  listar:     ()          => api.get('/api/usuarios').then((r) => r.data),
  buscar:     (id)        => api.get(`/api/usuarios/${id}`).then((r) => r.data),
  crear:      (cliente)   => api.post('/api/usuarios', cliente).then((r) => r.data),
  actualizar: (id, data)  => api.put(`/api/usuarios/${id}`, data).then((r) => r.data),
  eliminar:   (id)        => api.delete(`/api/usuarios/${id}`),
}
