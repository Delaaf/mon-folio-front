import React, { useState, useEffect } from 'react'
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
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setActiveImg(0)
  }, [project])

  if (!project) return null

  const images = project.images || []

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<CloseOutlined style={{ color: 'var(--text-secondary)' }} />}
      centered
    >
              {images.length > 0 ? (
          <div className={styles.gallery}>
            <img
              src={images[activeImg].url}
              alt={project.title}
              className={styles.mainImage}
            />

            {images.length > 1 && (
              <>
                <button
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={() =>
                    setActiveImg(
                      (activeImg - 1 + images.length) % images.length
                    )
                  }
                >
                  ‹
                </button>
                
                <button
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={() =>
                    setActiveImg(
                      (activeImg + 1) % images.length
                    )
                  }
                >
                  ›
                </button>
                
                <div className={styles.thumbnails}>
                  {images.map((img, index) => (
                    <img
                      key={img.id || index}
                      src={img.url}
                      alt=""
                      className={`${styles.thumb} ${
                        index === activeImg ? styles.thumbActive : ''
                      }`}
                      onClick={() => setActiveImg(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            className={styles.thumbnail}
            style={{ background: project.gradient }}
          >
            <span className={styles.emoji}>{project.emoji}</span>
          </div>
        )}

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{project.title}</h2>
            <span className={styles.category}>{project.category?.label}</span>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} size="md" />
          ))}
        </div>

        {/* Description */}
        <p className={styles.desc}>{project.short_description}</p>

        <p className={styles.desc}>{project.description}</p>

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
          {project.live_url && (
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
          {project.github_url && (
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
