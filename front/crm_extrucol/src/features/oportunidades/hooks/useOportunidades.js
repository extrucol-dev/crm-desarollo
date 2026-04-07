import { useState, useEffect, useCallback, useMemo } from 'react'
import { oportunidadesAPI } from '../services/oportunidadesAPI'

export const ESTADOS = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION', 'GANADA', 'PERDIDA']
export const TIPOS   = ['COTIZACION', 'VENTA', 'ACOMPANAMIENTO', 'PROYECTO']
export const ESTADOS_CERRADOS = ['GANADA', 'PERDIDA']

export const ESTADO_SIGUIENTE = {
  PROSPECTO:    'CALIFICACION',
  CALIFICACION: 'PROPUESTA',
  PROPUESTA:    'NEGOCIACION',
  NEGOCIACION:  null,
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

  // Optimistic update para drag and drop — mueve la tarjeta localmente
  // antes de que el servidor confirme. Si la API falla, se revierte con cargar().
  const moverOptimista = useCallback((opId, nuevoEstado) => {
    setOportunidades(prev =>
      prev.map(op =>
        String(op.id) === String(opId) ? { ...op, estado: nuevoEstado } : op
      )
    )
  }, [])

  // Agrupa por estado con filtro por tipo (CE-30)
  const porEstado = useMemo(() =>
    ESTADOS.reduce((acc, estado) => {
      acc[estado] = oportunidades.filter(op =>
        op.estado === estado && (!filtroTipo || op.tipo === filtroTipo)
      )
      return acc
    }, {}),
  [oportunidades, filtroTipo])

  return {
    oportunidades, porEstado, loading, error,
    filtroTipo, setFiltroTipo,
    moverOptimista, cargar,
  }
}