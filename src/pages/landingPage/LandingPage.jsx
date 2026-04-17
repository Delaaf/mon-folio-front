import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import styles from './LandingPage.module.css'
import {CodeOutlined} from '@ant-design/icons'

/* ─── DATA ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: '⚡',
    title: 'Déployé en 3 minutes',
    desc: 'Remplis ton profil, choisis un thème, publie. Ton portfolio est en ligne immédiatement.',
  },
  {
    icon: '🎨',
    title: 'Personnalisation totale',
    desc: "Couleurs, polices, sections, animations — tout s'adapte à ton identité.",
  },
  {
    icon: '📈',
    title: 'Analytics intégrés',
    desc: 'Suis les vues de ton portfolio et de chaque projet en temps réel.',
  },
  {
    icon: '🔒',
    title: 'Auth & sécurité',
    desc: 'JWT, OAuth Google/GitHub, vérification email. Ton compte est protégé.',
  },
  {
    icon: '🌐',
    title: 'URL personnalisée',
    desc: 'monfolio.net/public/username — une adresse propre à partager sur ton CV ou LinkedIn.',
  },
  {
    icon: '📬',
    title: 'Formulaire de contact',
    desc: 'Les recruteurs te contactent directement depuis ton portfolio. Tu reçois un email.',
  },
]

const STEPS = [
  { num: '01', title: "Crée ton compte", desc: "Inscription en 30 secondes avec ton email ou Google/GitHub." },
  { num: '02', title: "Remplis ton profil", desc: "Ajoute tes projets, compétences, bio et photo de profil." },
  { num: '03', title: "Publie et partage", desc: "Ton portfolio est en ligne. Partage l'URL et décroche des opportunités." },
  { num: '04',  title: "Personnalise le design", desc: "Choisis ton thème, tes couleurs et les sections à afficher."},
]

const TESTIMONIALS = [
  {
    name: 'Berei Yasmine',
    role: 'Designer professionnel',
    avatar: 'BY',
    color: '#4f8eff',
    text: "J'ai décroché mon poste chez Stripe 3 semaines après avoir publié mon portfolio MonFolio. Le design m'a démarqué de centaines de candidats.",
  },
  {
    name: 'Dagbo Phanuel',
    role: 'Freelance Frontend Dev',
    avatar: 'DP',
    color: '#8b5cf6',
    text: "Mes clients me trouvent maintenant directement via mon portfolio. Le formulaire de contact intégré m'apporte 2-3 leads par semaine.",
  },
  {
    name: 'Gnagne Milane',
    role: 'Full-Stack l',
    avatar: 'GM',
    color: '#10b981',
    text: "En 10 minutes j'avais un portfolio professionnel. J'aurais dû faire ça il y a des années au lieu de payer un dev pour me faire un site.",
  },
]

const PLANS = [
  {
    name: 'Gratuit',
    price: '0 fcfa',
    period: '/toujours',
    desc: 'Pour commencer et tester',
    features: ['1 portfolio', 'URL monfolio.net/nom', '6 projets max', 'Thèmes de base', 'Formulaire de contact'],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '--fcfa',
    period: '/mois',
    desc: 'Pour les développeurs sérieux',
    features: ['1 portfolio', 'Domaine personnalisé', 'Projets illimités', 'Tous les thèmes', 'Analytics avancés', 'Support prioritaire', 'Suppression du branding'],
    cta: 'Essai gratuit 14 jours',
    highlight: true,
    badge: 'Populaire',
  },
  {
    name: 'Équipe',
    price: '--fcfa',
    period: '/mois',
    desc: 'Pour les agences et équipes',
    features: ['5 portfolios', 'Domaines personnalisés', 'Projets illimités', 'White-label complet', 'Analytics équipe', 'Support dédié'],
    cta: 'Contacter les ventes',
    highlight: false,
  },
]

const STATS = [
  { value: '3+', label: 'Portfolios créés' },
  { value: '98%',     label: 'Taux de satisfaction' },
  { value: '3 min',   label: 'Temps de mise en ligne' },
  { value: '340+',    label: 'Emplois décrochés' },
]

/* ─── ANIMATION HELPERS ────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = (delay = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: delay } },
})

function InView({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial="hidden" animate={inView ? 'show' : 'hidden'}
      variants={fadeUp} transition={{ delay }}>
      {children}
    </motion.div>
  )
}

/* ─── ANIMATED COUNTER ─────────────────────────── */
function Counter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const num = parseInt(target.replace(/\D/g, ''))
  const suffix = target.replace(/[\d\s]/g, '')

  useEffect(() => {
    if (!inView || isNaN(num)) return
    let start = 0
    const step = num / 40
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 30)
    return () => clearInterval(timer)
  }, [inView, num])

  if (isNaN(num)) return <span ref={ref}>{target}</span>
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

/* ─── NAVBAR ────────────────────────────────────── */
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.navLogo}>
          <div className={styles.navLogoIcon}><CodeOutlined /></div>
          <span>MonFolio</span>
        </Link>

        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Fonctionnalités</a>
          <a href="#how" className={styles.navLink}>Comment ça marche</a>
          {/*<a href="#pricing" className={styles.navLink}>Tarifs</a>*/}
          <a href="#testimonials" className={styles.navLink}>Avis</a>
        </nav>

        <div className={styles.navActions}>
          <button className={styles.navBtnGhost} onClick={() => navigate('/connexion')}>
            Connexion
          </button>
          <button className={styles.navBtnPrimary} onClick={() => navigate('/inscription')}>
            Commencer
          </button>
        </div>
      </div>
    </motion.header>
  )
}

/* ─── HERO ──────────────────────────────────────── */
function Hero() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, 80])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className={styles.hero}>
      {/* Background particles */}
      <div className={styles.heroGrid} />
      <div className={styles.heroBlobLeft} />
      <div className={styles.heroBlobRight} />

      <motion.div className={styles.heroContent} style={{ y, opacity }}>

        {/* Badge */}
        <motion.div className={styles.heroBadge}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}>
          <span className={styles.heroBadgeDot} />
          <span>Nouveau · Thèmes animés disponibles</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 className={styles.heroTitle}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          Ton portfolio de{' '}
          <span className={styles.heroTitleGrad}>développeur</span>
          <br />en 3 minutes chrono.
        </motion.h1>

        {/* Subtitle */}
        <motion.p className={styles.heroSub}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}>
          MonFolio génère un portfolio professionnel, hébergé et personnalisable.
          Publie tes projets, montre tes compétences, décroche des opportunités.
        </motion.p>

        {/* CTA */}
        <motion.div className={styles.heroCTA}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.5 }}>
          <button className={styles.ctaPrimary} onClick={() => navigate('/inscription')}>
            Créer mon portfolio gratuit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.ctaSecondary} onClick={() => navigate('/public/delafossekouakou')}>
            Voir un exemple →
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div className={styles.heroProof}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
          <div className={styles.proofAvatars}>
            {['#4f8eff','#8b5cf6','#10b981','#f59e0b'].map((c, i) => (
              <div key={i} className={styles.proofAvatar} style={{ background: c, marginLeft: i ? '-10px' : 0 }} />
            ))}
          </div>
          <span className={styles.proofText}>
            Rejoins <strong>12 000+</strong> développeurs qui ont déjà publié leur portfolio
          </span>
        </motion.div>

        {/* Browser mockup */}
        <motion.div className={styles.heroMockup}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.mockupBar}>
            <div className={styles.mockupDots}>
              <span style={{ background: '#f87171' }} />
              <span style={{ background: '#f59e0b' }} />
              <span style={{ background: '#4ade80' }} />
            </div>
            <div className={styles.mockupUrl}>monfolio.net/public/noeldelafosse</div>
          </div>
          <div className={styles.mockupScreen}>
            <div className={styles.mockupNav}>
              <div className={styles.mockupNavLogo} />
              <div className={styles.mockupNavLinks}>
                {[60,48,56,52].map((w,i) => <div key={i} className={styles.mockupNavLink} style={{ width: w }} />)}
              </div>
            </div>
            <div className={styles.mockupHero}>
              <div className={styles.mockupHeroLeft}>
                <div className={styles.mockupBadge} />
                <div className={styles.mockupH1} />
                <div className={styles.mockupH1} style={{ width: '70%' }} />
                <div className={styles.mockupP} />
                <div className={styles.mockupP} style={{ width: '80%' }} />
                <div className={styles.mockupBtns}>
                  <div className={styles.mockupBtnPrimary} />
                  <div className={styles.mockupBtnGhost} />
                </div>
              </div>
              <div className={styles.mockupCard}>
                <div className={styles.mockupOrb} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ─── STATS ─────────────────────────────────────── */
function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsInner}>
        {STATS.map((s, i) => (
          <InView key={s.label} className={styles.statCard} delay={i * 0.08}>
            <div className={styles.statValue}><Counter target={s.value} /></div>
            <div className={styles.statLabel}>{s.label}</div>
          </InView>
        ))}
      </div>
    </section>
  )
}

/* ─── FEATURES ──────────────────────────────────── */
function Features() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.sectionInner}>
        <InView className={styles.sectionHead}>
          <div className={styles.sectionTag}>Fonctionnalités</div>
          <h2 className={styles.sectionTitle}>
            Tout ce dont tu as besoin,<br />
            <span className={styles.accent}>rien de superflu.</span>
          </h2>
          <p className={styles.sectionSub}>
            MonFolio est pensé pour les futurs professionnels. Chaque fonctionnalité a été choisie pour t'aider à trouver du travail.
          </p>
        </InView>

        <motion.div className={styles.featGrid}
          variants={stagger(0.07)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {FEATURES.map(f => (
            <motion.div key={f.title} className={styles.featCard} variants={fadeUp}>
              <div className={styles.featIcon}>{f.icon}</div>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── HOW IT WORKS ──────────────────────────────── */
function HowItWorks() {
  return (
    <section className={styles.section} id="how" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className={styles.sectionInner}>
        <InView className={styles.sectionHead}>
          <div className={styles.sectionTag}>Comment ça marche</div>
          <h2 className={styles.sectionTitle}>
            De zéro à en ligne<br />
            <span className={styles.accent}>en 4 étapes.</span>
          </h2>
        </InView>

        <div className={styles.stepsWrap}>
          {STEPS.map((s, i) => (
            <InView key={s.num} className={styles.stepCard} delay={i * 0.1}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepLine} />
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </InView>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── TESTIMONIALS ──────────────────────────────── */
function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.sectionInner}>
        <InView className={styles.sectionHead}>
          <div className={styles.sectionTag}>Témoignages</div>
          <h2 className={styles.sectionTitle}>
            Ils ont décroché leur <span className={styles.accent}>prochain poste.</span>
          </h2>
        </InView>

        <motion.div className={styles.testiGrid}
          variants={stagger(0.1)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {TESTIMONIALS.map(t => (
            <motion.div key={t.name} className={styles.testiCard} variants={fadeUp}>
              <div className={styles.testiStars}>{'★'.repeat(5)}</div>
              <p className={styles.testiText}>"{t.text}"</p>
              <div className={styles.testiAuthor}>
                <div className={styles.testiAvatar} style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div className={styles.testiName}>{t.name}</div>
                  <div className={styles.testiRole}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── PRICING ───────────────────────────────────── */
function Pricing() {
  const navigate = useNavigate()
  return (
    <section className={styles.section} id="pricing" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className={styles.sectionInner}>
        <InView className={styles.sectionHead}>
          <div className={styles.sectionTag}>Tarifs</div>
          <h2 className={styles.sectionTitle}>
            Commence gratuitement,<br />
            <span className={styles.accent}>évolue quand tu veux.</span>
          </h2>
        </InView>

        <motion.div className={styles.priceGrid}
          variants={stagger(0.08)} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {PLANS.map(p => (
            <motion.div key={p.name}
              className={`${styles.priceCard} ${p.highlight ? styles.priceCardHighlight : ''}`}
              variants={fadeUp}>
              {p.badge && <div className={styles.priceBadge}>{p.badge}</div>}
              <div className={styles.priceName}>{p.name}</div>
              <div className={styles.priceAmount}>
                {p.price}<span className={styles.pricePeriod}>{p.period}</span>
              </div>
              <div className={styles.priceDesc}>{p.desc}</div>
              <ul className={styles.priceFeatures}>
                {p.features.map(f => (
                  <li key={f} className={styles.priceFeat}>
                    <span className={styles.priceFeatCheck}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={p.highlight ? styles.priceBtnPrimary : styles.priceBtnGhost}
                onClick={() => navigate('/inscription')}>
                {p.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── CTA FINAL ─────────────────────────────────── */
function FinalCTA() {
  const navigate = useNavigate()
  return (
    <section className={styles.finalCTA}>
      <div className={styles.finalGlow} />
      <InView className={styles.finalContent}>
        <h2 className={styles.finalTitle}>
          Prêt à montrer ce que tu vaux ?
        </h2>
        <p className={styles.finalSub}>
          Rejoins 12 000+ développeurs qui ont déjà leur portfolio en ligne.
          Gratuit, sans carte bancaire.
        </p>
        <div className={styles.finalBtns}>
          <button className={styles.ctaPrimary} onClick={() => navigate('/inscription')}>
            Créer mon portfolio gratuitement →
          </button>
          <button className={styles.ctaSecondary} onClick={() => navigate('/public/delafossekouakou')}>
            Voir un exemple
          </button>
        </div>
      </InView>
    </section>
  )
}

/* ─── FOOTER ────────────────────────────────────── */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <div className={styles.navLogoIcon}><CodeOutlined /></div>
            <span>MonFolio</span>
          </div>
          <p className={styles.footerTagline}>
            Le portfolio des professionnel qui veulent être vus.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Produit</div>
            <a href="#features">Fonctionnalités</a>
            <a href="#pricing">Tarifs</a>
            <a href="#how">Comment ça marche</a>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Légal</div>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Cookies</a>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Support</div>
            <Link to="/aide-et-support">Centre d'aide</Link>
            <a href="mailto:hello@monfolio.dev">Contact</a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} MonFolio. Tous droits réservés.</span>
        <span>Fait avec ❤️ pour tout le monde</span>
      </div>
    </footer>
  )
}

/* ─── PAGE PRINCIPALE ───────────────────────────── */
export default function LandingPage() {
  return (
    <div className={styles.root}>
      <LandingNavbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}