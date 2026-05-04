import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
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

const apexOps = {
  listar: () =>
    callProcess('PROYECTOS_LIST').then(unwrapList),
  listarTodos: () =>
    callProcess('PROYECTOS_LIST_TODOS').then(unwrapList),
  buscar: (id) =>
    callProcess('PROYECTOS_GET', { x01: id }).then(unwrapSingle),
  crear: (data) =>
    callProcess('PROYECTOS_CREATE', {
      x01: data.nombre,
      x02: data.descripcion,
      x03: Number(data.oportunidad),
    }).then(unwrapSingle),
  actualizar: (id, data) =>
    callProcess('PROYECTOS_UPDATE', {
      x01: id,
      x02: data.nombre,
      x03: data.descripcion,
      x04: data.estado,
      x05: Number(data.oportunidad),
    }).then(unwrapSingle),
  actualizarEstado: (id, estado) =>
    callProcess('PROYECTOS_ESTADO', { x01: id, x02: estado }).then(unwrapSingle),
}

export const proyectosAPI = APEX_MODE ? apexOps : restOps
