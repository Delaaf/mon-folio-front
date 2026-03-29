import React from 'react'
import { motion } from 'framer-motion'
import styles from './HeroCard.module.css'

/**
 * HeroCard — carte visuelle droite avec l'orbe 3D et la carte identité
 * @param {string} name  — nom affiché dans la carte identité
 * @param {string} role  — rôle affiché
 */
const HeroCard = ({ name = 'Alex Rivera', role = 'Lead Full-Stack Developer' }) => (
  <motion.div
    className={styles.wrap}
    initial={{ opacity: 0, x: 40, scale: 0.95 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Main card */}
    <div className={styles.card}>
      {/* Subtle corner glow */}
      <div className={styles.glowTop} />

      {/* Orb / 3D element */}
      <div className={styles.orbWrap}>
        <div className={styles.orb}>
          <div className={styles.orbRing1} />
          <div className={styles.orbRing2} />
          <div className={styles.orbRing3} />
          <div className={styles.orbCore} />
        </div>
      </div>

      {/* Identity card pinned at bottom */}
      <motion.div
        className={styles.identityCard}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className={styles.avatar}>
          <span className={styles.avatarInitials}>AR</span>
          <span className={styles.avatarOnline} />
        </div>
        <div className={styles.identityText}>
          <span className={styles.identityName}>{name}</span>
          <span className={styles.identityRole}>{role}</span>
        </div>
      </motion.div>
    </div>
  </motion.div>
)

export default HeroCard
