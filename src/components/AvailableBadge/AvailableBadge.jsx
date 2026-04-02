import React from 'react'
import { motion } from 'framer-motion'
import styles from './AvailableBadge.module.css'

/**
 * AvailableBadge — indicateur de disponibilité animé (point vert pulsant)
 */
const AvailableBadge = ({ label = 'Disponible pour vos projets' }) => (
  <motion.div
    className={styles.badge}
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <span className={styles.dot} />
    <span className={styles.label}>{label}</span>
  </motion.div>
)

export default AvailableBadge
