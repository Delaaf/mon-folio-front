import React, { useState, useEffect} from 'react'
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
import {SkillService} from '../../services/index'
import { useApi, useMutation } from '../../hooks/useApi'

const { Option } = Select


const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

export default function GestionCompetences() {
  const [skills, setSkills]    = useState([])
  const [categories, setCategories] = useState([])
  const [catModal, setCatModal] = useState(false)
  const [catForm] = Form.useForm()
  const [search, setSearch]    = useState('')
  const [catFilter, setCat]    = useState('Tous')
  const [modal, setModal]      = useState(false)
  const [editing, setEditing]  = useState(null)
  const [form]                 = Form.useForm()
  const [notifApi, notifCtx]   = notification.useNotification()

  const { data, loading, execute: fetchSkills } = useApi(SkillService.list)

  useEffect(() => {
  fetchSkills()
    }, [])

  useEffect(() => {
  if (!data) return

  setCategories(data)

  const flatSkills = data.flatMap(cat =>
    cat.skills.map(skill => ({
      ...skill,
      category: cat.label,
      category_id: cat.id,
      catIcon: cat.icon
    }))
  )

  setSkills(flatSkills)

}, [data])
  
console.log("cateeeegories ==>", categories)

const cats = ['Tous', ...categories.map(c => c.label)]

  const filtered = skills.filter(sk => {
   const matchSearch = (sk.name || '').toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'Tous' || sk.category === catFilter
    return matchSearch && matchCat
  })

  const openCreate = () => { setEditing(null); form.resetFields(); setModal(true) }
  const openEdit   = (sk) => { setEditing(sk); form.setFieldsValue(sk); setModal(true) }

  const createMutation = useMutation(SkillService.create, {
  successMessage: 'Compétence créée !',
  onSuccess: () => {
    fetchSkills()
    setModal(false)
  }
 })

  const updateMutation = useMutation(  
    (payload) => SkillService.update(editing.id, payload),
      {
          successMessage: 'Compétence mise à jour !',
        onSuccess: () => {
        fetchSkills()
          setModal(false)
      }
    }
  )

  const deleteMutation = useMutation(SkillService.remove, {
    successMessage: 'Compétence supprimée',
    onSuccess: () => fetchSkills()
  })

const handleSkillCreate = async () => {
  try {
    const vals = await form.validateFields()

    const payload = {
      name: vals.name,
      level: vals.level,
      color: vals.color,
      skill_category_id: vals.category,
    }

    if (editing) {
      const updated = await SkillService.update(editing.id, payload)

      setSkills(prev =>
        prev.map(sk =>
          sk.id === updated.id
            ? {
                ...updated,
                category: categories.find(c => c.id === updated.skill_category_id)?.label,
                catIcon: categories.find(c => c.id === updated.skill_category_id)?.icon,
              }
            : sk
        )
      )

      notifApi.success({ message: 'Compétence mise à jour !', placement: 'bottomRight' })

    } else {
      const created = await SkillService.create(payload)

      const category = categories.find(c => c.id === created.skill_category_id)

      setSkills(prev => [
        {
          ...created,
          category: category?.label,
          catIcon: category?.icon,
        },
        ...prev,
      ])

      notifApi.success({ message: 'Compétence ajoutée !', placement: 'bottomRight' })
    }

    setModal(false)
    form.resetFields()

  } catch (err) {
    console.log(err.response?.data)
  }
}

  /*const handleSkillDelete = (id) => {
    setSkills(prev => prev.filter(sk => sk.id !== id))
    notifApi.success({ message: 'Compétence supprimée', placement: 'bottomRight' })
  }*/

  const handleCategoryCreate = async () => {
  try {
    const values = await catForm.validateFields()

    const res = await SkillService.createCategory({
      label: values.name,
      icon: values.icon
    })

   setCategories(prev => [...prev, res])

    notifApi.success({
      message: 'Catégorie ajoutée !',
      placement: 'bottomRight',
    })

    setCatModal(false)
    catForm.resetFields()
  } catch (err) {
    console.log(err.response?.data) // 🔥 debug utile
  }
}

  const avgLevel = skills.length? Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length): 0

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
          <Button icon={<PlusOutlined />} onClick={() => setCatModal(true)}> Nouvelle catégorie</Button>
        </motion.div>

        {/* Stats */}
        <motion.div className={ls.statsRow} {...fadeUp(0.07)}>
          {categories.map(c => (
          <Option key={c.id} value={c.label}>
            {c.icon} {c.label}
          </Option>
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
                    onConfirm={() => deleteMutation.mutate(sk.id)}>
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
              <Progress
                 percent={sk.level}
                 showInfo={false}
                 size="small"
                 strokeColor={sk.color || 'var(--accent)'}
                 railColor="rgba(255,255,255,0.07)" // ✅
              />
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Competence Modal */}
      <Modal open={modal} onCancel={() => setModal(false)} onOk={handleSkillCreate}
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
              {categories.filter(c => c).map(c => (
             <Option key={c.id} value={c.id}>{c.label}</Option>
              ))}
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

      {/*Category modal */}

            <Modal
        open={catModal}
        onCancel={() => setCatModal(false)}
        onOk={handleCategoryCreate}
        title="Nouvelle catégorie"
      >
        <Form form={catForm} layout="vertical">
          <Form.Item
            name="name"
            label="Nom de la catégorie"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ex: Mobile, IA..." />
          </Form.Item>
          <Form.Item
            name="icon"
            label="Icon de la catégorie"
            rules={[{ required: false }]}
          >
            <Input placeholder="⚙️..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
