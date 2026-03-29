import React from 'react'
import { Button, Tooltip } from 'antd'
import { GithubOutlined, LinkOutlined, EditOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import Tag from '../Tag'
import styles from './ProjectCard.module.css'

/**
 * ProjectCard — carte projet animée avec actions
 * @param {Object}   project   — données du projet
 * @param {number}   index     — index pour le stagger d'animation
 * @param {Function} onView    — ouvre la modale Case Study
 * @param {Function} onEdit    — ouvre la modale d'édition
 */
const ProjectCard = ({ project, index = 0, onView, onEdit }) => {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      {/* Thumbnail */}
      <div
        className={styles.thumbnail}
        style={{ background: project.gradient }}
        onClick={() => onView(project)}
        role="button"
        tabIndex={0}
        aria-label={`Voir ${project.title}`}
        onKeyDown={(e) => e.key === 'Enter' && onView(project)}
      >
        <span className={styles.emoji}>{project.emoji}</span>

        {/* Hover overlay */}
        <div className={styles.overlay}>
          <span className={styles.overlayText}>View Case Study →</span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Tags */}
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        {/* Title */}
        <h3 className={styles.title}>{project.title}</h3>

        {/* Description */}
        <p className={styles.desc}>{project.description}</p>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            type="primary"
            className={styles.btnStudy}
            onClick={() => onView(project)}
            block
          >
            View Case Study
          </Button>

          <div className={styles.iconBtns}>
            {project.githubUrl && (
              <Tooltip title="GitHub">
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  href={project.githubUrl}
                  target="_blank"
                  className={styles.iconBtn}
                />
              </Tooltip>
            )}
            {project.liveUrl && (
              <Tooltip title="Live Demo">
                <Button
                  type="text"
                  icon={<LinkOutlined />}
                  href={project.liveUrl}
                  target="_blank"
                  className={styles.iconBtn}
                />
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(project)}
                className={styles.iconBtn}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
