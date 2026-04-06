import { useState, useEffect, useCallback } from 'react'
import { proyectosAPI } from '../services/proyectosAPI'

export const ESTADOS_PROYECTO = ['ACTIVO', 'PAUSADO', 'COMPLETADO', 'CANCELADO']

export function useProyectos({ todos = false } = {}) {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  const cargar = useCallback(() => {
    setLoading(true); setError('')
    const fn = todos ? proyectosAPI.listarTodos : proyectosAPI.listar
    fn()
      .then(setProyectos)
      .catch(() => setError('No se pudieron cargar los proyectos.'))
      .finally(() => setLoading(false))
  }, [todos])

  useEffect(() => { cargar() }, [cargar])

  return { proyectos, loading, error, cargar }
}
