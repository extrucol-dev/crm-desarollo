import { APEX_MODE, unwrapList, unwrapSingle } from '../../../shared/services/utils'
import api from '../../../shared/services/api'
import { callProcess } from '../../../shared/apex/apexClient'

const restOps = {
  // CE-19: crear actividad — usuario lo toma el backend del JWT
  crear: (data) => api.post('/api/actividades', {
    tipo:            data.tipo,
    descripcion:     data.descripcion,
    virtual:         data.virtual,
    fecha_actividad: data.fecha_actividad,
    oportunidad:     Number(data.oportunidad),
  }).then(r => r.data),

  // CE-31: editar actividad
  actualizar: (id, data) => api.put(`/api/actividades/${id}`, {
    tipo:            data.tipo,
    descripcion:     data.descripcion,
    virtual:         data.virtual,
    fecha_actividad: data.fecha_actividad,
    oportunidad:     Number(data.oportunidad),
  }).then(r => r.data),

  // Cierre presencial — requiere GPS real del navegador
  // ActividadCierreRequestDTO: { resultado, latitud, longitud }
  cerrarPresencial: (id, { resultado, latitud, longitud }) =>
    api.put(`/api/actividades/${id}/cierre`, {
      resultado,
      latitud,
      longitud,
    }).then(r => r.data),

  // Cierre virtual — el DTO exige latitud y longitud aunque no aplique
  // Se envían coordenadas neutras (0, 0) como workaround
  cerrarVirtual: (id, { resultado }) =>
    api.put(`/api/actividades/${id}/cierre`, {
      resultado,
      latitud:  0,
      longitud: 0,
    }).then(r => r.data),

  buscar: (id) => api.get(`/api/actividades/${id}`).then(r => r.data),
}

const apexOps = {
  crear: (data) =>
    callProcess('ACTIVIDADES_CREATE', {
      x01: data.tipo,
      x02: data.descripcion,
      x03: data.virtual ? '1' : '0',
      x04: data.fecha_actividad,
      x05: Number(data.oportunidad),
    }).then(unwrapSingle),
  actualizar: (id, data) =>
    callProcess('ACTIVIDADES_UPDATE', {
      x01: id,
      x02: data.tipo,
      x03: data.descripcion,
      x04: data.virtual ? '1' : '0',
      x05: data.fecha_actividad,
      x06: Number(data.oportunidad),
    }).then(unwrapSingle),
  cerrarPresencial: (id, { resultado, latitud, longitud }) =>
    callProcess('ACTIVIDADES_CERRAR', {
      x01: id,
      x02: resultado,
      x03: latitud,
      x04: longitud,
    }).then(unwrapSingle),
  cerrarVirtual: (id, { resultado }) =>
    callProcess('ACTIVIDADES_CERRAR', {
      x01: id,
      x02: resultado,
      x03: 0,
      x04: 0,
    }).then(unwrapSingle),
  buscar: (id) =>
    callProcess('ACTIVIDADES_GET', { x01: id }).then(unwrapSingle),
}

export const actividadesAPI = APEX_MODE ? apexOps : restOps
