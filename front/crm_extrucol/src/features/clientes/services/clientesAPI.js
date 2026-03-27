import api from '../../../shared/services/api'

export const clientesAPI = {
  // CE-13: listar mis clientes (filtrado por ejecutivo en el backend via JWT)
  listar:     ()         => api.get('/api/clientes/listar').then(r => r.data),
  // CE-14: detalle con oportunidades → devuelve ClienteOportunidadesResponseDTO
  buscar:     (id)       => api.get(`/api/clientes/${id}`).then(r => r.data),
  // CE-12: crear cliente (usuario lo toma el backend del JWT)
  crear:      (data)     => api.post('/api/clientes', data).then(r => r.data),
  // CE-26: editar cliente
  actualizar: (id, data) => api.put(`/api/clientes/${id}`, data).then(r => r.data),
}
