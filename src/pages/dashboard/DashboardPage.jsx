import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Avatar } from 'antd'
import {
  FolderOpen, Eye, Star, Rocket,
  TrendingUp, ArrowUpRight, Plus,
  ChevronRight, Globe, Clock, Zap,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { ProfileService } from '../../services/index'
import styles from './DashboardPage.module.css'

/* ── Helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
})

function StatCard({ icon: Icon, label, value, color, delta, delay }) {
  return (
    <motion.div className={styles.statCard} {...fadeUp(delay)}>
      <div className={styles.statTop}>
        <div className={styles.statIconWrap} style={{ background: `${color}14`, color }}>
          <Icon size={18} />
        </div>
        {delta !== undefined && (
          <div className={`${styles.statDelta} ${delta >= 0 ? styles.deltaUp : styles.deltaDown}`}>
            <TrendingUp size={11} />
            <span>{Math.abs(delta)}%</span>
          </div>
        )}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </motion.div>
  )
}

function QuickAction({ to, icon: Icon, label, desc, color }) {
  return (
    <Link to={to} className={styles.quickCard}>
      <div className={styles.quickIcon} style={{ background: `${color}12`, color }}>
        <Icon size={18} />
      </div>
      <div className={styles.quickBody}>
        <div className={styles.quickLabel}>{label}</div>
        <div className={styles.quickDesc}>{desc}</div>
      </div>
      <ChevronRight size={15} className={styles.quickArrow} />
    </Link>
  )
}

function ActivityItem({ icon: Icon, text, time, color }) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon} style={{ background: `${color}14`, color }}>
        <Icon size={14} />
      </div>
      <div className={styles.activityBody}>
        <div className={styles.activityText}>{text}</div>
        <div className={styles.activityTime}>{time}</div>
      </div>
    </div>
  )
}

/* ── PAGE ── */
export default function DashboardPage() {
  const { user }              = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ProfileService.stats()
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hour    = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const portfolioUrl = `/portfolio/${user?.username}`

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <motion.div className={styles.header} {...fadeUp(0)}>
        <div className={styles.headerLeft}>
          <div className={styles.greeting}>
            {greeting},{' '}
            <span className={styles.greetingName}>
              {user?.prenom ?? user?.name} 👋
            </span>
          </div>
          <p className={styles.headerSub}>
            Voici un aperçu de votre portfolio et de votre activité récente.
          </p>
        </div>
        <div className={styles.headerActions}>
          <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"
            className={styles.btnPortfolio}>
            <Globe size={14} />
            Voir mon portfolio
            <ArrowUpRight size={13} />
          </a>
          <Link to="/gerer-mes-projets" className={styles.btnAdd}>
            <Plus size={15} />
            Nouveau projet
          </Link>
        </div>
      </motion.div>

      {/* ── URL Badge ── */}
      <motion.div className={styles.urlBadge} {...fadeUp(0.06)}>
        <div className={styles.urlDot} />
        <span className={styles.urlLabel}>Votre portfolio est en ligne ·</span>
        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
          monfolio.dev/{user?.username}
        </a>
        <ArrowUpRight size={12} style={{ color: '#4f8eff', opacity: 0.7 }} />
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={FolderOpen} label="Projets" delay={0.08}
          value={loading ? '—' : (stats?.projects_count ?? 0)}
          color="#4f8eff" delta={12} />
        <StatCard
          icon={Rocket} label="Publiés" delay={0.12}
          value={loading ? '—' : (stats?.published_projects ?? 0)}
          color="#4ade80" />
        <StatCard
          icon={Eye} label="Vues totales" delay={0.16}
          value={loading ? '—' : (stats?.total_views ?? 0)}
          color="#8b5cf6" delta={8} />
        <StatCard
          icon={Star} label="Compétences" delay={0.20}
          value={loading ? '—' : (stats?.skills_count ?? 0)}
          color="#f59e0b" />
      </div>

      {/* ── Two columns ── */}
      <div className={styles.cols}>

        {/* Quick actions */}
        <motion.div className={styles.card} {...fadeUp(0.22)}>
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>
              <Zap size={15} className={styles.cardTitleIcon} />
              Accès rapides
            </div>
          </div>
          <div className={styles.quickList}>
            <QuickAction to="/mes-informations"       icon={FolderOpen} color="#4f8eff"
              label="Mes informations"       desc="Photo, bio, liens sociaux" />
            <QuickAction to="/gerer-mes-projets"      icon={FolderOpen} color="#8b5cf6"
              label="Gérer mes projets"      desc="Ajouter ou modifier vos projets" />
            <QuickAction to="/gerer-mes-competences"  icon={Star}       color="#f59e0b"
              label="Mes compétences"        desc="Tech stack et niveaux" />
            <QuickAction to="/modifier-mon-portfolio" icon={Rocket}     color="#4ade80"
              label="Personnaliser"          desc="Thème, couleurs, sections" />
          </div>
        </motion.div>

        {/* Right col */}
        <div className={styles.rightCol}>

          {/* Profile completion */}
          <motion.div className={styles.card} {...fadeUp(0.26)}>
            <div className={styles.cardHead}>
              <div className={styles.cardTitle}>
                <TrendingUp size={15} className={styles.cardTitleIcon} />
                Complétude du profil
              </div>
              <div className={styles.cardBadge}>
                {loading ? '—' : `${Math.min(100, Math.round(
                  ((stats?.projects_count > 0 ? 25 : 0) +
                   (stats?.skills_count   > 0 ? 25 : 0) +
                   (user?.bio             ? 25 : 0) +
                   (user?.avatar          ? 25 : 0))
                ))}%`}
              </div>
            </div>
            <div className={styles.completionList}>
              {[
                { label: 'Photo de profil',  done: !!user?.avatar,           to: '/mes-informations'       },
                { label: 'Bio renseignée',   done: !!user?.bio,              to: '/mes-informations'       },
                { label: 'Projets ajoutés',  done: (stats?.projects_count > 0), to: '/gerer-mes-projets'  },
                { label: 'Compétences',      done: (stats?.skills_count > 0),   to: '/gerer-mes-competences' },
              ].map(item => (
                <div key={item.label} className={styles.completionItem}>
                  <div className={`${styles.completionDot} ${item.done ? styles.completionDotDone : ''}`}>
                    {item.done && '✓'}
                  </div>
                  <span className={`${styles.completionLabel} ${item.done ? styles.completionLabelDone : ''}`}>
                    {item.label}
                  </span>
                  {!item.done && (
                    <Link to={item.to} className={styles.completionAction}>
                      Compléter →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div className={styles.card} {...fadeUp(0.3)}>
            <div className={styles.cardHead}>
              <div className={styles.cardTitle}>
                <Clock size={15} className={styles.cardTitleIcon} />
                Activité récente
              </div>
            </div>
            <div className={styles.activityList}>
              <ActivityItem icon={Rocket}    color="#4ade80" time="Il y a 2h"
                text="Portfolio consulté par un visiteur" />
              <ActivityItem icon={FolderOpen} color="#4f8eff" time="Hier"
                text="Projet mis à jour avec succès" />
              <ActivityItem icon={Star}      color="#f59e0b" time="Il y a 3j"
                text="Compétences mises à jour" />
              <ActivityItem icon={Eye}       color="#8b5cf6" time="Il y a 5j"
                text="12 nouvelles vues sur votre profil" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}