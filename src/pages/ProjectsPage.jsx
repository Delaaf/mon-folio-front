import React, { useEffect, useState } from 'react'
import { Button, notification, Empty, Spin } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'

import FilterBar    from '../components/FilterBar'
import ProjectCard  from '../components/ProjectCard'
import AddCard      from '../components/AddCard'
import { CaseStudyModal, ProjectFormModal } from '../components/Modal'
import { useModal } from '../hooks/useModal'
import { ProjectService } from '../services/index'
import { CATEGORIES } from '../data/projects'

import styles from './ProjectsPage.module.css'

const TOTAL = 24

const ProjectsPage = ({ externalAddModal }) => {
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('All')
  const [page, setPage]           = useState(1)
  const [meta, setMeta]           = useState({})
  const [notifApi, notifCtx]      = notification.useNotification()

  const studyModal        = useModal()
  const internalFormModal = useModal()
  const formModal         = externalAddModal ?? internalFormModal

  // Fetch projects from API
  const fetchProjects = async (reset = false) => {
    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      const params = {
        per_page: 6,
        page: currentPage,
        ...(filter !== 'All' && { category: filter }),
      }
      const res = await ProjectService.list(params)
      if (reset) {
        setProjects(res.data ?? [])
      } else {
        setProjects(prev => [...prev, ...(res.data ?? [])])
      }
      setMeta(res.meta ?? {})
    } catch {
      // Fallback to static data if API not connected
      const { PROJECTS } = await import('../data/projects')
      const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
      setProjects(filtered)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchProjects(true)
  }, [filter])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProjects(false)
  }

  const handleSave = async (projectData) => {
    try {
      if (formModal.data?.id) {
        const updated = await ProjectService.update(formModal.data.id, projectData)
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
        notifApi.success({ message: 'Projet mis à jour !', placement: 'bottomRight' })
      } else {
        const created = await ProjectService.create(projectData)
        setProjects(prev => [created, ...prev])
        notifApi.success({ message: 'Projet créé 🎉', placement: 'bottomRight' })
      }
      formModal.close()
    } catch (err) {
      notifApi.error({ message: err.response?.data?.message ?? 'Erreur', placement: 'bottomRight' })
    }
  }

  const hasMore = meta.current_page < meta.last_page

  return (
    <main className={styles.page}>
      {notifCtx}

      <div className={styles.header}>
        <motion.div className={styles.heroText}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={styles.title}>Featured <span className={styles.accent}>Projects</span></h1>
          <p className={styles.subtitle}>
            A showcase of full-stack engineering, scalable backend architectures,
            and high-performance user interfaces.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <FilterBar active={filter} onChange={setFilter} />
        </motion.div>
      </div>

      {loading && projects.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <Empty description="Aucun projet trouvé" style={{ padding: '60px 0', color: 'var(--text-secondary)' }} />
      ) : (
        <motion.div className={styles.grid} layout>
          <AnimatePresence mode="popLayout">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i}
                onView={studyModal.open} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div className={styles.loadMore}>
        {hasMore && !loading && (
          <Button className={styles.btnLoadMore} onClick={loadMore} icon={<DownOutlined />}>
            Load More Projects
          </Button>
        )}
        {loading && projects.length > 0 && <Spin />}
        <p className={styles.counter}>
          Affichage de {projects.length} sur {meta.total ?? TOTAL} projets
        </p>
      </div>

      <CaseStudyModal project={studyModal.data} open={studyModal.isOpen} onClose={studyModal.close} />
      <ProjectFormModal project={formModal.data} open={formModal.isOpen} onClose={formModal.close} onSave={handleSave} />
    </main>
  )
}

export default ProjectsPage
