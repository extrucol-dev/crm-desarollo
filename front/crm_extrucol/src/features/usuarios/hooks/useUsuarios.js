import { useState, useEffect, useCallback } from 'react'
import { usuariosAPI } from '../services/usuariosAPI'

export function useUsuarios() {
  const [usuarios, setusuarios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [sector, setSector]     = useState('')

  const cargar = useCallback(() => {
    setLoading(true)
    setError('')
    usuariosAPI.listar()
      .then(setusuarios)
      .catch(() => setError('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const sectores = [...new Set(usuarios.map((c) => c.sector).filter(Boolean))]

  const filtrados = usuarios.filter((c) => {
    const q = busqueda.toLowerCase()
    return (
      (!busqueda || c.nombre?.toLowerCase().includes(q) || c.empresa?.toLowerCase().includes(q)) &&
      (!sector || c.sector === sector)
    )
  })

  return { filtrados, loading, error, sectores, busqueda, setBusqueda, sector, setSector, cargar }
}
