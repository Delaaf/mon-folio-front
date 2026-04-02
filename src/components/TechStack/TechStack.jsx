import React from 'react'
import { motion } from 'framer-motion'
import { TECH_STACK } from '../../data/hero'
import styles from './TechStack.module.css'

const ICON_MAP = {
  React:      { svg: true,  content: '<>' },
  'Node.js':  { svg: false, content: '⬡'  },
  TypeScript: { svg: false, content: 'TS' },
  PostgreSQL: { svg: false, content: '🐘' },
}

/**
 * TechStack — liste des technologies affichée sous le CTA
 */
const TechStack = () => (
  <motion.div
    className={styles.wrap}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
  >
    <span className={styles.sectionLabel}>Stack Technique</span>
    <div className={styles.items}>
      {TECH_STACK.map(({ label }) => (
        <div key={label} className={styles.item}>
          <span className={styles.icon}>{ICON_MAP[label]?.content}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  </motion.div>
)

export default TechStack
