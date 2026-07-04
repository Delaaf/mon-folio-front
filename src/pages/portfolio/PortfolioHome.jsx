import React, { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  GithubOutlined, LinkedinOutlined, TwitterOutlined,
  GlobalOutlined, MailOutlined, EnvironmentOutlined,
} from '@ant-design/icons'
import { usePortfolio } from '../../layouts/PortfolioLayout'
import { useAnimations } from '../../hooks/useAnimations'
import styles from './PortfolioHome.module.css'

/* ── Particules flottantes décoratives ── */
function Particles({ enabled }) {
  if (!enabled) return null
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size:  Math.random() * 3 + 1,
    x:     Math.random() * 100,
    y:     Math.random() * 100,
    delay: Math.random() * 4,
    dur:   Math.random() * 6 + 6,
  }))

  return (
    <div className={styles.particles} aria-hidden>
      {particles.map(p => (
        <motion.span
          key={p.id}
          className={styles.particle}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -24, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Compteur animé ── */
function AnimatedCounter({ value, label, enabled }) {
  return (
    <motion.div
      className={styles.statItem}
      {...(enabled ? {
        initial: { opacity: 0, scale: 0.8 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { duration: 0.5, type: 'spring', stiffness: 200 },
      } : {})}
    >
      <span className={styles.statNum}>{value}</span>
      <span className={styles.statLbl}>{label}</span>
    </motion.div>
  )
}

export default function PortfolioHome() {
  const { profile, projects, settings: ctxSettings } = usePortfolio()
  const { username } = useParams()
  const anim    = useAnimations()
  const heroRef = useRef(null)

  const settings = ctxSettings ?? profile?.portfolio_settings ?? {}

  // Parallax scroll sur le hero
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', anim.enabled ? '18%' : '0%'])
  const heroOpac  = useTransform(scrollYProgress, [0, 0.6], [1, anim.enabled ? 0 : 1])

  // Projets en vedette — prend la cover image si disponible
  const allProjects = projects.flatMap(c => c.projects ?? [])
  const featured    = allProjects
    .filter(p => p.featured || p.status === 'published')
    .slice(0, 3)

  // Stats dynamiques
  const totalProjects = allProjects.length
  const totalViews    = allProjects.reduce((a, p) => a + (p.views_count ?? 0), 0)
  const totalSkills   = (profile?.skills ?? []).reduce((a, g) => a + (g.items?.length ?? 0), 0)

  return (
    <div className={styles.page}>
      <Particles enabled={anim.enabled} />

      {/* Glows décoratifs */}
      <motion.div
        className={styles.glow1}
        animate={anim.enabled ? { scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={styles.glow2}
        animate={anim.enabled ? { scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] } : {}}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className={styles.bgGrid} />

      {/* ══════════ HERO ══════════ */}
      <motion.section
        ref={heroRef}
        className={styles.hero}
        style={{ y: heroY, opacity: heroOpac }}
      >
        {/* ── Colonne gauche ── */}
        <div className={styles.heroLeft}>

          {/* Badge disponibilité */}
          {profile?.is_available && settings.show_availability_badge !== false && (
            <motion.div className={styles.badge} {...anim.fadeIn(0.1)}>
              <motion.span
                className={styles.badgeDot}
                animate={anim.enabled ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className={styles.badgeTxt}>Disponible pour des projets</span>
            </motion.div>
          )}

          {/* Titre principal */}
          <motion.h1 className={styles.headline} {...anim.fadeUp(0.15)}>
            <motion.span
              className={styles.headlineName}
              {...(anim.enabled ? {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0   },
                transition: { duration: 0.7, delay: 0.2 },
              } : {})}>
              {profile?.prenom ?? profile?.name?.split(' ')[0]},
            </motion.span>
            <br />
            <motion.span
              className={styles.headlineRole}
              {...(anim.enabled ? {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0   },
                transition: { duration: 0.7, delay: 0.35 },
              } : {})}>
              {profile?.role_title ?? profile?.title ?? 'Développeur'}
            </motion.span>
          </motion.h1>

          {/* Bio */}
          {settings.show_bio !== false && profile?.bio && (
            <motion.p className={styles.desc} {...anim.fadeUp(0.45)}>
              {profile.bio}
            </motion.p>
          )}

          {/* CTA buttons */}
          <motion.div className={styles.cta} {...anim.fadeUp(0.55)}>
            <motion.div {...anim.hoverScale}>
              <Link to={`/portfolio/${username}/projets`} className={styles.btnPrimary}>
                Voir mes projets
                <motion.span
                  animate={anim.enabled ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}>
                  →
                </motion.span>
              </Link>
            </motion.div>
            <motion.div {...anim.hoverLift}>
              <Link to={`/portfolio/${username}/contact`} className={styles.btnSecondary}>
                ✉ Me contacter
              </Link>
            </motion.div>
          </motion.div>

          {/* Location */}
          {profile?.location && (
            <motion.div className={styles.meta} {...anim.fadeIn(0.65)}>
              <span className={styles.metaItem}>
                <EnvironmentOutlined /> {profile.location}
              </span>
            </motion.div>
          )}

          {/* Social links */}
          <motion.div
            className={styles.social}
            variants={anim.staggerContainer}
            initial="initial"
            animate="animate">
            {[
              { url: profile?.github_url,   icon: <GithubOutlined />   },
              { url: profile?.linkedin_url, icon: <LinkedinOutlined /> },
              { url: profile?.twitter_url,  icon: <TwitterOutlined />  },
              { url: profile?.website,      icon: <GlobalOutlined />   },
              { url: profile?.email ? `mailto:${profile.email}` : null, icon: <MailOutlined /> },
            ].filter(s => s.url).map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                variants={anim.enabled ? {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0  },
                } : { initial: { opacity: 1 }, animate: { opacity: 1 } }}
                whileHover={anim.enabled ? { y: -3, scale: 1.1 } : {}}>
                {s.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Tech stack */}
          {settings.show_tech_stack !== false && profile?.skills?.length > 0 && (
            <motion.div className={styles.techWrap} {...anim.fadeUp(0.75)}>
              <div className={styles.techLabel}>Tech Stack</div>
              <motion.div
                className={styles.techItems}
                variants={anim.staggerContainer}
                initial="initial"
                animate="animate">
                {profile.skills.slice(0, 2).flatMap(g => g.items ?? []).slice(0, 8).map((sk, i) => (
                  <motion.span
                    key={sk.id ?? i}
                    className={styles.techTag}
                    variants={anim.enabled ? {
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1   },
                    } : { initial: { opacity: 1 }, animate: { opacity: 1 } }}
                    whileHover={anim.enabled ? { scale: 1.08, y: -2 } : {}}>
                    {sk.name}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* ── Avatar card ── */}
        <motion.div className={styles.heroRight} {...anim.slideLeft(0.2)}>
          <div className={styles.avatarCard}>
            <motion.div
              className={styles.glowRing}
              animate={anim.enabled ? { rotate: 360 } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            {profile?.avatar
              ? <img src={profile.avatar} alt={profile.name} className={styles.avatarImg} />
              : <div className={styles.avatarFallback}>{profile?.name?.[0]?.toUpperCase() ?? '?'}</div>
            }

            {/* Identity card flottante */}
            <motion.div
              className={styles.identityCard}
              animate={anim.enabled ? { y: [0, -6, 0] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <div className={styles.identityAva}>
                {profile?.avatar
                  ? <img src={profile.avatar} alt="" />
                  : profile?.name?.[0]?.toUpperCase()
                }
                {profile?.is_available && (
                  <motion.span
                    className={styles.identityOnline}
                    animate={anim.enabled ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <div className={styles.identityName}>{profile?.name}</div>
                <div className={styles.identityRole}>{profile?.role_title ?? profile?.title}</div>
              </div>
            </motion.div>

            {/* Stats flottantes */}
            {totalProjects > 0 && (
              <motion.div
                className={styles.statsFloat}
                animate={anim.enabled ? { y: [0, 5, 0] } : {}}
                transition={{ duration: 5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}>
                <AnimatedCounter value={totalProjects} label="projets"   enabled={anim.enabled} />
                {totalViews > 0 && <AnimatedCounter value={`${totalViews}`} label="vues" enabled={anim.enabled} />}
                {totalSkills > 0 && <AnimatedCounter value={totalSkills}  label="skills"  enabled={anim.enabled} />}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.section>

      {/* ══════════ PROJETS PHARES ══════════ */}
      {featured.length > 0 && (
        <section className={styles.featured}>

          <motion.div className={styles.sectionHd} {...anim.scrollReveal(0)}>
            <div>
              <div className={styles.sectionEyebrow}>Portfolio</div>
              <h2 className={styles.sectionTitle}>Projets phares</h2>
            </div>
            <Link to={`/portfolio/${username}/projets`} className={styles.seeAll}>
              Voir tous les projets →
            </Link>
          </motion.div>

          <div className={styles.projGrid}>
            {featured.map((p, i) => {
              const coverImg = p.images?.find(img => img.is_cover)?.url ?? p.images?.[0]?.url ?? null
              return (
                <motion.div
                  key={p.id}
                  className={styles.projCard}
                  {...anim.scrollReveal(i * 0.1)}
                  {...anim.hoverLift}>
                  <div className={styles.projThumb} style={{ background: p.gradient ?? 'linear-gradient(135deg,#0d0d20,#1a1a3e)' }}>
                    {coverImg
                      ? <img src={coverImg} alt={p.title} className={styles.projThumbImg} />
                      : <motion.span
                          className={styles.projEmoji}
                          animate={anim.enabled ? { rotate: [0, 8, -8, 0] } : {}}
                          transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}>
                          {p.emoji}
                        </motion.span>
                    }
                    <div className={styles.projOverlay} />
                  </div>
                  <div className={styles.projBody}>
                    <div className={styles.projTags}>
                      {(p.tags ?? []).slice(0, 3).map(t => (
                        <span key={t} className={styles.projTag}>{t}</span>
                      ))}
                    </div>
                    <h3 className={styles.projTitle}>{p.title}</h3>
                    <p className={styles.projDesc}>
                      {p.short_description ?? p.description?.slice(0, 100)}
                    </p>
                    <div className={styles.projLinks}>
                      {p.live_url   && <a href={p.live_url}   target="_blank" rel="noopener noreferrer" className={styles.projLink}>🔗 Live</a>}
                      {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={styles.projLink}><GithubOutlined /> Code</a>}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ══════════ SKILLS PREVIEW ══════════ */}
      {settings.show_tech_stack !== false && (profile?.skills?.length ?? 0) > 0 && (
        <section className={styles.skillsSection}>
          <motion.div className={styles.sectionHd} {...anim.scrollReveal(0)}>
            <div>
              <div className={styles.sectionEyebrow}>Expertise</div>
              <h2 className={styles.sectionTitle}>Compétences</h2>
            </div>
            <Link to={`/portfolio/${username}/competences`} className={styles.seeAll}>
              Voir tout →
            </Link>
          </motion.div>

          <div className={styles.skillsGrid}>
            {profile.skills.slice(0, 4).map((group, gi) => (
              <motion.div
                key={group.category ?? gi}
                className={styles.skillGroup}
                {...anim.scrollReveal(gi * 0.1)}>
                <div className={styles.skillGroupTitle}>{group.category}</div>
                <div className={styles.skillItems}>
                  {(group.items ?? []).slice(0, 5).map((sk, si) => (
                    <motion.div
                      key={sk.id ?? si}
                      className={styles.skillItem}
                      {...(anim.enabled ? {
                        initial: { opacity: 0, x: -12 },
                        whileInView: { opacity: 1, x: 0 },
                        viewport: { once: true },
                        transition: { delay: gi * 0.1 + si * 0.06 },
                      } : {})}>
                      <span className={styles.skillDot} />
                      {sk.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ CTA FINAL ══════════ */}
      <motion.section className={styles.ctaSection} {...anim.scrollReveal(0)}>
        <motion.div
          className={styles.ctaGlow}
          animate={anim.enabled ? { scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div className={styles.sectionEyebrow} {...anim.scrollFadeIn(0.1)}>
          Travaillons ensemble
        </motion.div>
        <motion.h2 className={styles.ctaTitle} {...anim.scrollReveal(0.15)}>
          Un projet en tête ?
        </motion.h2>
        <motion.p className={styles.ctaDesc} {...anim.scrollReveal(0.2)}>
          Je suis disponible pour des missions freelance, des collaborations ou un poste en CDI.
        </motion.p>
        <motion.div {...anim.scrollReveal(0.28)} {...anim.hoverScale}>
          <Link to={`/portfolio/${username}/contact`} className={styles.btnPrimary}>
            Démarrons une conversation →
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
