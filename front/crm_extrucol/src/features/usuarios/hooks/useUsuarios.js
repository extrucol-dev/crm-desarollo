import { useState, useEffect, useCallback } from 'react'
import { usuariosAPI } from '../services/usuariosAPI'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [toggling, setToggling]   = useState(null) // id del usuario siendo actualizado

  const cargar = useCallback(() => {
    setLoading(true); setError('')
    usuariosAPI.listar()
      .then(setUsuarios)
      .catch(() => setError('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const filtrados = usuarios.filter(u => {
    const q = busqueda.toLowerCase()
    return (
      (!busqueda || u.nombre?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
      (!filtroRol || u.rol === filtroRol)
    )
  })

  const toggleEstado = async (id, activo) => {
    setToggling(id)
    try {
      const updated = await usuariosAPI.actualizarEstado(id, activo)
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: updated.activo } : u))
    } catch {
      setError('No se pudo actualizar el estado del usuario.')
    } finally {
      setToggling(null)
    }
  }

  return { filtrados, loading, error, busqueda, setBusqueda, filtroRol, setFiltroRol, toggling, toggleEstado, cargar, usuarios }
}
