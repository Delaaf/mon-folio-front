import React, { useState } from 'react'
import { Button, Form, Input, notification, Switch, Select } from 'antd'
import {
  PlusOutlined, DeleteOutlined, SaveOutlined,
  TrophyOutlined, ReadOutlined, TeamOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './GestionAutres.module.css'

const { TextArea } = Input
const { Option }   = Select

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

const INIT_CERTS = [
  { id: 1, name: 'AWS Solutions Architect',  org: 'Amazon Web Services', year: '2023', url: '' },
  { id: 2, name: 'React Advanced Patterns',  org: 'Frontend Masters',    year: '2022', url: '' },
]

const INIT_LANGS = [
  { id: 1, name: 'Français',  level: 'Natif'  },
  { id: 2, name: 'Anglais',   level: 'Courant' },
  { id: 3, name: 'Espagnol',  level: 'Notions' },
]

const LEVELS = ['Natif', 'Courant', 'Avancé', 'Intermédiaire', 'Notions']

export default function GestionAutres() {
  const [notifApi, notifCtx] = notification.useNotification()
  const [certs, setCerts]    = useState(INIT_CERTS)
  const [langs, setLangs]    = useState(INIT_LANGS)
  const [form]               = Form.useForm()
  const [intForm]            = Form.useForm()
  const [openToWork, setOtw] = useState(true)

  const save = () => notifApi.success({ message: 'Sauvegardé !', placement: 'bottomRight', duration: 2 })

  const addCert = () => setCerts(p => [...p, { id: Date.now(), name: '', org: '', year: '', url: '' }])
  const delCert = id => setCerts(p => p.filter(c => c.id !== id))
  const updCert = (id, key, val) => setCerts(p => p.map(c => c.id === id ? { ...c, [key]: val } : c))

  const addLang = () => setLangs(p => [...p, { id: Date.now(), name: '', level: 'Notions' }])
  const delLang = id => setLangs(p => p.filter(l => l.id !== id))
  const updLang = (id, key, val) => setLangs(p => p.map(l => l.id === id ? { ...l, [key]: val } : l))

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Gérer autres</div>
            <h1 className={s.pageTitle}>Gestion <em>autres</em></h1>
            <p className={s.pageSubtitle}>Certifications, langues, intérêts et autres sections de votre portfolio.</p>
          </div>
        </motion.div>

        {/* ── Disponibilité ── */}
        <motion.div className={s.card} {...fadeUp(0.07)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><TeamOutlined /></span>Statut de disponibilité</div>
          </div>
          <div className={`${s.cardBody} ${ls.availRow}`}>
            <div>
              <div className={ls.availTitle}>Ouvert aux opportunités</div>
              <div className={ls.availSub}>Votre badge "Disponible" sur la page d'accueil</div>
            </div>
            <Switch checked={openToWork} onChange={setOtw} checkedChildren="Disponible" unCheckedChildren="Indisponible" />
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Certifications ── */}
        <motion.div className={s.card} {...fadeUp(0.11)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><TrophyOutlined /></span>Certifications & diplômes</div>
            <Button size="small" icon={<PlusOutlined />} onClick={addCert}>Ajouter</Button>
          </div>
          <div className={s.cardBody}>
            <div className={ls.certList}>
              {certs.map((c, i) => (
                <motion.div key={c.id} className={ls.certRow}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <div className={ls.certIcon}><TrophyOutlined /></div>
                  <div className={ls.certFields}>
                    <Input placeholder="Nom de la certification" value={c.name} onChange={e => updCert(c.id,'name',e.target.value)} />
                    <div className={ls.certMeta}>
                      <Input placeholder="Organisme" value={c.org} onChange={e => updCert(c.id,'org',e.target.value)} />
                      <Input placeholder="Année" value={c.year} onChange={e => updCert(c.id,'year',e.target.value)} style={{ width: 100 }} />
                      <Input placeholder="URL (optionnel)" value={c.url} onChange={e => updCert(c.id,'url',e.target.value)} />
                    </div>
                  </div>
                  <Button type="text" icon={<DeleteOutlined />} danger onClick={() => delCert(c.id)} />
                </motion.div>
              ))}
              {certs.length === 0 && <p className={ls.empty}>Aucune certification. Cliquez sur "Ajouter".</p>}
            </div>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Langues ── */}
        <motion.div className={s.card} {...fadeUp(0.15)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><ReadOutlined /></span>Langues parlées</div>
            <Button size="small" icon={<PlusOutlined />} onClick={addLang}>Ajouter</Button>
          </div>
          <div className={s.cardBody}>
            <div className={ls.langList}>
              {langs.map((l, i) => (
                <div key={l.id} className={ls.langRow}>
                  <Input placeholder="Langue" value={l.name} onChange={e => updLang(l.id,'name',e.target.value)} style={{ flex: 1 }} />
                  <Select value={l.level} onChange={val => updLang(l.id,'level',val)} style={{ width: 160 }}>
                    {LEVELS.map(lv => <Option key={lv} value={lv}>{lv}</Option>)}
                  </Select>
                  <Button type="text" icon={<DeleteOutlined />} danger onClick={() => delLang(l.id)} />
                </div>
              ))}
            </div>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Intérêts / Hobbies ── */}
        <motion.div className={s.card} {...fadeUp(0.19)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}>🎯</span>Centres d'intérêt</div>
          </div>
          <div className={s.cardBody}>
            <Form form={intForm} layout="vertical" requiredMark={false}
              initialValues={{ interests: 'Open-source, Musique, Randonnée, Design, Lecture technique' }}>
              <Form.Item name="interests" label="Listez vos intérêts (séparés par une virgule)">
                <TextArea rows={2} placeholder="Open-source, Design, Photographie..." />
              </Form.Item>
            </Form>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

      </div>
    </div>
  )
}
