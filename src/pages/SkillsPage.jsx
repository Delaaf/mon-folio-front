import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spin, Empty } from 'antd'
import SkillBar from '../components/SkillBar'
import { SkillService } from '../services/index'
import { SKILL_CATEGORIES } from '../data/skills'
import styles from './SkillsPage.module.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const SkillsPage = () => {
  const [categories, setCategories] = useState([])
  const [active, setActive]         = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await SkillService.list()
        setCategories(data)
        if (data.length > 0) setActive(data[0].id)
      } catch {
        // Fallback to static data
        setCategories(SKILL_CATEGORIES.map((cat, i) => ({
          id: i + 1,
          label: cat.label,
          icon: cat.icon,
          skills: cat.skills,
        })))
        setActive(1)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const current = categories.find(c => c.id === active)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.inner}>
        <motion.div className={styles.header} {...fadeUp(0)}>
          <h1 className={styles.title}>My <span className={styles.accent}>Skills</span></h1>
          <p className={styles.subtitle}>Technologies and tools I use to build production-grade products.</p>
        </motion.div>

        <div className={styles.layout}>
          <motion.nav className={styles.tabs} {...fadeUp(0.1)}>
            {categories.map(cat => (
              <button key={cat.id}
                className={`${styles.tab} ${active === cat.id ? styles.tabActive : ''}`}
                onClick={() => setActive(cat.id)}>
                <span className={styles.tabIcon}>{cat.icon}</span>
                <span>{cat.label}</span>
                {active === cat.id && (
                  <motion.span className={styles.tabIndicator} layoutId="tabIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
              </button>
            ))}
          </motion.nav>

          <AnimatePresence mode="wait">
            {current && (
              <motion.div key={active} className={styles.panel}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelIcon}>{current.icon}</span>
                  <h2 className={styles.panelTitle}>{current.label}</h2>
                </div>
                <div className={styles.skillList}>
                  {current.skills?.length === 0 && (
                    <Empty description="Aucune compétence dans cette catégorie"
                      style={{ color: 'var(--text-secondary)' }} />
                  )}
                  {current.skills?.map((skill, i) => (
                    <motion.div key={skill.id ?? skill.name}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}>
                      <SkillBar name={skill.name} level={skill.level} color={skill.color} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SkillsPage
