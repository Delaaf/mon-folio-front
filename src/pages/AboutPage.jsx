import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Spin } from 'antd'
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons'
import { ProfileService } from '../services/index'
import { ABOUT } from '../data/about'
import styles from './AboutPage.module.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

const AboutPage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ProfileService.get()
        setProfile(data)
      } catch {
        // Fallback to static data
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Use API data or fall back to static
  const name     = profile?.profile_data?.name     ?? ABOUT.name
  const role     = profile?.profile_data?.role_title ?? ABOUT.role
  const location = profile?.profile_data?.location  ?? ABOUT.location
  const bio      = profile?.profile_data?.bio        ?? ABOUT.bio?.[0] ?? ''
  const avatar   = profile?.profile_data?.avatar    ?? null

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.inner}>

        <motion.div className={styles.header} {...fadeUp(0)}>
          <div className={styles.avatarWrap}>
            {avatar
              ? <img src={avatar} alt={name} className={styles.avatar} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(79,142,255,0.3)' }} />
              : <div className={styles.avatar}>{name?.[0]?.toUpperCase() ?? 'A'}</div>
            }
            <span className={styles.onlineDot} />
          </div>
          <div>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.role}>{role}</p>
            <div className={styles.meta}>
              {location && <span><EnvironmentOutlined /> {location}</span>}
              <span><CalendarOutlined /> {ABOUT.experience} experience</span>
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.stats} {...fadeUp(0.1)}>
          {ABOUT.stats.map(({ value, label }) => (
            <div key={label} className={styles.statCard}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className={styles.section} {...fadeUp(0.18)}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          {bio && <p className={styles.bio}>{bio}</p>}
          {ABOUT.bio?.slice(1).map((p, i) => <p key={i} className={styles.bio}>{p}</p>)}
        </motion.div>

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
}

export default AboutPage
