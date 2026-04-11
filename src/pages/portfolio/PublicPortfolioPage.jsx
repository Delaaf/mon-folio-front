import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Spin, Tag, Empty } from 'antd'
import {
  GithubOutlined, LinkedinOutlined, TwitterOutlined,
  GlobalOutlined, MailOutlined, EnvironmentOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import api from '../../services/api'
import styles from './PublicPortfolioPage.module.css'

/* ── Composant carte projet ── */
const ProjectCard = ({ project }) => (
  <motion.div
    className={styles.projCard}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <div className={styles.projThumb} style={{ background: project.gradient }}>
      <span className={styles.projEmoji}>{project.emoji}</span>
    </div>
    <div className={styles.projBody}>
      <div className={styles.projTags}>
        {(project.tags ?? []).slice(0, 3).map(t => (
          <span key={t} className={styles.projTag}>{t}</span>
        ))}
      </div>
      <h3 className={styles.projTitle}>{project.title}</h3>
      <p className={styles.projDesc}>{project.description}</p>
      <div className={styles.projLinks}>
        {project.live_url   && <a href={project.live_url}   target="_blank" rel="noopener noreferrer" className={styles.projLink}>🔗 Live</a>}
        {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={styles.projLink}><GithubOutlined /> GitHub</a>}
      </div>
    </div>
  </motion.div>
)

/* ── Page principale ── */
export default function PublicPortfolioPage() {
  const { username }          = useParams()
  const navigate              = useNavigate()
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [filter, setFilter]   = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          api.get(`/public/${username}`),
          api.get(`/public/${username}/projects`, { params: { per_page: 12 } }),
        ])
        setProfile(profileRes.data.data)
        setProjects(projectsRes.data.data ?? [])
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [username])

  const categories = ['All', ...new Set(projects.map(p => p.category))]
  const filtered   = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  if (loading) return (
    <div className={styles.center}><Spin size="large" /></div>
  )

  if (notFound) return (
    <div className={styles.center}>
      <div className={styles.notFound}>
        <span style={{ fontSize: 48 }}>🔍</span>
        <h2>Portfolio introuvable</h2>
        <p>Le profil <strong>@{username}</strong> n'existe pas ou est privé.</p>
        <Button type="primary" onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    </div>
  )

  const settings = profile?.portfolio_settings ?? {}

  return (
    <div className={styles.page} style={{ '--accent': settings.accent_color ?? '#4f8eff' }}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <motion.div className={styles.heroContent}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>

          {/* Avatar */}
          <div className={styles.avatarWrap}>
            {profile?.avatar
              ? <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
              : <div className={styles.avatarFallback}>{profile?.name?.[0]?.toUpperCase() ?? '?'}</div>
            }
            {profile?.is_available && (
              <span className={styles.availBadge} title="Disponible pour des projets" />
            )}
          </div>

          {/* Infos */}
          <h1 className={styles.heroName}>{profile?.name}</h1>
          <p className={styles.heroRole}>{profile?.role_title}</p>

          {profile?.location && (
            <div className={styles.heroLocation}>
              <EnvironmentOutlined /> {profile.location}
            </div>
          )}

          {settings.show_bio && profile?.bio && (
            <p className={styles.heroBio}>{profile.bio}</p>
          )}

          {/* Social links */}
          <div className={styles.socialLinks}>
            {profile?.github_url   && <a href={profile.github_url}   target="_blank" rel="noopener noreferrer" className={styles.socialLink}><GithubOutlined /></a>}
            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}><LinkedinOutlined /></a>}
            {profile?.twitter_url  && <a href={profile.twitter_url}  target="_blank" rel="noopener noreferrer" className={styles.socialLink}><TwitterOutlined /></a>}
            {profile?.website      && <a href={profile.website}      target="_blank" rel="noopener noreferrer" className={styles.socialLink}><GlobalOutlined /></a>}
            {profile?.email        && <a href={`mailto:${profile.email}`} className={styles.socialLink}><MailOutlined /></a>}
          </div>

          {/* CTA */}
          <div className={styles.heroCTA}>
            <Button type="primary" size="large" className={styles.btnContact}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              ✉ Me contacter
            </Button>
            {profile?.is_available && (
              <span className={styles.availText}>
                <span className={styles.availDot} /> Disponible pour des projets
              </span>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Projets ── */}
      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Projets</h2>
              <div className={styles.filters}>
                {categories.map(cat => (
                  <button key={cat}
                    className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                    onClick={() => setFilter(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.projGrid}>
              {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Compétences ── */}
      {profile?.skills?.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Compétences</h2>
            <div className={styles.skillsGrid}>
              {Object.entries(
                profile.skills.reduce((acc, sk) => {
                  const cat = sk.category?.label ?? 'Autres'
                  if (!acc[cat]) acc[cat] = []
                  acc[cat].push(sk)
                  return acc
                }, {})
              ).map(([cat, skills]) => (
                <div key={cat} className={styles.skillGroup}>
                  <h3 className={styles.skillGroupTitle}>{cat}</h3>
                  {skills.map(sk => (
                    <div key={sk.id} className={styles.skillBar}>
                      <div className={styles.skillBarHeader}>
                        <span className={styles.skillName}>{sk.name}</span>
                        <span className={styles.skillLevel}>{sk.level}%</span>
                      </div>
                      <div className={styles.skillTrack}>
                        <motion.div className={styles.skillFill}
                          style={{ background: sk.color ?? 'var(--accent)' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${sk.level}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <section className={styles.section} id="contact">
        <div className={styles.sectionInner}>
          <ContactSection username={username} ownerName={profile?.name} />
        </div>
      </section>
    </div>
  )
}

/* ── Formulaire de contact ── */
function ContactSection({ username, ownerName }) {
  const [form, setForm]        = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoad]     = useState(false)
  const [success, setSuccess]  = useState(false)
  const [error, setError]      = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoad(true); setError('')
    try {
      await api.post(`/public/${username}/contact`, form)
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur lors de l\'envoi.')
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className={styles.contactWrap}>
      <h2 className={styles.sectionTitle}>Me contacter</h2>
      <p className={styles.contactSub}>
        Envoyez un message à <strong>{ownerName}</strong> directement depuis ici.
      </p>

      {success ? (
        <div className={styles.successBox}>
          <span style={{ fontSize: 36 }}>✅</span>
          <p>Message envoyé ! <strong>{ownerName}</strong> vous répondra bientôt.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.contactRow}>
            <div className={styles.contactField}>
              <label>Votre nom</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jean Dupont" required />
            </div>
            <div className={styles.contactField}>
              <label>Votre email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jean@exemple.com" required />
            </div>
          </div>
          <div className={styles.contactField}>
            <label>Sujet</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Collaboration, opportunité..." required />
          </div>
          <div className={styles.contactField}>
            <label>Message</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Décrivez votre projet ou votre demande..." rows={5} required minLength={10} />
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button type="submit" className={styles.btnSend} disabled={loading}>
            {loading ? 'Envoi...' : '✉ Envoyer le message'}
          </button>
        </form>
      )}
    </div>
  )
}
