import { useState, useMemo, useCallback } from 'react'
import { PROJECTS } from '../data/projects'

/**
 * useProjects — gère l'état global des projets :
 * filtrage par catégorie, pagination, CRUD (add / update / delete)
 */
export function useProjects() {
  const [projects, setProjects]     = useState(PROJECTS)
  const [activeFilter, setFilter]   = useState('All')
  const [visibleCount, setVisible]  = useState(6)

  // Projets filtrés selon la catégorie active
  const filtered = useMemo(
    () =>
      activeFilter === 'All'
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [projects, activeFilter]
  )

  const visible    = filtered.slice(0, visibleCount)
  const hasMore    = visibleCount < filtered.length

  // Changer le filtre remet la pagination à zéro
  const changeFilter = useCallback((cat) => {
    setFilter(cat)
    setVisible(6)
  }, [])

  const loadMore = useCallback(() => setVisible((n) => n + 3), [])

  // Ajouter un projet
  const addProject = useCallback((project) => {
    setProjects((prev) => [{ ...project, id: Date.now() }, ...prev])
  }, [])

  // Modifier un projet existant
  const updateProject = useCallback((updated) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }, [])

  // Supprimer un projet
  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    projects,
    filtered,
    visible,
    hasMore,
    activeFilter,
    visibleCount,
    changeFilter,
    loadMore,
    addProject,
    updateProject,
    deleteProject,
  }
}
