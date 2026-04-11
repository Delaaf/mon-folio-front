import React from 'react'
import { motion } from 'framer-motion'
import { Button } from 'antd'
import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import AvailableBadge from '../../components/AvailableBadge'
import HeroCard       from '../../components/HeroCard'
import TechStack      from '../../components/TechStack'
import { HERO }       from '../../data/hero'
import styles from './HomePage.module.css'

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

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

      <section className={styles.hero}>
        <div className={styles.left}>
          <AvailableBadge label={HERO.badge} />

          <motion.h1 className={styles.headline} variants={containerVariants} initial="hidden" animate="visible">
            {HERO.headline.map((line, i) => (
              <motion.span key={i}
                className={`${styles.headlineLine} ${i === HERO.accentLine ? styles.accent : ''}`}
                variants={lineVariants}>
                {line}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p className={styles.description}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.52 }}>
            {HERO.description}
          </motion.p>

          <motion.div className={styles.cta}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62 }}>
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end"
              className={styles.btnPrimary} onClick={() => navigate('/projets')}>
              {HERO.cta.primary}
            </Button>
            <Button size="large" icon={<MailOutlined />} className={styles.btnSecondary}
              onClick={() => navigate('/contact')}>
              {HERO.cta.secondary}
            </Button>
          </motion.div>

          <div className={styles.techWrap}><TechStack /></div>
        </div>
        <HeroCard name={HERO.name} role={HERO.role} />
      </section>
    </div>
  )
}

export default HomePage
