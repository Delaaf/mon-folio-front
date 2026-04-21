import React, { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { GithubOutlined, LinkOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import Tag from '../Tag'
import styles from './ProjectCard.module.css'

/**
 * ProjectCard — affichage conditionnel
 *
 * - Pas de photos → emoji + dégradé (comportement original inchangé)
 * - Avec photos   → carrousel des captures avec miniatures
 */
const ProjectCard = ({ project, index = 0, onView }) => {
  const [activeImg, setActiveImg] = useState(0)
  const hasPhotos = (project.images?.length ?? 0) > 0

  const truncateWords = (text, maxWords = 10) => {
    if (!text) return ''
    const words = text.split(' ')
    if (words.length <= maxWords) return text
    return words.slice(0, maxWords).join(' ') + '...'
  }

  const prevImg = (e) => {
    e.stopPropagation()
    setActiveImg(i => (i - 1 + project.images.length) % project.images.length)
  }

  const nextImg = (e) => {
    e.stopPropagation()
    setActiveImg(i => (i + 1) % project.images.length)
  }

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      {/* ── Thumbnail ── */}
      <div
        className={styles.thumbnail}
        onClick={() => onView?.(project)}
        role="button"
        tabIndex={0}
        aria-label={`Voir ${project.title}`}
        onKeyDown={(e) => e.key === 'Enter' && onView?.(project)}
      >
        {hasPhotos ? (
          /* ── Carrousel photos ── */
          <div className={styles.carousel}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={project.images[activeImg].url}
                alt={project.title}
                className={styles.carouselImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Flèches nav (visibles au hover) */}
            {project.images.length > 1 && (
              <>
                <button className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`} onClick={prevImg}>‹</button>
                <button className={`${styles.carouselBtn} ${styles.carouselBtnRight}`} onClick={nextImg}>›</button>

                {/* Dots */}
                <div className={styles.carouselDots}>
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.carouselDot} ${i === activeImg ? styles.carouselDotActive : ''}`}
                      onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                    />
                  ))}
                </div>

                {/* Miniatures */}
                <div className={styles.thumbStrip} onClick={e => e.stopPropagation()}>
                  {project.images.map((img, i) => (
                    <button
                      key={img.id ?? i}
                      className={`${styles.thumbItem} ${i === activeImg ? styles.thumbItemActive : ''}`}
                      onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                    >
                      <img src={img.url} alt="" draggable={false} />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Badge nombre de photos */}
            <div className={styles.photoBadge}>
              📷 {project.images.length}
            </div>

            {/* Hover overlay */}
            <div className={styles.overlay}>
              <span className={styles.overlayText}>Découvrir le projet →</span>
            </div>
          </div>
        ) : (
          /* ── Emoji fallback (comportement original) ── */
          <>
            <div
              className={styles.emojiThumb}
              style={{ background: project.gradient }}
            >
              <span className={styles.emoji}>{project.emoji}</span>
            </div>

            {/* Hover overlay original */}
            <div className={styles.overlay}>
              <span className={styles.overlayText}>Découvrir le projet →</span>
            </div>
          </>
        )}
      </div>

      {/* ── Body (identique à l'original) ── */}
      <div className={styles.body}>
        {/* Tags */}
        <div className={styles.tags}>
          {(project.tags ?? []).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        {/* Title */}
        <h3 className={styles.title}>{project.title}</h3>

        {/* Description */}
        <p className={styles.desc}>
          {truncateWords(project.short_description, 12)}
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            type="primary"
            className={styles.btnStudy}
            onClick={() => onView?.(project)}
            block
          >
            Découvrir
          </Button>

          <div className={styles.iconBtns}>
            {project.github_url && (
              <Tooltip title="GitHub">
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  href={project.github_url}
                  target="_blank"
                  className={styles.iconBtn}
                />
              </Tooltip>
            )}
            {project.live_url && (
              <Tooltip title="Live Demo">
                <Button
                  type="text"
                  icon={<LinkOutlined />}
                  href={project.live_url}
                  target="_blank"
                  className={styles.iconBtn}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
