import React, { useState } from 'react'
import {
  Button, Table, Tag, Modal, Form, Input,
  Select, notification, Popconfirm, Badge, Space, Tooltip,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ProjectOutlined, EyeOutlined, LinkOutlined, GithubOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './GestionProjets.module.css'
import { PROJECTS } from '../../data/projects'

const { TextArea } = Input
const { Option }   = Select

const CATS = ['Web Apps', 'Backend', 'UI/UX', 'Mobile', 'DevOps']

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

export default function GestionProjets() {
  const [projects, setProjects] = useState(PROJECTS.map(p => ({ ...p, status: 'Publié', views: Math.floor(Math.random()*500+50) })))
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form]                  = Form.useForm()
  const [notifApi, notifCtx]    = notification.useNotification()

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditing(null); form.resetFields(); setModal(true) }
  const openEdit   = (p) => { setEditing(p);  form.setFieldsValue({ ...p, tags: p.tags.join(', ') }); setModal(true) }

  const handleSave = async () => {
    try {
      const vals = await form.validateFields()
      const tags = vals.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? []
      if (editing) {
        setProjects(prev => prev.map(p => p.id === editing.id ? { ...p, ...vals, tags } : p))
        notifApi.success({ message: 'Projet mis à jour !', placement: 'bottomRight' })
      } else {
        const newP = { id: Date.now(), ...vals, tags, emoji: '🚀', gradient: 'linear-gradient(135deg,#0d0d20,#1a1a3e)', status: 'Brouillon', views: 0 }
        setProjects(prev => [newP, ...prev])
        notifApi.success({ message: 'Projet créé !', placement: 'bottomRight' })
      }
      setModal(false)
    } catch {}
  }

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    notifApi.success({ message: 'Projet supprimé', placement: 'bottomRight' })
  }

  const columns = [
    {
      title: 'Projet',
      key: 'title',
      render: (_, r) => (
        <div className={ls.projCell}>
          <span className={ls.projEmoji}>{r.emoji}</span>
          <div>
            <div className={ls.projTitle}>{r.title}</div>
            <div className={ls.projCat}>{r.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Technologies',
      key: 'tags',
      render: (_, r) => (
        <Space wrap size={4}>
          {r.tags.slice(0, 3).map(t => <Tag key={t} className={ls.techTag}>{t}</Tag>)}
          {r.tags.length > 3 && <Tag>+{r.tags.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, r) => (
        <Badge
          status={r.status === 'Publié' ? 'success' : 'default'}
          text={<span className={ls.statusText}>{r.status}</span>}
        />
      ),
    },
    {
      title: 'Vues',
      dataIndex: 'views',
      key: 'views',
      render: v => <span className={ls.views}>{v}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, r) => (
        <Space>
          <Tooltip title="Voir"><Button type="text" size="small" icon={<EyeOutlined />} className={ls.actionBtn} /></Tooltip>
          <Tooltip title="Modifier"><Button type="text" size="small" icon={<EditOutlined />} className={ls.actionBtn} onClick={() => openEdit(r)} /></Tooltip>
          <Popconfirm title="Supprimer ce projet ?" okText="Oui" cancelText="Non" okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(r.id)}>
            <Tooltip title="Supprimer"><Button type="text" size="small" icon={<DeleteOutlined />} className={ls.actionBtnDanger} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Gérer mes projets</div>
            <h1 className={s.pageTitle}>Gestion des <em>projets</em></h1>
            <p className={s.pageSubtitle}>{projects.length} projets · {projects.filter(p=>p.status==='Publié').length} publiés</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Nouveau projet</Button>
        </motion.div>

        {/* Stats */}
        <motion.div className={ls.statsRow} {...fadeUp(0.07)}>
          {[
            { label: 'Total',    value: projects.length,                                color: '#4f8eff' },
            { label: 'Publiés',  value: projects.filter(p=>p.status==='Publié').length, color: '#4ade80' },
            { label: 'Brouillons',value: projects.filter(p=>p.status!=='Publié').length,color: '#f59e0b' },
            { label: 'Vues tot.',value: projects.reduce((a,p)=>a+(p.views||0),0),       color: '#8b5cf6' },
          ].map(st => (
            <div key={st.label} className={ls.statCard}>
              <span className={ls.statVal} style={{ color: st.color }}>{st.value}</span>
              <span className={ls.statLbl}>{st.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div className={s.card} {...fadeUp(0.12)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><ProjectOutlined /></span>Liste des projets</div>
            <Input
              prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="Rechercher..."
              className={ls.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 6, size: 'small' }}
            className={ls.table}
            size="middle"
          />
        </motion.div>

      </div>

      {/* Modal Create/Edit */}
      <Modal
        open={modal}
        onCancel={() => setModal(false)}
        onOk={handleSave}
        title={
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {editing ? '✏️ Modifier le projet' : '🚀 Nouveau projet'}
          </span>
        }
        okText={editing ? 'Enregistrer' : 'Créer'}
        cancelText="Annuler"
        width={580}
        centered
      >
        <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
          <div className={s.formGrid}>
            <Form.Item name="title" label="Titre" rules={[{ required: true }]}><Input placeholder="Mon projet" /></Form.Item>
            <Form.Item name="emoji" label="Emoji" initialValue="🚀"><Input /></Form.Item>
            <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}
              className={s.formGridFull}>
              <Select placeholder="Sélectionner">
                {CATS.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="tags" label="Technologies (séparées par virgule)" className={s.formGridFull}>
              <Input placeholder="React, Node.js, AWS" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]} className={s.formGridFull}>
              <TextArea rows={3} placeholder="Décrivez votre projet..." />
            </Form.Item>
            <Form.Item name="liveUrl" label="URL Live">
              <Input prefix={<LinkOutlined />} placeholder="https://..." />
            </Form.Item>
            <Form.Item name="githubUrl" label="GitHub">
              <Input prefix={<GithubOutlined />} placeholder="https://github.com/..." />
            </Form.Item>
            <Form.Item name="status" label="Statut" initialValue="Brouillon" className={s.formGridFull}>
              <Select>
                <Option value="Publié">✅ Publié</Option>
                <Option value="Brouillon">📝 Brouillon</Option>
                <Option value="Archivé">📦 Archivé</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
