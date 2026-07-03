import api from './api'

export const PortfolioService = {
  async getSettings() {
    const { data } = await api.get('/portfolio/settings')
    return data
  },
  async updateSettings(payload) {
    const { data } = await api.put('/portfolio/settings', payload)
    return data
  },
}
