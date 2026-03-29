import React, { useState } from 'react'
import {
  Form, Input, Button, Upload, Avatar,
  notification, Divider, Switch, Tag,
} from 'antd'
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  CameraOutlined, LockOutlined, GlobalOutlined,
  LinkedinOutlined, GithubOutlined, TwitterOutlined,
  SaveOutlined, CheckCircleOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './MesInformations.module.css'

const { TextArea } = Input

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function MesInformations() {
  const [form]         = Form.useForm()
  const [passForm]     = Form.useForm()
  const [loading, setLoading]   = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [avatarSrc, setAvatarSrc]    = useState('https://i.pravatar.cc/150?img=3')
  const [notifApi, notifCtx]         = notification.useNotification()

  const save = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    notifApi.success({ message: 'Profil mis à jour !', placement: 'bottomRight', duration: 3 })
  }

  const savePass = async () => {
    try {
      await passForm.validateFields()
      setPassLoading(true)
      await new Promise(r => setTimeout(r, 900))
      setPassLoading(false)
      passForm.resetFields()
      notifApi.success({ message: 'Mot de passe modifié !', placement: 'bottomRight', duration: 3 })
    } catch {}
  }

  const beforeUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => setAvatarSrc(e.target.result)
    reader.readAsDataURL(file)
    return false
  }

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Mes informations</div>
            <h1 className={s.pageTitle}>Mes <em>informations</em></h1>
            <p className={s.pageSubtitle}>Gérez votre profil public et vos informations personnelles.</p>
          </div>
        </motion.div>

        {/* ── Photo de profil ── */}
        <motion.div className={s.card} {...fadeUp(0.07)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}>
              <span className={s.cardIcon}><UserOutlined /></span>
              Photo de profil
            </div>
          </div>
          <div className={`${s.cardBody} ${ls.avatarSection}`}>
            <div className={ls.avatarWrap}>
              <Avatar src={avatarSrc} size={88} className={ls.avatar} />
              <Upload showUploadList={false} beforeUpload={beforeUpload} accept="image/*">
                <button className={ls.avatarEdit} title="Changer la photo"><CameraOutlined /></button>
              </Upload>
            </div>
            <div className={ls.avatarInfo}>
              <p className={ls.avatarName}>Alex Rivera</p>
              <p className={ls.avatarRole}>Lead Full-Stack Developer</p>
              <p className={ls.avatarHint}>JPG, PNG ou GIF · 5 Mo max · Recommandé : 400×400 px</p>
            </div>
          </div>
        </motion.div>

        {/* ── Infos générales ── */}
        <motion.div className={s.card} {...fadeUp(0.12)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}>
              <span className={s.cardIcon}><UserOutlined /></span>
              Informations générales
            </div>
          </div>
          <div className={s.cardBody}>
            <Form form={form} layout="vertical" requiredMark={false} onFinish={save}
              initialValues={{ prenom: 'Alex', nom: 'Rivera', email: 'alex@alex.dev', phone: '+1 415 555 0172', role: 'Lead Full-Stack Developer', ville: 'San Francisco', pays: 'USA', bio: 'Full-stack developer specializing in building exceptional digital experiences.' }}>
              <div className={s.formGrid}>
                <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Prénom" />
                </Form.Item>
                <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Nom" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input prefix={<MailOutlined />} placeholder="email@exemple.com" />
                </Form.Item>
                <Form.Item name="phone" label="Téléphone">
                  <Input prefix={<PhoneOutlined />} placeholder="+33 6 00 00 00 00" />
                </Form.Item>
                <Form.Item name="role" label="Titre / Rôle">
                  <Input placeholder="Ex: Lead Full-Stack Developer" />
                </Form.Item>
                <Form.Item name="ville" label="Ville">
                  <Input prefix={<GlobalOutlined />} placeholder="Paris" />
                </Form.Item>
                <Form.Item name="pays" label="Pays">
                  <Input placeholder="France" />
                </Form.Item>
                <Form.Item name="disponible" label="Disponible pour des projets" valuePropName="checked">
                  <Switch checkedChildren="Oui" unCheckedChildren="Non" defaultChecked />
                </Form.Item>
                <Form.Item name="bio" label="Bio / À propos" className={s.formGridFull}>
                  <TextArea rows={3} placeholder="Décrivez-vous en quelques mots..." />
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}>
            <Button onClick={() => form.resetFields()}>Annuler</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={save}>
              Sauvegarder
            </Button>
          </div>
        </motion.div>

        {/* ── Réseaux sociaux ── */}
        <motion.div className={s.card} {...fadeUp(0.16)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}>
              <span className={s.cardIcon}><GlobalOutlined /></span>
              Liens & réseaux sociaux
            </div>
          </div>
          <div className={s.cardBody}>
            <Form layout="vertical" requiredMark={false}
              initialValues={{ github: 'https://github.com/alexrivera', linkedin: 'https://linkedin.com/in/alexrivera', twitter: 'https://twitter.com/alexrivera', website: 'https://alex.dev' }}>
              <div className={s.formGrid}>
                <Form.Item name="github" label="GitHub">
                  <Input prefix={<GithubOutlined />} placeholder="https://github.com/..." />
                </Form.Item>
                <Form.Item name="linkedin" label="LinkedIn">
                  <Input prefix={<LinkedinOutlined />} placeholder="https://linkedin.com/in/..." />
                </Form.Item>
                <Form.Item name="twitter" label="Twitter / X">
                  <Input prefix={<TwitterOutlined />} placeholder="https://twitter.com/..." />
                </Form.Item>
                <Form.Item name="website" label="Site web personnel">
                  <Input prefix={<GlobalOutlined />} placeholder="https://monsite.com" />
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={save}>Sauvegarder</Button>
          </div>
        </motion.div>

        {/* ── Mot de passe ── */}
        <motion.div className={s.card} {...fadeUp(0.2)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}>
              <span className={s.cardIcon}><LockOutlined /></span>
              Sécurité & mot de passe
            </div>
            <Tag color="green"><CheckCircleOutlined /> Compte sécurisé</Tag>
          </div>
          <div className={s.cardBody}>
            <Form form={passForm} layout="vertical" requiredMark={false}>
              <div className={s.formGrid}>
                <Form.Item name="current" label="Mot de passe actuel"
                  rules={[{ required: true, message: 'Requis' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>
                <div />
                <Form.Item name="new" label="Nouveau mot de passe"
                  rules={[{ required: true, min: 8, message: '8 caractères minimum' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>
                <Form.Item name="confirm" label="Confirmer le mot de passe"
                  dependencies={['new']}
                  rules={[{ required: true }, ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new') === value) return Promise.resolve()
                      return Promise.reject('Les mots de passe ne correspondent pas')
                    }
                  })]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}>
            <Button type="primary" danger icon={<LockOutlined />} loading={passLoading} onClick={savePass}>
              Modifier le mot de passe
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
