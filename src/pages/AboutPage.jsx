import React from 'react'
import { motion } from 'framer-motion'
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons'
import { ABOUT } from '../data/about'
import styles from './AboutPage.module.css'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

const AboutPage = () => (
  <div className={styles.page}>
    <div className={styles.bgGlow} />

    <div className={styles.inner}>
      {/* ── Header ── */}
      <motion.div className={styles.header} {...fadeUp(0)}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>AR</div>
          <span className={styles.onlineDot} />
        </div>
        <div>
          <h1 className={styles.name}>{ABOUT.name}</h1>
          <p className={styles.role}>{ABOUT.role}</p>
          <div className={styles.meta}>
            <span><EnvironmentOutlined /> {ABOUT.location}</span>
            <span><CalendarOutlined /> {ABOUT.experience} experience</span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div className={styles.stats} {...fadeUp(0.1)}>
        {ABOUT.stats.map(({ value, label }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Bio ── */}
      <motion.div className={styles.section} {...fadeUp(0.18)}>
        <h2 className={styles.sectionTitle}>About Me</h2>
        {ABOUT.bio.map((p, i) => (
          <p key={i} className={styles.bio}>{p}</p>
        ))}
      </motion.div>

      {/* ── Timeline ── */}
      <motion.div className={styles.section} {...fadeUp(0.26)}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={styles.timeline}>
          {ABOUT.timeline.map((item, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineLeft}>
                <span className={styles.timelineYear}>{item.year}</span>
                <div className={styles.timelineLine} />
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineRole}>{item.role}</div>
                <div className={styles.timelineCompany}>{item.company}</div>
                <p className={styles.timelineDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
)

export default AboutPage
