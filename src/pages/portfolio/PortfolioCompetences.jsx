import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from './PortfolioLayout'
import styles from './PortfolioCompetences.module.css'

export function PortfolioCompetences() {
  const { profile } = usePortfolio()
  const skills      = profile?.skills ?? []

  // Grouper par catégorie
  const byCategory = skills.reduce((acc, sk) => {
    const cat = sk.category?.label ?? 'Autres'
    const icon = sk.category?.icon ?? '🔧'
    if (!acc[cat]) acc[cat] = { icon, skills: [] }
    acc[cat].skills.push(sk)
    return acc
  }, {})

  const [activeTab, setActiveTab] = useState(Object.keys(byCategory)[0] ?? null)
  const current = activeTab ? byCategory[activeTab] : null

  if (skills.length === 0) return (
    <div className={styles.empty}>
      <span>🛠</span>
      <p>Aucune compétence renseignée.</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={styles.title}>Mes <span className={styles.accent}>compétences</span></h1>
          <p className={styles.sub}>{skills.length} technologies maîtrisées</p>
        </motion.div>

        <div className={styles.layout}>
          {/* Tabs */}
          <nav className={styles.tabs}>
            {Object.entries(byCategory).map(([cat, { icon }]) => (
              <button key={cat}
                className={`${styles.tab} ${activeTab === cat ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(cat)}>
                <span className={styles.tabIcon}>{icon}</span>
                <span>{cat}</span>
              </button>
            ))}
          </nav>

          {/* Panel */}
          {current && (
            <motion.div key={activeTab} className={styles.panel}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}>
              <div className={styles.panelHeader}>
                <span className={styles.panelIcon}>{current.icon}</span>
                <h2 className={styles.panelTitle}>{activeTab}</h2>
              </div>
              <div className={styles.skillList}>
                {current.skills.map((sk, i) => (
                  <motion.div key={sk.id} className={styles.skillBar}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <div className={styles.skillHd}>
                      <span className={styles.skillName}>{sk.name}</span>
                      <span className={styles.skillPct}>{sk.level}%</span>
                    </div>
                    <div className={styles.track}>
                      <motion.div className={styles.fill}
                        style={{ background: sk.color ?? 'var(--accent)' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sk.level}%` }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
