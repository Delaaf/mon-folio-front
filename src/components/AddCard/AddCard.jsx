import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import styles from './AddCard.module.css'

/**
 * AddCard — carte CTA pour ajouter un nouveau projet
 * @param {Function} onClick — ouvre la modale de création
 */
const AddCard = ({ onClick }) => {
  return (
    <motion.div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Ajouter un projet"
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.42, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.iconWrap}>
        <PlusOutlined className={styles.icon} />
      </div>
      <span className={styles.label}>Ajouter un projet</span>
      <span className={styles.sub}>Cliquez pour créer</span>
    </motion.div>
  )
}

export default AddCard
