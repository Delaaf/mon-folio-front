import React from 'react'
import { Button, notification } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'

import FilterBar    from '../components/FilterBar'
import ProjectCard  from '../components/ProjectCard'
import AddCard      from '../components/AddCard'
import { CaseStudyModal, ProjectFormModal } from '../components/Modal'

import { useProjects } from '../hooks/useProjects'
import { useModal }    from '../hooks/useModal'
import { TOTAL_PROJECTS_COUNT } from '../data/projects'

import styles from './ProjectsPage.module.css'

const ProjectsPage = ({ externalAddModal }) => {
  const {
    visible,
    filtered,
    hasMore,
    activeFilter,
    changeFilter,
    loadMore,
    addProject,
    updateProject,
  } = useProjects()

  const studyModal         = useModal()
  const internalFormModal  = useModal()
  const formModal          = externalAddModal ?? internalFormModal

  const [notifApi, notifCtx] = notification.useNotification()

  const handleSave = (projectData) => {
    if (formModal.data?.id) {
      updateProject(projectData)
      notifApi.success({ message: 'Projet mis à jour !', placement: 'bottomRight', duration: 3 })
    } else {
      addProject(projectData)
      notifApi.success({ message: 'Projet créé avec succès 🎉', placement: 'bottomRight', duration: 3 })
    }
    formModal.close()
  }

  return (
    <main className={styles.page}>
      {notifCtx}

      {/* ── Section header ── */}
      <div className={styles.header}>
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>
            Featured <span className={styles.accent}>Projects</span>
          </h1>
          <p className={styles.subtitle}>
            A showcase of full-stack engineering, scalable backend architectures,
            and high-performance user interfaces.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FilterBar active={activeFilter} onChange={changeFilter} />
        </motion.div>
      </div>

      {/* ── Grid ── */}
      <motion.div className={styles.grid} layout>
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onView={studyModal.open}
              onEdit={formModal.open}
            />
          ))}
        </AnimatePresence>

        {/* Add card */}
        <AddCard onClick={() => formModal.open(null)} />
      </motion.div>

      {/* ── Load more ── */}
      <div className={styles.loadMore}>
        {hasMore && (
          <Button
            className={styles.btnLoadMore}
            onClick={loadMore}
            icon={<DownOutlined />}
          >
            Load More Projects
          </Button>
        )}
        <p className={styles.counter}>
          Currently showing {Math.min(visible.length, filtered.length)} of{' '}
          {Math.max(TOTAL_PROJECTS_COUNT, filtered.length)} projects
        </p>
      </div>

      {/* ── Modals ── */}
      <CaseStudyModal
        project={studyModal.data}
        open={studyModal.isOpen}
        onClose={studyModal.close}
      />

      <ProjectFormModal
        project={formModal.data}
        open={formModal.isOpen}
        onClose={formModal.close}
        onSave={handleSave}
      />
    </main>
  )
}

export default ProjectsPage
