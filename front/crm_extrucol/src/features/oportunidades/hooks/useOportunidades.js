import { useState, useEffect, useCallback } from 'react'
import { oportunidadesAPI } from '../services/oportunidadesAPI'

export const ESTADOS = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION', 'GANADA', 'PERDIDA']
export const TIPOS   = ['COTIZACION', 'VENTA', 'ACOMPANAMIENTO', 'PROYECTO']
export const ESTADOS_CERRADOS = ['GANADA', 'PERDIDA']

export const ESTADO_SIGUIENTE = {
  PROSPECTO:    'CALIFICACION',
  CALIFICACION: 'PROPUESTA',
  PROPUESTA:    'NEGOCIACION',
  NEGOCIACION:  null, // desde aquí se cierra como ganada o perdida
}

export function useOportunidades() {
  const [oportunidades, setOportunidades] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [filtroTipo, setFiltroTipo]       = useState('')

  const cargar = useCallback(() => {
    setLoading(true); setError('')
    oportunidadesAPI.listar()
      .then(setOportunidades)
      .catch(() => setError('No se pudieron cargar las oportunidades.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  // Agrupa por estado y aplica filtro por tipo (CE-30)
  const porEstado = ESTADOS.reduce((acc, estado) => {
    acc[estado] = oportunidades.filter(op =>
      op.estado === estado &&
      (!filtroTipo || op.tipo === filtroTipo)
    )
    return acc
  }, {})

  return { oportunidades, porEstado, loading, error, filtroTipo, setFiltroTipo, cargar }
}
