import React, { useEffect, useRef, useState } from 'react'
import styles from './SkillBar.module.css'

/**
 * SkillBar — barre de progression animée au montage
 * @param {string} name   — nom de la compétence
 * @param {number} level  — 0-100
 * @param {string} color  — couleur hex de la barre
 */
const SkillBar = ({ name, level, color }) => {
  const [filled, setFilled] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFilled(level) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [level])

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={styles.level}>{level}%</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${filled}%`,
            background: color || 'var(--accent)',
            transition: 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  )
}

export default SkillBar
