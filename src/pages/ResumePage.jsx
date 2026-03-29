import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SkillBar from '../components/SkillBar'
import { SKILL_CATEGORIES } from '../data/skills'
import styles from './SkillsPage.module.css'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const ResumePage = () => {
  const [active, setActive] = useState(SKILL_CATEGORIES[0].id)
  const current = SKILL_CATEGORIES.find((c) => c.id === active)

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />

      <div className={styles.inner}>
        {/* Header */}
        <motion.div className={styles.header} {...fadeUp(0)}>
          <h1 className={styles.title}>
            My <span className={styles.accent}>Skills</span>
          </h1>
          <p className={styles.subtitle}>
            Technologies and tools I use to build production-grade products.
          </p>
        </motion.div>

        {/* Layout : tab sidebar + panel */}
        <div className={styles.layout}>
          {/* Sidebar tabs */}
          <motion.nav className={styles.tabs} {...fadeUp(0.1)}>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tab} ${active === cat.id ? styles.tabActive : ''}`}
                onClick={() => setActive(cat.id)}
              >
                <span className={styles.tabIcon}>{cat.icon}</span>
                <span>{cat.label}</span>
                {active === cat.id && (
                  <motion.span
                    className={styles.tabIndicator}
                    layoutId="tabIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </motion.nav>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className={styles.panel}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0  }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.panelHeader}>
                <span className={styles.panelIcon}>{current.icon}</span>
                <h2 className={styles.panelTitle}>{current.label}</h2>
              </div>

              <div className={styles.skillList}>
                {current.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                  >
                    <SkillBar
                      name={skill.name}
                      level={skill.level}
                      color={skill.color}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ResumePage
