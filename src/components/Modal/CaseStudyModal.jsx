import React from 'react'
import { Modal, Button } from 'antd'
import { GithubOutlined, LinkOutlined, CloseOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import Tag from '../Tag'
import styles from './CaseStudyModal.module.css'

/**
 * CaseStudyModal — modale de détail d'un projet
 * @param {Object}   project  — projet à afficher
 * @param {boolean}  open     — état ouvert/fermé
 * @param {Function} onClose  — fermeture
 */
const CaseStudyModal = ({ project, open, onClose }) => {
  if (!project) return null

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<CloseOutlined style={{ color: 'var(--text-secondary)' }} />}
      centered
    >
      {/* Thumbnail */}
      <div
        className={styles.thumbnail}
        style={{ background: project.gradient }}
      >
        <span className={styles.emoji}>{project.emoji}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{project.title}</h2>
            <span className={styles.category}>{project.category}</span>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} size="md" />
          ))}
        </div>

        {/* Description */}
        <p className={styles.desc}>{project.description}</p>

        <p className={styles.desc}>
          Ce projet repose sur une architecture distribuée conçue pour la montée en charge.
          Pipeline CI/CD entièrement automatisé, tests unitaires et E2E à 90% de couverture,
          monitoring Datadog avec alertes personnalisées.
        </p>

        {/* Metrics */}
        <div className={styles.metrics}>
          {[
            { label: 'Uptime', value: '99.9%' },
            { label: 'Perf.', value: '< 80ms' },
            { label: 'Tests', value: '94%' },
          ].map(({ label, value }) => (
            <div key={label} className={styles.metric}>
              <span className={styles.metricValue}>{value}</span>
              <span className={styles.metricLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {project.liveUrl && (
            <Button
              type="primary"
              icon={<LinkOutlined />}
              href={project.liveUrl}
              target="_blank"
              className={styles.btnPrimary}
            >
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button
              icon={<GithubOutlined />}
              href={project.githubUrl}
              target="_blank"
              className={styles.btnSecondary}
            >
              GitHub
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default CaseStudyModal
