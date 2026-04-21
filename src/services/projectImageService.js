/**
 * ProjectImageService — gestion des images de projets
 */
import api from './api'

export const ProjectImageService = {
  /** GET /api/projects/:id/images */
  async list(projectId) {
    const { data } = await api.get(`/projects/${projectId}/images`)
    return data.data
  },

  /**
   * POST /api/projects/:id/images
   * @param {number}   projectId
   * @param {File[]}   files — tableau de fichiers
   * @param {Function} onProgress — callback(percent)
   */
  async upload(projectId, files, onProgress) {
    const form = new FormData()
    files.forEach(f => form.append('images[]', f))

    const { data } = await api.post(`/projects/${projectId}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      },
    })
    return data.data
  },

  /** PATCH /api/projects/:id/images/:imageId/cover */
  async setCover(projectId, imageId) {
    await api.patch(`/projects/${projectId}/images/${imageId}/cover`)
  },

  /** PATCH /api/projects/:id/images/reorder */
  async reorder(projectId, images) {
    await api.patch(`/projects/${projectId}/images/reorder`, { images })
  },

  /** DELETE /api/projects/:id/images/:imageId */
  async remove(projectId, imageId) {
    await api.delete(`/projects/${projectId}/images/${imageId}`)
  },
}