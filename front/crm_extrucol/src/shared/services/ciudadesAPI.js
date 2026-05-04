import { APEX_MODE, unwrapList } from './utils'
import api from './api'
import { callProcess } from '../apex/apexClient'

const restOps = {
  listar: () => api.get('/api/ciudades').then(r => r.data),
}

const apexOps = {
  listar: () => callProcess('CIUDADES_LIST').then(unwrapList),
}

export const ciudadesAPI = APEX_MODE ? apexOps : restOps
