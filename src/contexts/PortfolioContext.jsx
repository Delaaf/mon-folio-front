import React, { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

const PortfolioContext = createContext(null)

export const usePortfolio = () => useContext(PortfolioContext)

export const PortfolioProvider = ({ children }) => {
  const { username } = useParams()

  const [profile, setProfile]   = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        /*const [profileRes, projectsRes] = await Promise.all([
          api.get(`/public/${username}`),
          api.get(`/public/${username}/projects`, { params: { per_page: 50 } }),
        ])

        setProfile(profileRes.data.data)
        setProjects(projectsRes.data.data ?? [])
      */
     
     //const profileRes = await api.get(`/public/${username}`) } catch (err) {
        if (err.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [username])

  return (
    <PortfolioContext.Provider value={{
      profile,
      projects,
      username,
      loading,
      notFound
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}