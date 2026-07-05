import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GithubOutlined, LinkedinOutlined, TwitterOutlined,
  GlobalOutlined, MailOutlined, EnvironmentOutlined,
} from '@ant-design/icons'
import { usePortfolio } from '../../layouts/PortfolioLayout'
import PortfolioBg from '../../components/PortfolioBg/PortfolioBg'
import styles from './PortfolioHome.module.css'

export default function PortfolioHome() {
  const { profile, projects, settings: ctxSettings } = usePortfolio()
  const { username } = useParams()

  const settings       = ctxSettings ?? profile?.portfolio_settings ?? {}
  const bgType         = settings.bg_animation ?? 'grid'
  const accentColor    = settings.accent_color  ?? '#4f8eff'

  const allProjects    = (projects ?? []).flatMap(c => c.projects ?? [])
  const featuredProjects = allProjects
    .filter(p => p.featured || p.status === 'published')
    .slice(0, 3)

  return (
    <div className={styles.page}>

      {/* ── Fond animé — contrôlé par settings ── */}
      <PortfolioBg type={bgType} accent={accentColor} />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <motion.div className={styles.heroLeft}
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>

          {/* Badge disponibilité */}
          {profile?.is_available && settings.show_availability_badge !== false && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeTxt}>Disponible pour des projets</span>
            </div>
          )}

          <h1 className={styles.headline}>
            {profile?.prenom ?? profile?.name?.split(' ')[0]},<br />
            <span className={styles.accent}>{profile?.role_title ?? profile?.title ?? 'Développeur'}</span>
          </h1>

          {settings.show_bio !== false && profile?.bio && (
            <p className={styles.desc}>{profile.bio}</p>
          )}

          <div className={styles.cta}>
            <Link to={`/public/${username}/projets`} className={styles.btnPrimary}>
              Voir mes projets →
            </Link>
            <Link to={`/public/${username}/contact`} className={styles.btnSecondary}>
              ✉ Me contacter
            </Link>
          </div>

          <div className={styles.meta}>
            {profile?.location && (
              <span className={styles.metaItem}><EnvironmentOutlined /> {profile.location}</span>
            )}
          </div>

          <div className={styles.social}>
            {profile?.github_url   && <a href={profile.github_url}   target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><GithubOutlined /></a>}
            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><LinkedinOutlined /></a>}
            {profile?.twitter_url  && <a href={profile.twitter_url}  target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><TwitterOutlined /></a>}
            {profile?.website      && <a href={profile.website}      target="_blank" rel="noopener noreferrer" className={styles.socialBtn}><GlobalOutlined /></a>}
            {profile?.email        && <a href={`mailto:${profile.email}`} className={styles.socialBtn}><MailOutlined /></a>}
          </div>

          {settings.show_tech_stack !== false && profile?.skills?.length > 0 && (
            <div className={styles.techWrap}>
              <div className={styles.techLabel}>Tech Stack</div>
              <div className={styles.techItems}>
                {profile.skills.slice(0, 6).map(sk => (
                  <span key={sk.id} className={styles.techTag} style={{ borderColor: sk.color, color: sk.color }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Avatar card */}
        <motion.div className={styles.heroRight}
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.avatarCard}>
            <div className={styles.glowTop} />
            {profile?.avatar
              ? <img src={profile.avatar} alt={profile.name} className={styles.avatarImg} />
              : <div className={styles.avatarFallback}>{profile?.name?.[0]?.toUpperCase() ?? '?'}</div>
            }
            <div className={styles.identityCard}>
              <div className={styles.identityAva}>
                {profile?.avatar
                  ? <img src={profile.avatar} alt="" />
                  : profile?.name?.[0]?.toUpperCase()
                }
                {profile?.is_available && <span className={styles.identityOnline} />}
              </div>
              <div>
                <div className={styles.identityName}>{profile?.name}</div>
                <div className={styles.identityRole}>{profile?.role_title ?? profile?.title}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Projets en vedette ── */}
      {featuredProjects.length > 0 && (
        <section className={styles.featured}>
          <div className={styles.featuredInner}>
            <div className={styles.sectionHd}>
              <h2 className={styles.sectionTitle}>Projets phares</h2>
              <Link to={`/public/${username}/projets`} className={styles.seeAll}>
                Voir tous →
              </Link>
            </div>
            <div className={styles.projGrid}>
              {featuredProjects.map((p, i) => {
                const cover = p.images?.find(img => img.is_cover)?.url ?? p.images?.[0]?.url ?? null
                return (
                  <motion.div key={p.id} className={styles.projCard}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ y: -4 }}>
                    <div className={styles.projThumb} style={{ background: p.gradient }}>
                      {cover
                        ? <img src={cover} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <span className={styles.projEmoji}>{p.emoji}</span>
                      }
                    </div>
                    <div className={styles.projBody}>
                      <div className={styles.projTags}>
                        {(p.tags ?? []).slice(0, 3).map(t => (
                          <span key={t} className={styles.projTag}>{t}</span>
                        ))}
                      </div>
                      <h3 className={styles.projTitle}>{p.title}</h3>
                      <p className={styles.projDesc}>{p.short_description ?? p.description?.slice(0, 100)}</p>
                      <div className={styles.projLinks}>
                        {p.live_url   && <a href={p.live_url}   target="_blank" rel="noopener noreferrer">🔗 Live</a>}
                        {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer"><GithubOutlined /> Code</a>}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
