import React, { useState , useEffect} from 'react'
import { motion } from 'framer-motion'
import { Form, Input, Button, notification } from 'antd'
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, MailOutlined, SendOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { ProfileService } from '../services/index'
import styles from './ContactPage.module.css'

const { TextArea } = Input

// Le username du portfolio — à adapter selon ton config
const PORTFOLIO_USERNAME = 'alexrivera'


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const ContactPage = () => {
  const [form]            = Form.useForm()
  const [loading, setLoad] = useState(false)
  const [notifApi, ctx]   = notification.useNotification()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await ProfileService.get()
      setProfile(res)
    } catch (err) {
      console.error(err)
    }
  }

  fetchProfile()
}, [])

const socials = [
  {
    icon: <GithubOutlined />,
    label: 'GitHub',
    url: profile?.github_url,
    handle: profile?.github_url?.replace('https://github.com/', '@')
  },
  {
    icon: <TwitterOutlined />,
    label: 'Twitter',
    url: profile?.twitter_url,
    handle: profile?.twitter_url?.split('/').pop()
  },
  {
    icon: <LinkedinOutlined />,
    label: 'LinkedIn',
    url: profile?.linkedin_url,
    handle: profile?.linkedin_url?.split('/').pop()
  },
  {
    icon: <MailOutlined />,
    label: 'Email',
    url: `mailto:${profile?.email}`,
    handle: profile?.email
  }
].filter(s => s.url)


  const handleSubmit = async (values) => {
    setLoad(true)
    try {
      await api.post(`/public/${profile.username}/contact`, values)
      form.resetFields()
      notifApi.success({
        message: 'Message envoyé ! 🎉',
        description: 'Je vous répondrai dans les 24 heures.',
        placement: 'bottomRight', duration: 4,
      })
    } catch (err) {
      notifApi.error({
        message: err.response?.data?.message ?? 'Erreur lors de l\'envoi.',
        placement: 'bottomRight',
      })
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className={styles.page}>
      {ctx}
      <div className={styles.bgGlow} />
      <div className={styles.inner}>

        <motion.div className={styles.header} {...fadeUp(0)}>
          <h1 className={styles.title}>Let's <span className={styles.accent}>Work Together</span></h1>
          <p className={styles.subtitle}>
            Have a project in mind? I'm currently available for freelance work
            and full-time opportunities. Let's build something great.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <motion.div className={styles.formCard} {...fadeUp(0.1)}>
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <div className={styles.formRow}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Requis' }]}>
                  <Input placeholder="Alex Rivera" className={styles.input} />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email valide requis' }]}>
                  <Input placeholder="hello@example.com" className={styles.input} />
                </Form.Item>
              </div>
              <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Requis' }]}>
                <Input placeholder="Project collaboration, job opportunity..." className={styles.input} />
              </Form.Item>
              <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Requis' }, { min: 10, message: '10 caractères minimum' }]}>
                <TextArea placeholder="Tell me about your project..." rows={5} className={styles.input} />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}
                icon={<SendOutlined />} className={styles.btnSubmit} block>
                Send Message
              </Button>
            </Form>
          </motion.div>

          <motion.div className={styles.infoCol} {...fadeUp(0.18)}>
            <div className={styles.availCard}>
              <div className={styles.availDot} />
              <div>
                <div className={styles.availTitle}>Available for work</div>
                <div className={styles.availSub}>Response time: within 24h</div>
              </div>
            </div>
            <div className={styles.locationCard}>
              <EnvironmentOutlined className={styles.locIcon} />
              <div>
                <div className={styles.locTitle}> {profile?.location || 'Location non définie'}</div>
                <div className={styles.locSub}>Open to remote worldwide</div>
              </div>
            </div>
            <div className={styles.socialSection}>
              <div className={styles.socialLabel}>Find me online</div>
              <div className={styles.socialList}>
                {socials.map(({ icon, label, url, handle }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
                    <span className={styles.socialIcon}>{icon}</span>
                    <div>
                      <div className={styles.socialName}>{label}</div>
                      <div className={styles.socialHandle}>{handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
