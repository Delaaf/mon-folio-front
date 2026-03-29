import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Row, Col } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { CATEGORIES } from '../../data/projects'
import styles from './ProjectFormModal.module.css'

const { TextArea } = Input
const { Option } = Select

const GRADIENTS = [
  'linear-gradient(135deg, #0d0d20 0%, #1a1a3e 100%)',
  'linear-gradient(135deg, #0d1a18 0%, #0a2a28 100%)',
  'linear-gradient(135deg, #0d0a1e 0%, #1a1035 100%)',
  'linear-gradient(135deg, #001a12 0%, #001a22 100%)',
  'linear-gradient(135deg, #101020 0%, #1a1030 100%)',
  'linear-gradient(135deg, #1a0a10 0%, #0a102a 100%)',
]

/**
 * ProjectFormModal — modale de création / modification d'un projet
 * @param {Object|null} project  — null = nouveau projet, objet = édition
 * @param {boolean}     open
 * @param {Function}    onClose
 * @param {Function}    onSave   — callback(projectData)
 */
const ProjectFormModal = ({ project, open, onClose, onSave }) => {
  const [form] = Form.useForm()
  const isEdit = Boolean(project?.id)

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (open) {
      if (isEdit) {
        form.setFieldsValue({
          title:       project.title,
          description: project.description,
          category:    project.category,
          tags:        project.tags.join(', '),
          emoji:       project.emoji,
          liveUrl:     project.liveUrl || '',
          githubUrl:   project.githubUrl || '',
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, project, isEdit, form])

  const handleFinish = (values) => {
    const tagsArray = values.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const saved = {
      ...(isEdit ? project : {}),
      id:          isEdit ? project.id : Date.now(),
      title:       values.title,
      description: values.description,
      category:    values.category,
      tags:        tagsArray,
      emoji:       values.emoji || '🚀',
      liveUrl:     values.liveUrl || null,
      githubUrl:   values.githubUrl || null,
      gradient:    isEdit
        ? project.gradient
        : GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    }

    onSave(saved)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={540}
      title={
        <span className={styles.modalTitle}>
          {isEdit ? '✏️ Modifier le projet' : '🚀 Nouveau projet'}
        </span>
      }
      closeIcon={<CloseOutlined style={{ color: 'var(--text-secondary)' }} />}
      centered
    >
      <div className={styles.content}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Row gutter={12}>
            <Col span={18}>
              <Form.Item
                name="title"
                label="Titre du projet"
                rules={[{ required: true, message: 'Titre requis' }]}
              >
                <Input placeholder="Mon super projet" className={styles.input} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="emoji" label="Emoji">
                <Input placeholder="🚀" className={styles.input} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description requise' }]}
          >
            <TextArea
              placeholder="Décrivez votre projet..."
              rows={3}
              className={styles.input}
            />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Catégorie"
                rules={[{ required: true }]}
                initialValue="Web Apps"
              >
                <Select className={styles.select}>
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="Technologies (séparées par virgule)"
                rules={[{ required: true, message: 'Ajoutez au moins un tag' }]}
              >
                <Input placeholder="React, Node.js, AWS" className={styles.input} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="liveUrl" label="URL Live (optionnel)">
                <Input placeholder="https://monprojet.com" className={styles.input} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="githubUrl" label="URL GitHub (optionnel)">
                <Input placeholder="https://github.com/..." className={styles.input} />
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.footer}>
            <Button className={styles.btnCancel} onClick={onClose}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit" className={styles.btnSave}>
              {isEdit ? 'Enregistrer les modifications' : 'Créer le projet'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ProjectFormModal
