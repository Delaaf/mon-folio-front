import React from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RocketOutlined,
  ThunderboltOutlined,
  EyeOutlined
} from '@ant-design/icons'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      {/* BACKGROUND EFFECT */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      {/* HERO */}
      <section className={styles.hero}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Crée ton portfolio <br />
          <span>professionnel en minutes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Présente tes projets, compétences et démarque-toi
          avec une plateforme moderne et puissante.
        </motion.p>

        <motion.div className={styles.cta}>
          <Button type="primary" size="large"
            onClick={() => navigate('/inscription')}>
            Commencer gratuitement
          </Button>

          <Button size="large"
            onClick={() => navigate('/connexion')}>
            Se connecter
          </Button>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className={styles.trust}>
        <p>+15 développeurs utilisent déjà la plateforme</p>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <Feature icon={<RocketOutlined />} title="Rapide">
          Crée ton portfolio en quelques minutes
        </Feature>

        <Feature icon={<ThunderboltOutlined />} title="Puissant">
          Gère projets et compétences facilement
        </Feature>

        <Feature icon={<EyeOutlined />} title="Visible">
          Partage ton lien et attire des recruteurs
        </Feature>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.steps}>
        <Step number="01" title="Créer un compte" />
        <Step number="02" title="Ajouter tes informations" />
        <Step number="03" title="Partager ton lien" />
      </section>

      {/* CTA FINAL */}
      <section className={styles.finalCta}>
        <h2>Prêt à booster ta carrière ?</h2>
        <Button type="primary" size="large"
          onClick={() => navigate('/inscription')}>
          Créer mon portfolio
        </Button>
      </section>

    </div>
  )
}

function Feature({ icon, title, children }) {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -6 }}
    >
      <div className={styles.icon}>{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </motion.div>
  )
}

function Step({ number, title }) {
  return (
    <div className={styles.step}>
      <span>{number}</span>
      <p>{title}</p>
    </div>
  )
}