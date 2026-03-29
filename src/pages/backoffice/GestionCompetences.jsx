import React, { useState } from 'react'
import {
  Button, Modal, Form, Input, Select, Slider,
  notification, Popconfirm, Progress, Space, Tooltip,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  StarOutlined, SearchOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './GestionCompetences.module.css'
import { SKILL_CATEGORIES } from '../../data/skills'

const { Option } = Select

const ALL_SKILLS = SKILL_CATEGORIES.flatMap(cat =>
  cat.skills.map(sk => ({ ...sk, id: `${cat.id}-${sk.name}`, category: cat.label, catIcon: cat.icon }))
)

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

export default function GestionCompetences() {
  const [skills, setSkills]    = useState(ALL_SKILLS)
  const [search, setSearch]    = useState('')
  const [catFilter, setCat]    = useState('Tous')
  const [modal, setModal]      = useState(false)
  const [editing, setEditing]  = useState(null)
  const [form]                 = Form.useForm()
  const [notifApi, notifCtx]   = notification.useNotification()

  const cats = ['Tous', ...new Set(skills.map(s => s.category))]

  const filtered = skills.filter(sk => {
    const matchSearch = sk.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'Tous' || sk.category === catFilter
    return matchSearch && matchCat
  })

  const openCreate = () => { setEditing(null); form.resetFields(); setModal(true) }
  const openEdit   = (sk) => { setEditing(sk); form.setFieldsValue(sk); setModal(true) }

  const handleSave = async () => {
    try {
      const vals = await form.validateFields()
      if (editing) {
        setSkills(prev => prev.map(sk => sk.id === editing.id ? { ...sk, ...vals } : sk))
        notifApi.success({ message: 'Compétence mise à jour !', placement: 'bottomRight' })
      } else {
        setSkills(prev => [{ id: Date.now().toString(), catIcon: '🔧', ...vals }, ...prev])
        notifApi.success({ message: 'Compétence ajoutée !', placement: 'bottomRight' })
      }
      setModal(false)
    } catch {}
  }

  const handleDelete = (id) => {
    setSkills(prev => prev.filter(sk => sk.id !== id))
    notifApi.success({ message: 'Compétence supprimée', placement: 'bottomRight' })
  }

  const avgLevel = Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length)

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Gérer mes compétences</div>
            <h1 className={s.pageTitle}>Gestion des <em>compétences</em></h1>
            <p className={s.pageSubtitle}>{skills.length} compétences · Niveau moyen {avgLevel}%</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Nouvelle compétence</Button>
        </motion.div>

        {/* Stats */}
        <motion.div className={ls.statsRow} {...fadeUp(0.07)}>
          {SKILL_CATEGORIES.map(cat => (
            <div key={cat.id} className={ls.catCard} onClick={() => setCat(catFilter === cat.label ? 'Tous' : cat.label)}
              style={{ borderColor: catFilter === cat.label ? 'var(--accent)' : undefined }}>
              <span className={ls.catIcon}>{cat.icon}</span>
              <span className={ls.catLabel}>{cat.label}</span>
              <span className={ls.catCount}>{cat.skills.length} skills</span>
            </div>
          ))}
        </motion.div>

        {/* Search & filter */}
        <motion.div className={ls.toolbar} {...fadeUp(0.1)}>
          <Input prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            placeholder="Rechercher une compétence..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }} />
          <Select value={catFilter} onChange={setCat} style={{ width: 180 }}>
            {cats.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </motion.div>

        {/* Skills grid */}
        <motion.div className={ls.skillsGrid} {...fadeUp(0.13)}>
          {filtered.map((sk, i) => (
            <motion.div key={sk.id} className={ls.skillCard}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}>
              <div className={ls.skillTop}>
                <div className={ls.skillName}>{sk.name}</div>
                <Space>
                  <Tooltip title="Modifier">
                    <Button type="text" size="small" icon={<EditOutlined />} className={ls.actionBtn} onClick={() => openEdit(sk)} />
                  </Tooltip>
                  <Popconfirm title="Supprimer ?" okText="Oui" cancelText="Non" okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(sk.id)}>
                    <Tooltip title="Supprimer">
                      <Button type="text" size="small" icon={<DeleteOutlined />} className={ls.actionBtnD} />
                    </Tooltip>
                  </Popconfirm>
                </Space>
              </div>
              <div className={ls.skillMeta}>
                <span className={ls.skillCat}>{sk.catIcon} {sk.category}</span>
                <span className={ls.skillLevel}>{sk.level}%</span>
              </div>
              <Progress percent={sk.level} showInfo={false} size="small"
                strokeColor={sk.color || 'var(--accent)'}
                trailColor="rgba(255,255,255,0.07)" />
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Modal */}
      <Modal open={modal} onCancel={() => setModal(false)} onOk={handleSave}
        title={<span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          {editing ? '✏️ Modifier la compétence' : '⭐ Nouvelle compétence'}
        </span>}
        okText={editing ? 'Enregistrer' : 'Ajouter'}
        cancelText="Annuler" width={480} centered>
        <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Nom de la compétence" rules={[{ required: true }]}>
            <Input placeholder="Ex: React / Next.js" />
          </Form.Item>
          <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
            <Select placeholder="Sélectionner">
              {SKILL_CATEGORIES.map(c => <Option key={c.id} value={c.label}>{c.icon} {c.label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="level" label="Niveau de maîtrise" rules={[{ required: true }]}>
            <Slider min={5} max={100} step={5} tooltip={{ formatter: v => `${v}%` }} />
          </Form.Item>
          <Form.Item name="color" label="Couleur (hex)">
            <Input placeholder="#4f8eff" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
