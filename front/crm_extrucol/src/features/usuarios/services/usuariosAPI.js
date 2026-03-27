import api from '../../../shared/services/api'

export const usuariosAPI = {
  listar:          ()           => api.get('/api/usuarios').then(r => r.data),
  buscar:          (id)         => api.get(`/api/usuarios/${id}`).then(r => r.data),
  crear:           (data)       => api.post('/api/usuarios', data).then(r => r.data),
  actualizar:      (id, data)   => api.put(`/api/usuarios/${id}`, data).then(r => r.data),
  actualizarEstado:(id, activo) => api.put(`/api/usuarios/${id}/estado`, { activo }).then(r => r.data),
  // CE-23 — PENDIENTE: endpoint aún no existe en el backend
  // resetPassword: (id) => api.put(`/api/usuarios/${id}/reset-password`).then(r => r.data),
}
