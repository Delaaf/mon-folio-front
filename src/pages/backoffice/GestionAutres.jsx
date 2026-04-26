import React, { useEffect, useState } from 'react'
import { Button, Form, Input, notification, Switch, Select, Spin } from 'antd'
import {
  PlusOutlined, DeleteOutlined, SaveOutlined,
  TrophyOutlined, ReadOutlined, TeamOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { OtherService, ProfileService } from '../../services'

import s from './backoffice.module.css'
import ls from './GestionAutres.module.css'
import { div } from 'framer-motion/client'

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

  //certiications
  const [certs, setCerts]    = useState([])
  const [certsLoading, setCertsL] = useState(true) 
  const [certsSaving, setCertsS] = useState(false)

  //Languages 
  const [langs, setLangs]    = useState([])
  const [langsLoading, setLangsL] = useState(true) 
  const [langsSaving, setLangsS] = useState(false)

  //Intérêts 
  const [interests, setInterests]    = useState('')
  const [intLoading, setIntL] = useState(true) 
  const [intSaving, setIntS] = useState(false)

  const [form]               = Form.useForm()
  const [intForm]            = Form.useForm()
  const [openToWork, setOtw] = useState(true)

  useEffect(()=>{loadAll()}, [])

  const loadAll = () => {loadCerts(); loadLangs(); loadInterests()}

  const loadCerts = async () => {
    setCertsL(true)
    try{
      const data = await OtherService.getCertifications()
      setCerts(data.map(c=>({...c, _key:c.id ?? Date.now() + Math.random()})))
    }catch{
      notifApi.error({message:'Erreur lors du chargement des certifications', placement:'bottomRight'})
    }finally{
      setCertsL(false)
    }
  }

  const loadLangs = async () => {
    setLangsL(true)
    try{
      const data = await OtherService.getLanguages()
      setLangs(data.map(l=>({...l, _key:l.id ?? Date.now() + Math.random()})))
    }catch{
      notifApi.error({message:'Erreur lors du chargement des langues', placement:'bottomRight'})
    }finally{
      setLangsL(false)
    }
  }

  const loadInterests = async () => {
    setIntL(true)
    try{
      const profile = await ProfileService.get()
      const raw = profile?.interests ?? []
      setInterests(raw.map(i=>typeof i === 'string' ? i : i.label).join(', '))
    }catch{
      notifApi.error({message:'Erreur lors du chargement des intérêts', placement:'bottomRight'})
    }finally{
      setIntL(false)
    }
  }

  //Certifs CRUD
  const addCert = () => setCerts(p => [...p, { _key: Date.now(), name: '', organization: '', year: '', url: '' }])
  const delCert = key => setCerts(p => p.filter(c => c._key !== key))
  const updCert = (key, field, val) => setCerts(p => p.map(c => c._key === key ? { ...c, [field]: val } : c))
  const saveCerts = async () => {
    if(certs.find(c => !c.name?.trim())){
      notifApi.warning({message: 'Chaque certification doit avoir un nom', placement:'bottomRight'}); return
    }
    setCertsS(true)
    try {
      await OtherService.syncCertifications(certs.map(c => ({name: c.name.trim(), organization: c.organization?.trim() ?? '', year: c.year?.trim() ?? '', url: c.url?.trim() ?? ''})))
      notifApi.success({message: 'Certification(s) sauvegardée(s) !', placement:'bottomRight'})
      loadCerts()
    }catch{
      notifApi.error({message:'Erreur lors de la sauvegarde', placement:'bottomRight'})
    }finally{
      setCertsS(false)
    }
  }

  //Langs CRUD 
  const addLang = () => setLangs(p => [...p, { _key: Date.now(), name: '', level: 'Notions' }])
  const delLang = key => setLangs(p => p.filter(l => l._key !== key))
  const updLang = (key, field, val) => setLangs(p => p.map(l => l._key === key ? { ...l, [field]: val } : l))
  const saveLangs = async () => {
    if(langs.find(l => !l.name?.trim())){
      notifApi.warning({message: 'Chaque langue doit avoir un nom', placement:'bottomRight'}); return
    }
    setLangsS(true)
    try {
      await OtherService.syncLanguages(langs.map(l => ({name: l.name.trim(), level: l.level})))
      notifApi.success({message: 'Langue(s) sauvegardée(s) !', placement:'bottomRight'})
      loadLangs()
    }catch{
      notifApi.error({message:'Erreur lors de la sauvegarde', placement:'bottomRight'})
    }finally{
      setLangsS(false)
    }
  }

  //Interests 
  const saveInterests = async () => {
    const list = interests.split(',').map(i => i.trim()).filter(Boolean)
    if(!list.length) {
      notifApi.warning({message: 'Ajoutez au moins un interêt', placement:'bottomRight'}); return
    }
    setIntS(true)
    try{
      await OtherService.syncInterests(list)
      notifApi.success({message: 'Intérêt(s) sauvegardé(s) !', placement:'bottomRight'})
    }catch{
      notifApi.error({message:'Erreur lors de la sauvegarde', placement:'bottomRight'})
    }finally{
      setIntS(false)
    }
  }

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
          <Button icon={ReloadOutlined} onClick={loadAll}>Actualiser</Button>
        </motion.div>

        {/* ── Certifications ── */}
        <motion.div className={s.card} {...fadeUp(0.11)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><TrophyOutlined /></span>Certifications & diplômes 
            
            {!certsLoading && <span className={ls.badge}>{certs.length}</span> }
            </div>
            <Button size="small" icon={<PlusOutlined />} onClick={addCert}>Ajouter</Button>
          </div>
          <div className={s.cardBody}>
            {certsLoading ? (
              <div className={ls.center}><Spin /></div>
            ): certs.length ===0 ? (
              <div className= {ls.empty}>
                <TrophyOutlined style={{fontSize: 32, opacity:0.2}} />
                <p>Aucune certification. Cliquez sur "Ajouter".</p>
              </div>
            ): (
              <div className={ls.certList}>
              {certs.map((c, i) => (
                <motion.div key={c._key} className={ls.certRow}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <div className={ls.certIcon}><TrophyOutlined /></div>
                  <div className={ls.certFields}>
                    <Input placeholder="Nom de la certification" value={c.name} onChange={e => updCert(c._key,'name',e.target.value)} />
                    <div className={ls.certMeta}>
                      <Input placeholder="Organisme" value={c.org} onChange={e => updCert(c._key,'organization',e.target.value)} style={{flex:1}} />
                      <Input placeholder="Année" value={c.year} onChange={e => updCert(c._key,'year',e.target.value)} style={{ width: 88 }} maxLength={4} />
                      <Input placeholder="URL (optionnel)" value={c.url} onChange={e => updCert(c._key,'url',e.target.value)}style={{flex:1}} />
                    </div>
                  </div>
                  <Button type="text" icon={<DeleteOutlined />} danger onClick={() => delCert(c._key)} className={ls.deleteBtn}/>
                </motion.div>
              ))}
            </div>
            )}
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} loading={certsSaving} onClick={saveCerts}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Langues ── */}
        <motion.div className={s.card} {...fadeUp(0.15)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><ReadOutlined /></span>Langues parlées 
            {!langsLoading && <span className={ls.badge}>{langs.length}</span> }
            </div>
            <Button size="small" icon={<PlusOutlined />} onClick={addLang}>Ajouter</Button>
          </div>
          <div className={s.cardBody}>
            {langsLoading ? (
              <div className={ls.center}><Spin /></div>
            ): langs.length ===0 ? (
              <div className= {ls.empty}>
                <ReadOutlined style={{fontSize: 32, opacity:0.2}} />
                <p>Aucune langue ajoutée. Cliquez sur "Ajouter".</p>
              </div>
            ): (
              <div className={ls.langList}>
              {langs.map((l, i) => (
                <motion.div key={l._key} className={ls.langRow} initial= {{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: i * 0.04}}>
                  <Input placeholder="Langue" value={l.name} onChange={e => updLang(l._key,'name',e.target.value)} style={{ flex: 1 }} />
                  <Select value={l.level} onChange={val => updLang(l._key,'level',val)} style={{ width: 160 }}>
                    {LEVELS.map(lv => <Option key={lv} value={lv}>{lv}</Option>)}
                  </Select>
                  <Button type="text" icon={<DeleteOutlined />} danger onClick={() => delLang(l._key)} className={ls.deleteBtn} />
                </motion.div>
              ))}
            </div>
            )
            }
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} loading={langsSaving} onClick={saveLangs}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Intérêts / Hobbies ── */}
        <motion.div className={s.card} {...fadeUp(0.19)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}>🎯</span>Centres d'intérêt</div>
          </div>
          <div className={s.cardBody}>
            {intLoading ? (
              <div className={ls.center}><Spin /></div>
            ): (
              <div className={ls.interestsWrap}>
                <p className={ls.interestsHint}>
                  Séparez chaque intérêt par une virgule. Ils apparaîtront sous forme de tags sur votre portfolio
                </p>
                <Textarea rows={3} placeholder="Open-source, Musique, Randonnée, Design, Photographie..." value={interests} onChange={e => setInterests(e.target.value)} />
                  {interests.trim() && (
                    <div className={ls.tagsPreview}>
                      {interests.split(',').map(i => i.trim()).filter(Boolean).map((tag, i) => (
                        <span key={i} className={ls.tag}>{tag}</span>
                      )
                      )}
                    </div>
                  )}
              </div>
            )
            }  
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} loading={intSaving} onClick={saveInterests}>Sauvegarder</Button></div>
        </motion.div>

      </div>
    </div>
  )
}
