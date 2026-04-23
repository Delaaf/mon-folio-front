import React, { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { GithubOutlined, LinkOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import Tag from '../Tag'
import styles from './ProjectCard.module.css'

const ProjectCard = ({ project, index = 0, onView }) => {
  const [activeImg, setActiveImg] = useState(0)
  const hasPhotos = (project.images?.length ?? 0) > 0
  const images = project.images ?? []

  const truncateWords = (text, maxWords = 12) => {
    if (!text) return ''
    const words = text.split(' ')
    return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '...'
  }

  const prev = (e) => {
    e.stopPropagation()
    setActiveImg(i => (i - 1 + images.length) % images.length)
  }
  const next = (e) => {
    e.stopPropagation()
    setActiveImg(i => (i + 1) % images.length)
  }

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      {/* ── Thumbnail ── */}
      <div
        className={styles.thumbnail}
        role="button"
        tabIndex={0}
        aria-label={`Voir ${project.title}`}
        onKeyDown={(e) => e.key === 'Enter' && onView?.(project)}
      >
        {hasPhotos ? (
          <div className={styles.carousel} onClick={(e) => e.stopPropagation()}>
            {/* Image active */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={images[activeImg].url}
                alt={project.title}
                className={styles.carouselImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Flèches — seulement si plusieurs images */}
            {images.length > 1 && (
              <>
                <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={prev}>‹</button>
                <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={next}>›</button>

                {/* Dots */}
                <div className={styles.dots}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.dot} ${i === activeImg ? styles.dotActive : ''}`}
                      onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                    />
                  ))}
                </div>

                {/* Miniatures */}
                <div className={styles.strip} onClick={e => e.stopPropagation()}>
                  {images.map((img, i) => (
                    <button
                      key={img.id ?? i}
                      className={`${styles.stripItem} ${i === activeImg ? styles.stripItemActive : ''}`}
                      onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                    >
                      <img src={img.url} alt="" draggable={false} />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Badge nombre de photos */}
            <div className={styles.photoBadge}>📷 {images.length}</div>

            {/* Hover overlay */}
            {/*<div className={styles.overlay}  onClick={() => onView?.(project)}>
              <span className={styles.overlayText}>Découvrir →</span>
            </div>*/}
          </div>
        ) : (
          /* ── Emoji fallback ── */
          <div className={styles.emojiWrap} style={{ background: project.gradient }}>
            <span className={styles.emoji}>{project.emoji}</span>
            <div className={styles.overlay}>
              <span className={styles.overlayText}>Découvrir →</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <div className={styles.tags}>
          {(project.tags ?? []).map(tag => <Tag key={tag} label={tag} />)}
        </div>

        <h3 className={styles.title}>{project.title}</h3>

        <p className={styles.desc}>{truncateWords(project.short_description, 12)}</p>

        <div className={styles.actions}>
          <Button type="primary" className={styles.btnStudy} onClick={() => onView?.(project)} block>
            Découvrir
          </Button>
          <div className={styles.iconBtns}>
            {project.github_url && (
              <Tooltip title="GitHub">
                <Button type="text" icon={<GithubOutlined />} href={project.github_url} target="_blank" className={styles.iconBtn} />
              </Tooltip>
            )}
            {project.live_url && (
              <Tooltip title="Live Demo">
                <Button type="text" icon={<LinkOutlined />} href={project.live_url} target="_blank" className={styles.iconBtn} />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
