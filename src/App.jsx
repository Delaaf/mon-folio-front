import React from 'react'
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import { useModal } from './hooks/useModal'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'
import EmailVerificationBanner from './components/EmailVerificationBanner/EmailVerificationBanner'
import AnalyticsTracker from './components/AnalyticsTracker/AnalyticsTracker'

import Navbar  from './components/Navbar'
import Footer  from './components/Footer'

// Auth
import LoginPage          from './pages/authPages/LoginPage'
import RegisterPage       from './pages/authPages/RegisterPage'
import ForgotPasswordPage from './pages/authPages/ForgotPasswordPage'
import ResetPasswordPage  from './pages/authPages/ResetPasswordPage'
import OAuthCallback      from './pages/authPages/OAuthCallback'

import HomePage from './pages/connectedPages/HomePage'

// ── Portfolio PUBLIC (/portfolio/:username/...) ──
import PortfolioLayout    from './layouts/PortfolioLayout'
import PortfolioHome      from './pages/portfolio/PortfolioHome'
import  PortfolioProjets      from './pages/portfolio/PortfolioProjets'
import  PortfolioAPropos      from './pages/portfolio/PortfolioAPropos'
import PortfolioContact     from './pages/portfolio/PortfolioContact'

// Portfolio PUBLIC d'un utilisateur  →  /portfolio/:username
//import PublicPortfolioPage from './pages/portfolio/PublicPortfolioPage'

// Dashboard (connecté)  →  /dashboard
import DashboardPage from './pages/dashboard/DashboardPage'
import DashboardLayout from './layouts/DashboardLayout'

import LandingPage from './pages/landingPage/LandingPage'

//Pages etant connecté

import ProjectsPage from './pages/connectedPages/ProjectsPage'
import AboutPage from './pages/connectedPages/AboutPage'
import ContactPage from './pages/connectedPages/ContactPage'

// Backoffice(connecté)
import MesInformations       from './pages/backoffice/MesInformations'
import ModificationPortfolio from './pages/backoffice/ModificationPortfolio'
import GestionProjets        from './pages/backoffice/GestionProjets'
import GestionCompetences    from './pages/backoffice/GestionCompetences'
import GestionAutres         from './pages/backoffice/GestionAutres'
import ParametresCompte      from './pages/backoffice/ParametresCompte'
import AideSupport           from './pages/backoffice/AideSupport'


const App = () => (
  <BrowserRouter>

    <AnalyticsTracker/>
    <AuthProvider>
      <Routes>
        {/* Auth (sans layout, redirige si déjà connecté) */}
        <Route path="/connexion"           element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/inscription"        element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/mot-de-passe-oublie" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/reinitialiser-mot-de-passe"  element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />
        <Route path="/auth/callback"   element={<OAuthCallback />} />

        {/* ── Page d'accueil de la plateforme ── */}
        <Route path="/" element={<LandingPage/>}/>

        {/* ── Portfolio PUBLIC d'un utilisateur ── */}
        {/* exemple : /portfolio/alexrivera */}
        <Route path="/public/:username" element={<PortfolioLayout />}>
          <Route index              element={<PortfolioHome />} />
          <Route path="projets"     element={<PortfolioProjets />} />
          <Route path="a-propos"    element={<PortfolioAPropos />} />
          <Route path="contact"     element={<PortfolioContact />} />
        </Route>

        {/* ── espace admin ── */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index              element={<DashboardPage />} />
          <Route path="mes-informations"     element={<ProtectedRoute><MesInformations /></ProtectedRoute>} />
          <Route path="modifier-mon-portfolio"    element={<ProtectedRoute><ModificationPortfolio /></ProtectedRoute>} />
          <Route path="gerer-mes-projets"     element={<ProtectedRoute><GestionProjets /></ProtectedRoute>} />
          <Route path="gerer-mes-competences"     element={<ProtectedRoute><GestionCompetences /></ProtectedRoute>} />
          <Route path="gerer-autres"     element={<ProtectedRoute><GestionAutres /></ProtectedRoute>} />
          <Route path="parametres-du-compte"     element={<ProtectedRoute><ParametresCompte /></ProtectedRoute>} />
          <Route path="aide-et-support"     element={<ProtectedRoute><AideSupport /></ProtectedRoute>} />
        </Route>

      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App
