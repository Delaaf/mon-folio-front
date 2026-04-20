import React from 'react'
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import { useModal } from './hooks/useModal'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'
import EmailVerificationBanner from './components/EmailVerificationBanner/EmailVerificationBanner'

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


const WithLayout = ({ children }) => {
  const addModal = useModal()
  return (
  <>
  <Navbar onAddProject={addModal.open} />
  <EmailVerificationBanner />
  {children}
  <Footer />
  </>
  )
}

const App = () => (
  <BrowserRouter>
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
        {/* Accessible sans connexion : /portfolio/alexrivera */}
        <Route path="/public/:username" element={<PortfolioLayout />}>
          <Route index              element={<PortfolioHome />} />
          <Route path="projets"     element={<PortfolioProjets />} />
          <Route path="a-propos"    element={<PortfolioAPropos />} />
          <Route path="contact"     element={<PortfolioContact />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index              element={<DashboardPage />} />
          <Route path="mes-infomations"     element={<ProtectedRoute><MesInformations /></ProtectedRoute>} />
          <Route path="modifier-mon-portfolio"    element={<ProtectedRoute><ModificationPortfolio /></ProtectedRoute>} />
          <Route path="gerer-mes-projets"     element={<ProtectedRoute><GestionProjets /></ProtectedRoute>} />
          <Route path="gerer-mes-competences"     element={<ProtectedRoute><GestionCompetences /></ProtectedRoute>} />
          <Route path="gerer-autres"     element={<ProtectedRoute><GestionAutres /></ProtectedRoute>} />
          <Route path="parametres-du-compte"     element={<ProtectedRoute><ParametresCompte /></ProtectedRoute>} />
          <Route path="aide-et-support"     element={<ProtectedRoute><AideSupport /></ProtectedRoute>} />
        </Route>

        {/* Backoffice (authentification requise) 
        <Route path="/mes-informations"       element={<ProtectedRoute><WithLayout><MesInformations /></WithLayout></ProtectedRoute>} />
        <Route path="/modifier-mon-portfolio" element={<ProtectedRoute><WithLayout><ModificationPortfolio /></WithLayout></ProtectedRoute>} />
        <Route path="/gerer-mes-projets"      element={<ProtectedRoute><WithLayout><GestionProjets /></WithLayout></ProtectedRoute>} />
        <Route path="/gerer-mes-competences"  element={<ProtectedRoute><WithLayout><GestionCompetences /></WithLayout></ProtectedRoute>} />
        <Route path="/gerer-autres"           element={<ProtectedRoute><WithLayout><GestionAutres /></WithLayout></ProtectedRoute>} />
        <Route path="/parametres-du-compte"   element={<ProtectedRoute><WithLayout><ParametresCompte /></WithLayout></ProtectedRoute>} />
        <Route path="/aide-et-support"        element={<ProtectedRoute><WithLayout><AideSupport /></WithLayout></ProtectedRoute>} />
        <Route path="/accueil"                element={<ProtectedRoute><WithLayout><DashboardPage /></WithLayout></ProtectedRoute>} />
        <Route path="/projets"                element={<ProtectedRoute><WithLayout><ProjectsPage /></WithLayout></ProtectedRoute>} />
        <Route path="/a-propos"               element={<ProtectedRoute><WithLayout><AboutPage /></WithLayout></ProtectedRoute>} />
        <Route path="/contact"                element={<ProtectedRoute><WithLayout><ContactPage /></WithLayout></ProtectedRoute>} />
*/}

      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App
