import React, { useState } from 'react'
import { Spin, Empty } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import FilterBar from '../../components/FilterBar'
import ProjectCard from '../../components/ProjectCard'
import { CaseStudyModal } from '../../components/Modal'
import { useModal } from '../../hooks/useModal'
import { usePortfolio } from '../../layouts/PortfolioLayout'
import styles from './PortfolioProjets.module.css'

const PortfolioProjets = () => {
  const { projects, loading } = usePortfolio()
  const [filter, setFilter]   = useState('Tout')
  const studyModal            = useModal()

  const categories    = ['Tout', ...(projects ?? []).map(c => c.label)]
  const filtered      = filter === 'Tout' ? (projects ?? []) : (projects ?? []).filter(c => c.label === filter)
  const totalProjects = (projects ?? []).reduce((acc, c) => acc + (c.projects?.length ?? 0), 0)

  return (
    <main className={styles.page}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>Projets <span className={styles.accent}>à la une</span></h1>
          <p className={styles.subtitle}>
            Transformer des idées complexes en solutions élégantes.
            {totalProjects > 0 && <span className={styles.count}> · {totalProjects} projet{totalProjects > 1 ? 's' : ''}</span>}
          </p>
        </div>
        {categories.length > 1 && <FilterBar active={filter} onChange={setFilter} categories={categories} />}
      </motion.div>

      {loading ? (
        <div className={styles.center}><Spin size="large" /></div>
      ) : !filtered.length ? (
        <div className={styles.center}><Empty description="Aucun projet trouvé" /></div>
      ) : (
        <div className={styles.categories}>
          {filtered.map((category, catIndex) => (
            <motion.div key={category.id} className={styles.categoryBlock}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: catIndex * 0.08 }}>

              {filter === 'Tout' && filtered.length > 1 && (
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{category.label}</h2>
                  <span className={styles.categoryCount}>
                    {category.projects?.length ?? 0} projet{(category.projects?.length ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {!category.projects?.length ? (
                <div className={styles.emptyCategory}>Aucun projet publié dans cette catégorie.</div>
              ) : (
                <motion.div className={styles.grid} layout>
                  <AnimatePresence mode="popLayout">
                    {category.projects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} onView={studyModal.open} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <CaseStudyModal project={studyModal.data} open={studyModal.isOpen} onClose={studyModal.close} />
    </main>
  )
}

export default PortfolioProjets
