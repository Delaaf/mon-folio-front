import React from 'react'
import { motion } from 'framer-motion'
import styles from './FilterBar.module.css'

/**
 * FilterBar — groupe de boutons pour filtrer les projets par catégorie
 * @param {string}   active      — catégorie actuellement sélectionnée
 * @param {Function} onChange    — callback(category: string)
 * @param {string[]} categories  — liste des catégories à afficher
 */
const FilterBar = ({ active, onChange, categories }) => {
  return (
    <div className={styles.bar} role="group" aria-label="Filtrer les projets">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.btn} ${active === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
        >
          {cat}
          {active === cat && (
            <motion.span
              className={styles.indicator}
              layoutId="filterIndicator"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

export default FilterBar