import React from 'react'
import { motion } from 'framer-motion'
import { Button } from 'antd'
import { Spin } from 'antd'
import { useEffect } from 'react'
import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import AvailableBadge from '../../components/AvailableBadge'
import HeroCard       from '../../components/HeroCard'
import TechStack      from '../../components/TechStack'
import { HERO }       from '../../data/hero'
import styles from './HomePage.module.css'

import { useApi } from '../../hooks/useApi'
import { ProfileService, ProjectService, SkillService } from '../../services/index'


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const lineVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } },
}

const HomePage = () => {
  const navigate = useNavigate()

  const { data: profile, loading: loadingProfile, execute: fetchProfile } =
    useApi(ProfileService.get)

  const { data: projects, execute: fetchProjects } =
    useApi(ProjectService.list, { initialData: [] })

  const { data: categories, execute: fetchSkills } =
    useApi(SkillService.list, { initialData: [] })

  useEffect(() => {
    fetchProfile()
    fetchProjects()
    fetchSkills()
  }, [])

console.log("les categories==>", categories)

    const skills = (categories ?? []).flatMap(cat =>
  (cat.skills ?? []).map(skill => ({
    ...skill,
    category: cat.label
  }))
)
    const featuredProjects = projects
    .filter(p => p.featured || p.status === 'published')
    .slice(0, 3)

    if (loadingProfile) {
      return (<div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <Spin size="large" />
              </div>)
    }
  return (
    <div className={styles.page}>
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

            <section className={styles.hero}>
        <div className={styles.left}>

          {/* Badge */}
          {profile?.is_available && (
            <AvailableBadge label="Disponible pour des projets" />
          )}

          {/* Title */}
          <motion.h1 className={styles.headline}>
            <span className={styles.headlineLine}>
              {profile?.name?.split(' ')[0]},
            </span>
            <span className={`${styles.headlineLine} ${styles.accent}`}>
              {profile?.role_title || 'Développeur'}
            </span>
          </motion.h1>
        
          {/* Description */}
          <motion.p className={styles.description}>
            {profile?.bio || "Bienvenue sur votre espace."}
          </motion.p>
        
          {/* CTA */}
          <div className={styles.cta}>
            <Button type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/projets')}>
              Voir mes projets
            </Button>
        
            <Button icon={<MailOutlined />}
              onClick={() => navigate('/contact')}>
              Me contacter
            </Button>
          </div>
        
          {/* Tech stack */}
          <div className={styles.techWrap}>
            <div className={styles.techItems}>
              {skills.slice(0, 6).map(sk => (
               <span key={sk.id} className={styles.techTag} style={{ borderColor: sk.color, color: sk.color }}>
                 {sk.name}
               </span>
             ))}
            </div>
          </div>
            
        </div>
            
        {/* Card droite */}
        <HeroCard
          name={profile?.name}
          role={profile?.role_title}
        />
      </section>
    </div>
  )
}

export default HomePage
