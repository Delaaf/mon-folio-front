import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Form, Input, Button, notification } from 'antd'
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  SendOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import styles from './ContactPage.module.css'

const { TextArea } = Input

const SOCIAL = [
  { icon: <GithubOutlined />,   label: 'GitHub',   url: 'https://github.com',    handle: '@alexrivera' },
  { icon: <WhatsAppOutlined />,  label: 'Whatsapp',  url: 'https://twitter.com',   handle: '@alexrivera' },
  { icon: <LinkedinOutlined />, label: 'LinkedIn', url: 'https://linkedin.com',  handle: 'in/alexrivera' },
  { icon: <MailOutlined />,     label: 'Email',    url: 'mailto:hello@alex.dev', handle: 'hello@alex.dev' },
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const ContactPage = () => {
  const [form]    = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [notifApi, notifCtx]  = notification.useNotification()

  const handleSubmit = async (values) => {
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    form.resetFields()
    notifApi.success({
      message: 'Message envoyé ! 🎉',
      description: 'Je vous répondrai dans les 24 heures.',
      placement: 'bottomRight',
      duration: 4,
    })
  }

  return (
    <div className={styles.page}>
      {notifCtx}
      <div className={styles.bgGlow} />

      <div className={styles.inner}>
        {/* Header */}
        <motion.div className={styles.header} {...fadeUp(0)}>
          <h1 className={styles.title}>
            Let's <span className={styles.accent}>Work Together</span>
          </h1>
          <p className={styles.subtitle}>
            Have a project in mind? I'm currently available for freelance work
            and full-time opportunities. Let's build something great.
          </p>
        </motion.div>

        <div className={styles.layout}>
          {/* LEFT — form */}
          <motion.div className={styles.formCard} {...fadeUp(0.1)}>
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <div className={styles.formRow}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input placeholder="Alex Rivera" className={styles.input} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
                >
                  <Input placeholder="hello@example.com" className={styles.input} />
                </Form.Item>
              </div>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Project collaboration, job opportunity..." className={styles.input} />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Required' }]}
              >
                <TextArea
                  placeholder="Tell me about your project..."
                  rows={5}
                  className={styles.input}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                className={styles.btnSubmit}
                block
              >
                Send Message
              </Button>
            </Form>
          </motion.div>

          {/* RIGHT — info */}
          <motion.div className={styles.infoCol} {...fadeUp(0.18)}>
            {/* Availability card */}
            <div className={styles.availCard}>
              <div className={styles.availDot} />
              <div>
                <div className={styles.availTitle}>Available for work</div>
                <div className={styles.availSub}>Response time: within 24h</div>
              </div>
            </div>

            {/* Location */}
            <div className={styles.locationCard}>
              <EnvironmentOutlined className={styles.locIcon} />
              <div>
                <div className={styles.locTitle}>San Francisco, CA</div>
                <div className={styles.locSub}>Open to remote worldwide</div>
              </div>
            </div>

            {/* Social links */}
            <div className={styles.socialSection}>
              <div className={styles.socialLabel}>Find me online</div>
              <div className={styles.socialList}>
                {SOCIAL.map(({ icon, label, url, handle }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialItem}
                  >
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
