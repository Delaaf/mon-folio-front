import React, { useEffect, useState } from 'react'
import { Button, notification, Empty, Spin } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'

import FilterBar from '../../components/FilterBar'
import ProjectCard from '../../components/ProjectCard'
import { CaseStudyModal } from '../../components/Modal'
import { useModal } from '../../hooks/useModal'
import { usePortfolio } from '../../layouts/PortfolioLayout'

import styles from './PortfolioProjets.module.css'

const PortfolioProjets = () => {
  const { projects, loading } = usePortfolio()

  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('Tout')

  const [notifApi, notifCtx] = notification.useNotification()
  const studyModal = useModal()

  // Générer les catégories dynamiques
  useEffect(() => {
    if (!projects) return

    const uniqueCats = ['Tout', ...projects.map(c => c.label)]
    setCategories(uniqueCats)
  }, [projects])

  // Filtrage
  const filteredProjects = projects?.filter(
    (category) => filter === 'Tout' || category.label === filter
  )
  return (
    <main className={styles.page}>
      {notifCtx}

      <div className={styles.header}>
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>
            Projets <span className={styles.accent}>à la une</span>
          </h1>
          <p className={styles.subtitle}>
            Transformer des idées complexes en solutions élégantes.
          </p>
        </motion.div>

        <FilterBar
          active={filter}
          onChange={setFilter}
          categories={categories}
        />
      </div>

      {loading ? (
        <div className={styles.center}>
          <Spin size="large" />
        </div>
      ) : !filteredProjects?.length ? (
        <Empty description="Aucun projet trouvé" />
      ) : (
        <div className={styles.categories}>
          {filteredProjects.map((category) => (
            <div key={category.id} className={styles.categoryBlock}>
              <h2 className={styles.categoryTitle}>{category.label}</h2>

              <motion.div className={styles.grid} layout>
                <AnimatePresence mode="popLayout">
                  {category.projects.map((project, i) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={i}
                      onView={studyModal.open}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      <CaseStudyModal
        project={studyModal.data}
        open={studyModal.isOpen}
        onClose={studyModal.close}
      />
    </main>
  )
}

export default PortfolioProjets