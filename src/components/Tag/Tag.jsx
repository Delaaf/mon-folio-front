import React from 'react'
import { TAG_COLORS } from '../../data/projects'
import styles from './Tag.module.css'

/**
 * Tag — badge technologie avec couleur sémantique
 * @param {string} label  — nom de la techno
 * @param {string} size   — 'sm' | 'md' (défaut 'sm')
 */
const Tag = ({ label, size = 'sm' }) => {
  const palette = TAG_COLORS[label]

  const inlineStyle = palette
    ? { color: palette.color, background: palette.bg, borderColor: palette.border }
    : {}

  return (
    <span
      className={`${styles.tag} ${styles[size]}`}
      style={inlineStyle}
    >
      {label}
    </span>
  )
}

export default Tag
