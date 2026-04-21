import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Upload, Trash2, Star, ImagePlus, X, Check, Loader2 } from 'lucide-react'
import { notification } from 'antd'
import { ProjectImageService } from '../../services/projectImageService'
import styles from './ProjectImageManager.module.css'

/**
 * ProjectImageManager
 *
 * Props :
 *   projectId  {number}   — ID du projet
 *   images     {Array}    — images actuelles [{ id, url, is_cover, order }]
 *   onChange   {Function} — callback quand les images changent
 */
export default function ProjectImageManager({ projectId, images = [], onChange }) {
  const [uploading, setUploading]   = useState(false)
  const [progress, setProgress]     = useState(0)
  const [dragging, setDragging]     = useState(false)
  const [localImages, setLocalImages] = useState(images)
  const [notifApi, ctx]             = notification.useNotification()
  const inputRef                    = useRef(null)

  // Sync local state quand le parent change
  React.useEffect(() => { setLocalImages(images) }, [images])

  /* ── Upload ── */
  const handleFiles = useCallback(async (files) => {
    const valid = Array.from(files).filter(f => {
      if (!f.type.startsWith('image/')) {
        notifApi.error({ message: `${f.name} n'est pas une image valide.`, placement: 'bottomRight' })
        return false
      }
      if (f.size > 8 * 1024 * 1024) {
        notifApi.error({ message: `${f.name} dépasse 8 Mo.`, placement: 'bottomRight' })
        return false
      }
      return true
    })

    if (!valid.length) return
    if (localImages.length + valid.length > 10) {
      notifApi.warning({ message: 'Maximum 10 images par projet.', placement: 'bottomRight' })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const uploaded = await ProjectImageService.upload(projectId, valid, setProgress)
      const next = [...localImages, ...uploaded]
      setLocalImages(next)
      onChange?.(next)
      notifApi.success({
        message: `${uploaded.length} image(s) uploadée(s) !`,
        placement: 'bottomRight',
      })
    } catch {
      notifApi.error({ message: "Erreur lors de l'upload.", placement: 'bottomRight' })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [localImages, projectId, onChange, notifApi])

  /* ── Drag & Drop zone ── */
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  /* ── Set cover ── */
  const setCover = useCallback(async (imageId) => {
    try {
      await ProjectImageService.setCover(projectId, imageId)
      const next = localImages.map(img => ({ ...img, is_cover: img.id === imageId }))
      setLocalImages(next)
      onChange?.(next)
      notifApi.success({ message: 'Image de couverture mise à jour.', placement: 'bottomRight' })
    } catch {
      notifApi.error({ message: 'Erreur.', placement: 'bottomRight' })
    }
  }, [localImages, projectId, onChange, notifApi])

  /* ── Delete ── */
  const deleteImage = useCallback(async (imageId) => {
    try {
      await ProjectImageService.remove(projectId, imageId)
      const next = localImages.filter(img => img.id !== imageId)
      // Si on supprime la cover, remettre la première comme cover
      if (next.length && localImages.find(i => i.id === imageId)?.is_cover) {
        next[0].is_cover = true
      }
      setLocalImages(next)
      onChange?.(next)
    } catch {
      notifApi.error({ message: 'Erreur lors de la suppression.', placement: 'bottomRight' })
    }
  }, [localImages, projectId, onChange, notifApi])

  /* ── Reorder (drag) ── */
  const onReorder = useCallback(async (newOrder) => {
    setLocalImages(newOrder)
    try {
      await ProjectImageService.reorder(
        projectId,
        newOrder.map((img, i) => ({ id: img.id, order: i }))
      )
      onChange?.(newOrder)
    } catch {
      notifApi.error({ message: 'Erreur lors du réordonnement.', placement: 'bottomRight' })
    }
  }, [projectId, onChange, notifApi])

  const isEmpty = localImages.length === 0

  return (
    <div className={styles.root}>
      {ctx}

      <div className={styles.header}>
        <div className={styles.title}>
          <ImagePlus size={15} />
          Photothèque du projet
          <span className={styles.count}>{localImages.length}/10</span>
        </div>
        <div className={styles.hint}>
          La première image ⭐ sera la couverture. Glisse pour réordonner.
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`${styles.dropzone} ${dragging ? styles.dropzoneDragging : ''} ${uploading ? styles.dropzoneUploading : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInput}
          onChange={e => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className={styles.uploadingState}>
            <Loader2 size={22} className={styles.spinner} />
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className={styles.progressText}>{progress}% uploadé...</span>
          </div>
        ) : (
          <div className={styles.dropzoneContent}>
            <div className={styles.dropzoneIcon}>
              <Upload size={20} />
            </div>
            <div className={styles.dropzoneText}>
              <strong>Clique ou glisse des images ici</strong>
              <span>JPG, PNG, WebP · Max 8 Mo · Max 10 images</span>
            </div>
          </div>
        )}
      </div>

      {/* Image grid */}
      {!isEmpty && (
        <Reorder.Group
          axis="x"
          values={localImages}
          onReorder={onReorder}
          className={styles.grid}
          layoutScroll>
          <AnimatePresence>
            {localImages.map((img, i) => (
              <Reorder.Item
                key={img.id}
                value={img}
                className={styles.imgWrap}
                whileDrag={{ scale: 1.04, zIndex: 10, boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}>

                {/* Image */}
                <img src={img.url} alt={`Image ${i + 1}`} className={styles.img} draggable={false} />

                {/* Cover badge */}
                {img.is_cover && (
                  <div className={styles.coverBadge}>
                    <Star size={10} fill="currentColor" />
                    Cover
                  </div>
                )}

                {/* Overlay actions */}
                <div className={styles.imgOverlay}>
                  {!img.is_cover && (
                    <button
                      className={styles.actionBtn}
                      onClick={e => { e.stopPropagation(); setCover(img.id) }}
                      title="Définir comme couverture">
                      <Star size={13} />
                    </button>
                  )}
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    onClick={e => { e.stopPropagation(); deleteImage(img.id) }}
                    title="Supprimer">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Order number */}
                <div className={styles.order}>{i + 1}</div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {isEmpty && !uploading && (
        <div className={styles.emptyHint}>
          Aucune photo ajoutée — le projet affichera son emoji et son dégradé par défaut.
        </div>
      )}
    </div>
  )
}