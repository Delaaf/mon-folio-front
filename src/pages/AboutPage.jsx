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

const getExperienceYears = (experiences = []) => {
  if (!experiences.length) return 0

  const currentYear = new Date().getFullYear()

  let min = currentYear
  let max = 0

  experiences.forEach(exp => {
    if (exp.start_year < min) min = exp.start_year

    const end = exp.end_year ?? currentYear
    if (end > max) max = end
  })

  return max - min + 1
}

const levelToPercent = (level) => {
  switch (level) {
    case 'Natif': return 100
    case 'Courant': return 85
    case 'Intermédiaire': return 60
    case 'Notions': return 40
    default: return 50
  }
}

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
console.log(profile)
  // Use API data or fall back to static
  const name     = profile?.name     ?? ABOUT.name
  const role     = profile?.role_title ?? ABOUT.role
  const location = profile?.location  ?? ABOUT.location
  const bio      = profile?.bio        ?? ABOUT.bio?.[0] ?? ''
  const avatar   = profile?.avatar    ?? null
  const experienceYears = getExperienceYears(profile?.experiences)
  const stats = [
        {
          value: `${experienceYears}+`,
          label: "Années d'expérience"
        },
        {
          value: profile?.projects?.length ?? 0,
          label: 'Projets'
        },
        {
          value: profile?.skills?.length ?? 0,
          label: 'Compétences'
        },
        {
          value: profile?.certifications?.length ?? 0,
          label: 'Certifications'
        }
      ]

const groupedSkills = (profile?.skills || []).reduce((acc, skill) => {
  const cat = skill.category?.label || 'Autres'

  if (!acc[cat]) acc[cat] = []
  acc[cat].push(skill)

  return acc
}, {})


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
              <span><CalendarOutlined /> {experienceYears}+ experience</span>
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.stats} {...fadeUp(0.1)}>
          {stats.map(({ value, label }) => (
            <div key={label} className={styles.statCard}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className={styles.section} {...fadeUp(0.18)}>
          <h2 className={styles.sectionTitle}>A propos de moi</h2>
          {bio && <p className={styles.bio}>{bio}</p>}
        </motion.div>

        <motion.div className={styles.section} {...fadeUp(0.26)}>
          <h2 className={styles.sectionTitle}>Experiences</h2>
          <div className={styles.timeline}>
          {(profile?.experiences ?? ABOUT.timeline).map((item, i) => (
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

        <motion.div className={styles.section} {...fadeUp(0.32)}>
          <h2 className={styles.sectionTitle}>Compétences</h2>

          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className={styles.skillCategory}>
            <h3 className={styles.skillCategoryTitle}>{category}</h3>

            <div className={styles.skillsGrid}>
            {skills.map(skill => (
              <div key={skill.id} className={styles.skillItem}>
              <span>{skill.name}</span>

            {/* 🔥 barre */}
              <div className={styles.skillBar}>
              <div
                className={styles.skillProgress}
                style={{ width: `${skill.level}%` }}
              />
              </div>
            </div>
            ))}
            </div>
            </div>
            ))}
        </motion.div>

        <motion.div className={styles.section} {...fadeUp(0.4)}>
          <h2 className={styles.sectionTitle}>Langues</h2>

          <div className={styles.languages}>
          {(profile?.languages || []).map(lang => (
            <div key={lang.id} className={styles.languageItem}>
              <div className={styles.languageHeader}>
                <span>{lang.name}</span>
                <span>{lang.level}</span>
              </div>

              <div className={styles.languageBar}>
                <div className={styles.languageProgress} style={{ width: `${levelToPercent(lang.level)}%` }}/>
              </div>
            </div>
          ))}
          </div>
        </motion.div>

        <motion.div className={styles.section} {...fadeUp(0.48)}>
          <h2 className={styles.sectionTitle}>Certifications</h2>

          <div className={styles.certifications}>
            {(profile?.certifications || []).map(cert => (
              <div key={cert.id} className={styles.certCard}>
        
                <div className={styles.certHeader}>
                  <div className={styles.certIcon}>🏆</div>

                  <div>
                    <div className={styles.certName}>{cert.name}</div>
                    <div className={styles.certOrg}>{cert.organization}</div>
                    </div>
                  </div>

                  <div className={styles.certFooter}>
                    <span className={styles.certYear}>{cert.year}</span>

                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className={styles.certLink}>
                        Voir
                      </a>
                    )}
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
