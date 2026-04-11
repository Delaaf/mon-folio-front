/**
 * projectService.js — CRUD projets
 */
import api from './api'

export const ProjectService = {
  /** GET /api/projects — liste paginée (backoffice) */
  async list(params = {}) {
    const { data } = await api.get('/projects', { params })
    return data.data
  },

  /** POST /api/projects */
  async create(payload) {
    const form = buildFormData(payload)
    const { data } = await api.post('/projects', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  /** PUT /api/projects/:id */
  async update(id, payload) {
    const form = buildFormData(payload)
    form.append('_method', 'PUT') // Laravel method spoofing for multipart
    const { data } = await api.post(`/projects/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  /** DELETE /api/projects/:id */
  async remove(id) {
    await api.delete(`/projects/${id}`)
  },

  /** PATCH /api/projects/reorder */
  async reorder(ids) {
    await api.patch('/projects/reorder', { ids })
  },

  /** GET /api/public/:username/projects */
  async publicList(username, params = {}) {
    const { data } = await api.get(`/public/${username}/projects`, { params })
    return data
  },
}

/**
 * profileService.js — Profil utilisateur
 */
export const ProfileService = {
  /** GET /api/profile */
  async get() {
    const { data } = await api.get('/profile')
    return data.data
  },

  /** PUT /api/profile */
  async update(payload) {
    const { data } = await api.put('/profile', payload)
    return data.data
  },

  /** GET /api/profile/stats */
  async stats() {
    const { data } = await api.get('/profile/stats')
    return data.data
  },
  
  /** POST /api/profile/avatar */
  async uploadAvatar(file) {
    const form = new FormData()
    form.append('avatar', file)
    const { data } = await api.post('/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /** DELETE /api/profile/avatar */
  async deleteAvatar() {
    await api.delete('/profile/avatar')
  },

  async publicProfile(username, params = {}) {
    const { data } = await api.get(`/public/${username}/`)
    return data
  }
}

/**
 * skillService.js — Compétences
 */
export const SkillService = {
  /** GET /api/skills */
  async list() {
    const { data } = await api.get('/skills')
    return data.data
  },

  /** POST /api/skills */
  async create(payload) {
    const { data } = await api.post('/skills', payload)
    return data.data
  },

  /** PUT /api/skills/:id */
  async update(id, payload) {
    const { data } = await api.put(`/skills/${id}`, payload)
    return data.data
  },

  /** DELETE /api/skills/:id */
  async remove(id) {
    await api.delete(`/skills/${id}`)
  },

  /** POST /api/skills/categories */
  async createCategory(payload) {
    const { data } = await api.post('/skills/categories', payload)
    return data.data
  },

  /** DELETE /api/skills/categories/:id */
  async removeCategory(id) {
    await api.delete(`/skills/categories/${id}`)
  },

  /** PATCH /api/skills/reorder */
  async reorder(skills) {
    await api.patch('/skills/reorder', { skills })
  },
}

/**
 * portfolioService.js — Paramètres du portfolio
 */
export const PortfolioService = {
  /** GET /api/portfolio/settings */
  async getSettings() {
    const { data } = await api.get('/portfolio/settings')
    return data.data
  },

  /** PUT /api/portfolio/settings */
  async updateSettings(payload) {
    const { data } = await api.put('/portfolio/settings', payload)
    return data.data
  },
}

/**
 * otherService.js — Certifications, langues, intérêts
 */
export const OtherService = {
  async getCertifications() {
    const { data } = await api.get('/other/certifications')
    return data.data
  },

  async syncCertifications(certifications) {
    const { data } = await api.post('/other/certifications/sync', { certifications })
    return data.data
  },

  async getLanguages() {
    const { data } = await api.get('/other/languages')
    return data.data
  },

  async syncLanguages(languages) {
    const { data } = await api.post('/other/languages/sync', { languages })
    return data.data
  },

  async syncInterests(interests) {
    const { data } = await api.post('/other/interests/sync', { interests })
    return data.data
  },
}

/**
 * accountService.js — Paramètres du compte
 */
export const AccountService = {
  async getSettings() {
    const { data } = await api.get('/account/settings')
    return data.data
  },

  async updateNotifications(payload) {
    const { data } = await api.put('/account/notifications', payload)
    return data
  },

  async updatePrivacy(payload) {
    const { data } = await api.put('/account/privacy', payload)
    return data
  },

  async updateLocale(payload) {
    const { data } = await api.put('/account/locale', payload)
    return data
  },

  async exportData() {
    const { data } = await api.post('/account/export')
    return data.data
  },

  async deleteAccount(password) {
    await api.delete('/account', {
      data: { password, confirmation: 'SUPPRIMER' },
    })
  },
}

// ── Helpers ───────────────────────────────────────────────────────
function buildFormData(payload) {
  const form = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    if (Array.isArray(value)) {
      value.forEach((v) => form.append(`${key}[]`, v))
    } else if (value instanceof File) {
      form.append(key, value)
    } else {
      form.append(key, String(value))
    }
  })
  return form
}
