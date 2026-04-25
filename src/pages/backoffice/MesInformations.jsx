import React, { useEffect } from 'react'
import { Form, Input, Button, Upload, Avatar, notification, Switch, Tag, Spin } from 'antd'
import { UserOutlined, MailOutlined, CameraOutlined, LockOutlined, GlobalOutlined, LinkedinOutlined, GithubOutlined, TwitterOutlined, SaveOutlined, CheckCircleOutlined, AtDirectOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useApi, useMutation } from '../../hooks/useApi'
import { ProfileService } from '../../services/index'
import AuthService from '../../services/authService'
import s from './backoffice.module.css'
import ls from './MesInformations.module.css'

const { TextArea } = Input
const fadeUp = (d=0) => ({initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:0.45,delay:d,ease:[0.22,1,0.36,1]}})

export default function MesInformations() {
  const { user, updateUser }  = useAuth()
  const [form]                = Form.useForm()
  const [passForm]            = Form.useForm()
  const [notifApi, notifCtx]  = notification.useNotification()

  const { data: profile, loading, execute: fetchProfile } = useApi(ProfileService.get)
  useEffect(() => { fetchProfile() }, [])
  useEffect(() => { if (profile) form.setFieldsValue({ prenom:profile.prenom, nom:profile.nom, email:profile.email, role_title:profile.role_title, username: profile.username , bio:profile.bio, location:profile.location, is_available:profile.is_available, github_url:profile.github_url, linkedin_url:profile.linkedin_url, twitter_url:profile.twitter_url, website:profile.website }) }, [profile])

  const updateMutation = useMutation(ProfileService.update,   { successMessage:'✅ Profil mis à jour !', onSuccess:(d)=>updateUser(d) })
  const avatarMutation = useMutation(ProfileService.uploadAvatar, { successMessage:'✅ Photo mise à jour.', onSuccess:(d)=>updateUser({avatar:d.avatar_url}) })
  const passMutation   = useMutation(({current,newPwd})=>AuthService.changePassword(current,newPwd), { successMessage:'🔐 Mot de passe modifié !', onSuccess:()=>passForm.resetFields() })

  const handleSave = () => updateMutation.mutate(form.getFieldsValue())
  const handlePass = async () => {
    try {
      const v = await passForm.validateFields()
      if (v.new !== v.confirm) { notifApi.error({message:'Mots de passe différents.',placement:'bottomRight'}); return }
      await passMutation.mutate({current:v.current, newPwd:v.new})
    } catch {}
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}><Spin size="large"/></div>

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Mes informations</div>
            <h1 className={s.pageTitle}>Mes <em>informations</em></h1>
            <p className={s.pageSubtitle}>Gérez votre profil public et vos informations personnelles.</p>
          </div>
        </motion.div>

        <motion.div className={s.card} {...fadeUp(0.07)}>
          <div className={s.cardHeader}><div className={s.cardTitle}><span className={s.cardIcon}><UserOutlined /></span>Photo de profil</div></div>
          <div className={`${s.cardBody} ${ls.avatarSection}`}>
            <div className={ls.avatarWrap}>
              <Avatar src={profile?.avatar||user?.avatar} size={88} className={ls.avatar} icon={<UserOutlined/>}/>
              <Upload showUploadList={false} beforeUpload={(f)=>{avatarMutation.mutate(f);return false}} accept="image/*">
                <button className={ls.avatarEdit}>{avatarMutation.loading?'⏳':<CameraOutlined/>}</button>
              </Upload>
            </div>
            <div>
              <div className={ls.avatarName}>{profile?.name||user?.name}</div>
              <div className={ls.avatarRole}>{profile?.role_title}</div>
              <div className={ls.avatarHint}>JPG, PNG ou GIF · 5 Mo max · 400×400 px recommandé</div>
            </div>
          </div>
        </motion.div>

        <motion.div className={s.card} {...fadeUp(0.12)}>
          <div className={s.cardHeader}><div className={s.cardTitle}><span className={s.cardIcon}><UserOutlined /></span>Informations générales</div></div>
          <div className={s.cardBody}>
            <Form form={form} layout="vertical" requiredMark={false}>
              <div className={s.formGrid}>
                <Form.Item name="prenom"     label="Prénom"  rules={[{required:true}]}><Input prefix={<UserOutlined/>}/></Form.Item>
                <Form.Item name="nom"        label="Nom"     rules={[{required:true}]}><Input prefix={<UserOutlined/>}/></Form.Item>
                <Form.Item name="email"      label="Email"   rules={[{required:true,type:'email'}]}><Input prefix={<MailOutlined/>}/></Form.Item>
                <Form.Item name="role_title" label="Titre / Rôle"><Input/></Form.Item>
                <Form.Item name="username" label="Username"><Input prefix={<AtDirectOutlined/>}/></Form.Item>
                <Form.Item name="location"   label="Ville"><Input prefix={<GlobalOutlined/>}/></Form.Item>
                <Form.Item name="is_available" label="Disponible pour des projets" valuePropName="checked"><Switch checkedChildren="Oui" unCheckedChildren="Non"/></Form.Item>
                <Form.Item name="bio" label="Bio" className={s.formGridFull}><TextArea rows={3}/></Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}>
            <Button onClick={()=>form.resetFields()}>Annuler</Button>
            <Button type="primary" icon={<SaveOutlined/>} loading={updateMutation.loading} onClick={handleSave}>Sauvegarder</Button>
          </div>
        </motion.div>

        <motion.div className={s.card} {...fadeUp(0.16)}>
          <div className={s.cardHeader}><div className={s.cardTitle}><span className={s.cardIcon}><GlobalOutlined /></span>Liens & réseaux sociaux</div></div>
          <div className={s.cardBody}>
            <Form form={form} layout="vertical" requiredMark={false}>
              <div className={s.formGrid}>
                <Form.Item name="github_url"   label="GitHub"><Input prefix={<GithubOutlined/>}/></Form.Item>
                <Form.Item name="linkedin_url" label="LinkedIn"><Input prefix={<LinkedinOutlined/>}/></Form.Item>
                <Form.Item name="twitter_url"  label="Twitter / X"><Input prefix={<TwitterOutlined/>}/></Form.Item>
                <Form.Item name="website"      label="Site web"><Input prefix={<GlobalOutlined/>}/></Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined/>} loading={updateMutation.loading} onClick={handleSave}>Sauvegarder</Button></div>
        </motion.div>

        <motion.div className={s.card} {...fadeUp(0.2)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><LockOutlined /></span>Sécurité & mot de passe</div>
            {profile?.email_verified && <Tag color="green"><CheckCircleOutlined/> Compte sécurisé</Tag>}
          </div>
          <div className={s.cardBody}>
            <Form form={passForm} layout="vertical" requiredMark={false}>
              <div className={s.formGrid}>
                <Form.Item name="current" label="Mot de passe actuel" rules={[{required:true}]}><Input.Password prefix={<LockOutlined/>} placeholder="••••••••"/></Form.Item>
                <div/>
                <Form.Item name="new" label="Nouveau mot de passe" rules={[{required:true,min:8}]}><Input.Password prefix={<LockOutlined/>} placeholder="••••••••"/></Form.Item>
                <Form.Item name="confirm" label="Confirmer" rules={[{required:true}]}><Input.Password prefix={<LockOutlined/>} placeholder="••••••••"/></Form.Item>
              </div>
            </Form>
          </div>
          <div className={s.saveBar}><Button type="primary" danger icon={<LockOutlined/>} loading={passMutation.loading} onClick={handlePass}>Modifier le mot de passe</Button></div>
        </motion.div>
      </div>
    </div>
  )
}
