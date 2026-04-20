import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Spin, Typography } from 'antd'
import {
  ProjectOutlined, StarOutlined, EyeOutlined,
  EditOutlined, ExportOutlined, RocketOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { ProfileService } from '../../services/index'
import styles from './DashboardPage.module.css'

const { Text } = Typography;

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

const QuickLink = ({ to, icon, title, desc, color }) => (
  <Link to={to} className={styles.quickCard}>
    <div className={styles.quickIcon} style={{ background: `${color}18`, color }}>{icon}</div>
    <div>
      <div className={styles.quickTitle}>{title}</div>
      <div className={styles.quickDesc}>{desc}</div>
    </div>
  </Link>
)

export default function DashboardPage() {
  const { user }              = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ProfileService.stats()
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const portfolioUrl = `/public/${user?.username}`

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Header */}
        <motion.div className={styles.header} {...fadeUp(0)}>
          <div>
            <h1 className={styles.title}>
              Bonjour, <span className={styles.accent}>{user?.prenom ?? user?.name} 👋</span>
            </h1>
            <p className={styles.sub}>
              Bienvenue dans votre espace MonFolio. Gérez votre portfolio et suivez vos statistiques.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button type="primary" icon={<RocketOutlined />}>
              URL : <Text copyable={{ text: `https://monfolio.net${portfolioUrl}` }} style={{ color: 'inherit', marginLeft: 5 }}>
            monfolio.net/{portfolioUrl}
            </Text>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className={styles.statsGrid} {...fadeUp(0.08)}>
          {loading ? (
            <div className={styles.statsLoading}><Spin /></div>
          ) : (
            <>
              {[
                { label: 'Projets',           value: stats?.projects_count ?? 0,      icon: <ProjectOutlined />, color: '#4f8eff' },
                { label: 'Publiés',           value: stats?.published_projects ?? 0,  icon: <RocketOutlined />,  color: '#4ade80' },
                { label: 'Compétences',       value: stats?.skills_count ?? 0,        icon: <StarOutlined />,    color: '#f59e0b' },
                { label: 'Vues totales',      value: stats?.total_views ?? 0,         icon: <EyeOutlined />,     color: '#8b5cf6' },
              ].map(st => (
                <div key={st.label} className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color: st.color, background: `${st.color}18` }}>
                    {st.icon}
                  </div>
                  <div>
                    <div className={styles.statValue} style={{ color: st.color }}>{st.value}</div>
                    <div className={styles.statLabel}>{st.label}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div {...fadeUp(0.14)}>
          <h2 className={styles.sectionTitle}>Accès rapides</h2>
          <div className={styles.quickGrid}>
            <QuickLink to="/dashboard/gerer-mes-projets"      icon={<ProjectOutlined />} title="Gérer mes projets"     desc="Ajouter, modifier, supprimer vos projets"  color="#4f8eff" />
            <QuickLink to="/dashboard/gerer-mes-competences"  icon={<StarOutlined />}    title="Gérer mes compétences" desc="Mettre à jour votre tech stack"              color="#f59e0b" />
            <QuickLink to="/dashboard/modifier-mon-portfolio" icon={<EditOutlined />}    title="Personnaliser"         desc="Couleurs, thèmes, sections affichées"        color="#8b5cf6" />
            <QuickLink to="/dashboard/mes-informations"       icon={<EditOutlined />}    title="Mon profil"            desc="Photo, bio, liens sociaux"                   color="#4ade80" />
          </div>
        </motion.div>

        {/* Portfolio preview link */}
        <motion.div className={styles.previewBanner} {...fadeUp(0.2)}>
          <div>
            <div className={styles.previewTitle}>🌐 Votre portfolio public</div>
            <div className={styles.previewUrl}>https://monfolio.net{portfolioUrl}</div>
          </div>
          <Link to={portfolioUrl} className={styles.previewBtn} target="_blank" rel="noopener noreferrer">
            Voir <ExportOutlined />
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
