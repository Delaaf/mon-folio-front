import React, { useState } from 'react'
import { Input, Collapse, Button, Form, notification, Tag } from 'antd'
import {
  SearchOutlined, QuestionCircleOutlined, BookOutlined,
  MessageOutlined, MailOutlined, YoutubeOutlined,
  RightOutlined, CheckCircleOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './AideSupport.module.css'

const { TextArea } = Input
const { Panel }    = Collapse

const FAQ = [
  { q: 'Comment personnaliser les couleurs de mon portfolio ?', a: 'Rendez-vous dans "Modifier mon portfolio" → "Thèmes prédéfinis" ou "Couleurs personnalisées". Vous pouvez choisir parmi 6 thèmes ou définir une couleur d\'accentuation sur mesure.' },
  { q: 'Comment ajouter un nouveau projet ?', a: 'Depuis "Gérer mes projets", cliquez sur "Nouveau projet". Remplissez le titre, la description, les technologies et l\'URL, puis cliquez sur "Créer".' },
  { q: 'Comment changer ma photo de profil ?', a: 'Dans "Mes informations", cliquez sur l\'icône appareil photo sur votre avatar. Sélectionnez une image (JPG, PNG, GIF — 5 Mo max).' },
  { q: 'Mon portfolio est-il référencé sur Google ?', a: 'Oui, votre portfolio public est indexé par les moteurs de recherche. Vous pouvez désactiver l\'indexation dans "Paramètres du compte → Confidentialité".' },
  { q: 'Comment activer la double authentification ?', a: 'Dans "Paramètres du compte → Sécurité", activez le switch "Double authentification (2FA)". Suivez ensuite les instructions pour configurer votre application d\'authentification.' },
  { q: 'Puis-je avoir plusieurs portfolios ?', a: 'La version actuelle supporte un portfolio par compte. La gestion multi-portfolios est prévue dans une future mise à jour.' },
]

const GUIDES = [
  { title: 'Démarrage rapide',      icon: '🚀', badge: 'Populaire', color: '#4f8eff' },
  { title: 'Personnaliser le thème', icon: '🎨', badge: 'Guide',    color: '#8b5cf6' },
  { title: 'Optimiser pour le SEO', icon: '📈', badge: 'Avancé',    color: '#10b981' },
  { title: 'Ajouter un domaine',     icon: '🌐', badge: 'Guide',    color: '#f59e0b' },
]

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

export default function AideSupport() {
  const [search, setSearch]    = useState('')
  const [form]                 = Form.useForm()
  const [notifApi, notifCtx]   = notification.useNotification()

  const filteredFaq = FAQ.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  const sendTicket = async () => {
    try {
      await form.validateFields()
      form.resetFields()
      notifApi.success({
        message: 'Ticket envoyé !',
        description: 'Notre équipe vous répondra dans les 24h.',
        placement: 'bottomRight', duration: 4,
      })
    } catch {}
  }

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={ls.heroSection} {...fadeUp(0)}>
          <h1 className={s.pageTitle} style={{ textAlign: 'center' }}>
            Centre d'<em>aide</em>
          </h1>
          <p className={ls.heroSub}>Comment pouvons-nous vous aider ?</p>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Rechercher dans l'aide..."
            size="large"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={ls.searchBar}
          />
        </motion.div>

        {/* ── Guides rapides ── */}
        <motion.div {...fadeUp(0.08)}>
          <div className={ls.sectionTitle}>📚 Guides</div>
          <div className={ls.guideGrid}>
            {GUIDES.map((g, i) => (
              <motion.div key={g.title} className={ls.guideCard}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}>
                <span className={ls.guideIcon}>{g.icon}</span>
                <div className={ls.guideTitle}>{g.title}</div>
                <div className={ls.guideMeta}>
                  <Tag style={{ borderRadius: 999, fontSize: 10, color: g.color, borderColor: g.color, background: `${g.color}15` }}>{g.badge}</Tag>
                  <RightOutlined style={{ fontSize: 10, color: 'var(--text-muted)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div className={s.card} {...fadeUp(0.12)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><QuestionCircleOutlined /></span>Questions fréquentes ({filteredFaq.length})</div>
          </div>
          <div className={s.cardBody} style={{ padding: '8px 0' }}>
            {filteredFaq.length === 0
              ? <p className={ls.noResult}>Aucun résultat pour « {search} »</p>
              : (
                <Collapse ghost expandIconPosition="end" className={ls.faq}>
                  {filteredFaq.map((f, i) => (
                    <Panel key={i} header={<span className={ls.faqQ}>{f.q}</span>}>
                      <p className={ls.faqA}>{f.a}</p>
                    </Panel>
                  ))}
                </Collapse>
              )
            }
          </div>
        </motion.div>

        {/* ── Contact support ── */}
        <motion.div className={s.card} {...fadeUp(0.16)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><MessageOutlined /></span>Contacter le support</div>
            <Tag color="green"><CheckCircleOutlined /> Répond en &lt; 24h</Tag>
          </div>
          <div className={s.cardBody}>
            <Form form={form} layout="vertical" requiredMark={false}>
              <div className={s.formGrid}>
                <Form.Item name="sujet" label="Sujet" rules={[{ required: true }]}>
                  <Input placeholder="Problème avec mon portfolio..." />
                </Form.Item>
                <Form.Item name="priority" label="Priorité" initialValue="Normale">
                  <Input placeholder="Normale / Urgente" />
                </Form.Item>
                <Form.Item name="message" label="Message" rules={[{ required: true }]} className={s.formGridFull}>
                  <TextArea rows={4} placeholder="Décrivez votre problème en détail..." />
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}>
            <Button type="primary" icon={<MailOutlined />} onClick={sendTicket}>Envoyer le ticket</Button>
          </div>
        </motion.div>

        {/* ── Autres ressources ── */}
        <motion.div className={ls.resourcesRow} {...fadeUp(0.2)}>
          {[
            { icon: <BookOutlined />,    label: 'Documentation', sub: 'Docs complètes',  color: '#4f8eff' },
            { icon: <YoutubeOutlined />, label: 'Tutoriels vidéo', sub: 'Sur YouTube',   color: '#f87171' },
            { icon: <MessageOutlined />, label: 'Communauté',     sub: 'Discord actif',  color: '#8b5cf6' },
          ].map(r => (
            <div key={r.label} className={ls.resourceCard}>
              <div className={ls.resIcon} style={{ color: r.color, background: `${r.color}15` }}>{r.icon}</div>
              <div className={ls.resLabel}>{r.label}</div>
              <div className={ls.resSub}>{r.sub}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
