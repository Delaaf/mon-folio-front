/**
 * authService.js — Toutes les opérations d'authentification
 */
import api, { setToken, clearToken } from './api'

const AuthService = {
  /**
   * Inscription classique (3 étapes)
   */
  async register(payload) {
    const { data } = await api.post('/auth/register', {
      prenom:     payload.prenom,
      nom:        payload.nom,
      email:      payload.email,
      password:   payload.password,
      password_confirmation: payload.confirm,
      username:   payload.username,
      role_title: payload.role,
    })
    setToken(data.data.token)
    return data
  },

  /**
   * Connexion email + mot de passe
   */
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.data.token)
    return data
  },

  /**
   * Déconnexion — invalide le token côté serveur
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      clearToken()
    }
  },

  /**
   * Récupère l'utilisateur connecté
   */
  async me() {
    const { data } = await api.get('/auth/me')
    return data.data
  },

  /**
   * Refresh du token JWT
   */
  async refresh() {
    const { data } = await api.post('/auth/refresh')
    setToken(data.data.token)
    return data
  },

  /**
   * Changement de mot de passe
   */
  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/auth/change-password', {
      current_password:          currentPassword,
      new_password:              newPassword,
      new_password_confirmation: newPassword,
    })
    return data
  },

  /**
   * Redirection OAuth Google
   */
  async getGoogleRedirectUrl() {
    const { data } = await api.get('/auth/google')
    return data.redirect_url
  },

  /**
   * Redirection OAuth GitHub
   */
  async getGithubRedirectUrl() {
    const { data } = await api.get('/auth/github')
    return data.redirect_url
  },

  /**
   * Vérifie si un token est présent en localStorage
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem('monfolio_token'))
  },
}

export default AuthService
