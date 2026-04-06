import api from '../../../shared/services/api'

export const proyectosAPI = {
  // CE-39: mis proyectos (ejecutivo)
  listar:     ()         => api.get('/api/proyectos').then(r => r.data),
  // DIRECTOR: todos los proyectos
  listarTodos: ()        => api.get('/api/proyectos/todos').then(r => r.data),
  // CE-41: detalle
  buscar:     (id)       => api.get(`/api/proyectos/${id}`).then(r => r.data),
  // CE-38: crear proyecto desde oportunidad ganada
  crear:      (data)     => api.post('/api/proyectos', {
    nombre:      data.nombre,
    descripcion: data.descripcion,
    estado:      'ACTIVO',
    oportunidad: Number(data.oportunidad),
  }).then(r => r.data),
  // CE-42: editar
  actualizar: (id, data) => api.put(`/api/proyectos/${id}`, {
    nombre:      data.nombre,
    descripcion: data.descripcion,
    estado:      data.estado,
    oportunidad: Number(data.oportunidad),
  }).then(r => r.data),
  // cambiar estado
  actualizarEstado: (id, estado) =>
    api.put(`/api/proyectos/${id}/estado`, { estado }).then(r => r.data),
}
