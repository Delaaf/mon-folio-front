import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal, Form, Input, Select, Popconfirm, Badge, Space, Tooltip, notification } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ProjectOutlined, LinkOutlined, GithubOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useApi, useMutation } from '../../hooks/useApi'
import { ProjectService } from '../../services/index'
import s from './backoffice.module.css'
import ls from './GestionProjets.module.css'

const { TextArea } = Input
const { Option }   = Select
const CATS = ['Web Apps', 'Backend', 'UI/UX', 'Mobile', 'DevOps']

const fadeUp = (d=0) => ({ initial:{opacity:0,y:18}, animate:{opacity:1,y:0}, transition:{duration:0.45,delay:d,ease:[0.22,1,0.36,1]} })

export default function GestionProjets() {
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form]                = Form.useForm()
  const [catModal, setCatModal] = useState(false)
  const [catForm] = Form.useForm()
  const [notifApi, notifCtx]  = notification.useNotification()

const { data: categories, loading, execute: fetchProjects } = useApi(
  ProjectService.list,
  { initialData: [] }
)
const projects = (categories || []).flatMap(c => c.projects || [])

  console.log("les projets ==>", projects)

  useEffect(() => { fetchProjects({ search }) }, [search])

  const createCategoryMutation = useMutation(ProjectService.createCategory, {
  successMessage: '✅ Catégorie créée !',
  onSuccess: () => {
    fetchProjects() // recharge les catégories
    setCatModal(false)
  }
})

  const createMutation = useMutation(ProjectService.create, { successMessage: '✅ Projet créé !', onSuccess: () => { fetchProjects(); setModal(false) } })
  const updateMutation = useMutation((p) => ProjectService.update(editing?.id, p), { successMessage: '✅ Mis à jour.', onSuccess: () => { fetchProjects(); setModal(false) } })
  const deleteMutation = useMutation(ProjectService.remove, { successMessage: '🗑 Supprimé.', onSuccess: fetchProjects })

  const openCreate = () => { setEditing(null); form.resetFields(); setModal(true) }
  const openEdit   = (p)  => { setEditing(p); form.setFieldsValue({ ...p, project_category_id: p.category?.id,
  tags: (p.tags ?? []).join(', ')}); setModal(true) }

  const handleSave = async () => {
    try {
      const vals = await form.validateFields()
      const payload = { ...vals, tags: (vals.tags||'').split(',').map(t=>t.trim()).filter(Boolean) }
      editing ? await updateMutation.mutate(payload) : await createMutation.mutate(payload)
    } catch {}
  }

  const handleCategoryCreate = async () => {
    try {
      const values = await catForm.validateFields()
  
      await createCategoryMutation.mutate(values)
  
      setCatModal(false)
      catForm.resetFields()
    } catch (err) {
      console.log(err.response?.data) // 🔥 debug utile
    }
  }
  

  const published  = projects?.filter(p=>p.status==='published')?.length
  const totalViews = projects?.reduce((a,p)=>a+(p.views_count??0),0)

  const columns = [
    { title:'Projet', key:'title', render:(_,r)=>
    <div className={ls.projCell}>
      <span className={ls.projEmoji}>{r.emoji}</span>
      <div>
        <div className={ls.projTitle}>{r.title}</div>
        <div className={ls.projCat}>{r.category?.label}</div>
      </div>
    </div> 
    },
    { title:'Technologies', key:'tags', render:(_,r)=>
    <Space wrap size={4}>{(r.tags??[]).slice(0,3).map(t=>
    <Tag key={t} className={ls.techTag}>{t}</Tag>)}
    {(r.tags??[]).length>3&&<Tag>+{r.tags.length-3}</Tag>}
    </Space> },
    { title:'Statut', key:'status', render:(_,r)=>
    <Badge status={r.status==='published'?'success':'default'} text={<span className={ls.statusText}>{r.status==='published'?'Publié':'Brouillon'}</span>} /> },
    { title:'Vues', dataIndex:'views_count', key:'views', render:v=><span className={ls.views}>{v??0}</span> },
    { title:'Actions', key:'actions', align:'right', render:(_,r)=><Space>
      <Tooltip title="Modifier"><Button type="text" size="small" icon={<EditOutlined />} className={ls.actionBtn} onClick={()=>openEdit(r)} /></Tooltip>
      <Popconfirm title="Supprimer ?" okText="Oui" cancelText="Non" okButtonProps={{danger:true}} onConfirm={()=>deleteMutation.mutate(r.id)}><Tooltip title="Supprimer"><Button type="text" size="small" icon={<DeleteOutlined />} className={ls.actionBtnDanger} /></Tooltip></Popconfirm>
    </Space> },
  ]

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Gérer mes projets</div>
            <h1 className={s.pageTitle}>Gestion des <em>projets</em></h1>
            <p className={s.pageSubtitle}>{projects?.length?? 0} projets · {published ?? 0} publiés</p>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchProjects} loading={loading} />
            <Button onClick={() => setCatModal(true)}>
              Nouvelle catégorie
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Nouveau projet</Button></Space>
        </motion.div>

        <motion.div className={ls.statsRow} {...fadeUp(0.07)}>
          {[{l:'Total',v:projects.length,c:'#4f8eff'},{l:'Publiés',v:published,c:'#4ade80'},{l:'Brouillons',v:projects.length-published,c:'#f59e0b'},{l:'Vues tot.',v:totalViews,c:'#8b5cf6'}].map(st=>(
            <div key={st.l} className={ls.statCard}><span className={ls.statVal} style={{color:st.c}}>{st.v}</span><span className={ls.statLbl}>{st.l}</span></div>
          ))}
        </motion.div>

        <motion.div className={s.card} {...fadeUp(0.12)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><ProjectOutlined /></span>Liste des projets</div>
            <Input prefix={<SearchOutlined style={{color:'var(--text-muted)'}} />} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:220}} />
          </div>
          <Table dataSource={projects} columns={columns} rowKey="id" loading={loading} pagination={{pageSize:8,size:'small'}} className={ls.table} size="middle" />
        </motion.div>
      </div>

      <Modal open={modal} onCancel={()=>setModal(false)} onOk={handleSave} confirmLoading={createMutation.loading||updateMutation.loading}
        title={<span style={{fontFamily:'var(--font-display)',fontWeight:700}}>{editing?'✏️ Modifier':'🚀 Nouveau projet'}</span>}
        okText={editing?'Enregistrer':'Créer'} cancelText="Annuler" width={580} centered>
        <Form form={form} layout="vertical" requiredMark={false} style={{marginTop:16}}>
          <div className={s.formGrid}>
            <Form.Item name="title" label="Titre" rules={[{required:true}]}><Input placeholder="Mon projet" /></Form.Item>
            <Form.Item name="emoji" label="Emoji" initialValue="🚀"><Input /></Form.Item>
            <Form.Item name="project_category_id" label="Catégorie" rules={[{required:true}]} className={s.formGridFull}>
                <Select>
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
            </Form.Item>
            <Form.Item name="tags" label="Technologies (virgule)" className={s.formGridFull}><Input placeholder="React, Node.js" /></Form.Item>
            <Form.Item
              name="short_description"
              label="Courte description"
              rules={[{ required: true, message: 'Veuillez ajouter une courte description' }]}
              className={s.formGridFull}
            >
            <TextArea rows={2} maxLength={150} showCount />
            </Form.Item>
            <Form.Item name="description" label="Description détaillée" rules={[{required:true}]} className={s.formGridFull}><TextArea rows={3} /></Form.Item>
            <Form.Item name="live_url"   label="URL Live"><Input prefix={<LinkOutlined />} /></Form.Item>
            <Form.Item name="github_url" label="GitHub"><Input prefix={<GithubOutlined />} /></Form.Item>
            <Form.Item name="status" label="Statut" initialValue="draft" className={s.formGridFull}>
              <Select><Option value="published">✅ Publié</Option><Option value="draft">📝 Brouillon</Option><Option value="archived">📦 Archivé</Option></Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal open={catModal} onCancel={() => setCatModal(false)} onOk={handleCategoryCreate} title="Nouvelle catégorie">
          <Form form={catForm} layout="vertical">
            <Form.Item
                name="label"
                label="Nom de la catégorie"
                rules={[{ required: true }]}
            >
                <Input placeholder="Ex: SaaS, Mobile..." />
            </Form.Item>
            <Form.Item
                name="icon"
                label="Icone de la catégorie"
                rules={[{ required: false }]}
            >
                <Input placeholder="⚙️..." />
            </Form.Item>
          </Form>
      </Modal>
    </div>
  )
}
