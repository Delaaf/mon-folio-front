import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

// Public
import HomePage      from './pages/HomePage'
import ProjectsPage  from './pages/ProjectsPage'
import AboutPage     from './pages/AboutPage'
import SkillsPage    from './pages/SkillsPage'
import ContactPage   from './pages/ContactPage'

// Backoffice
import MesInformations       from './pages/backoffice/MesInformations'
import ModificationPortfolio from './pages/backoffice/ModificationPortfolio'
import GestionProjets        from './pages/backoffice/GestionProjets'
import GestionCompetences    from './pages/backoffice/GestionCompetences'
import GestionAutres         from './pages/backoffice/GestionAutres'
import ParametresCompte      from './pages/backoffice/ParametresCompte'
import AideSupport           from './pages/backoffice/AideSupport'

const WithLayout = ({ children }) => {
  const addModal = useModal()
  return (<>
  <Navbar onAddProject={addModal.open} />
  <EmailVerificationBanner />
  {children}
  <Footer /></>)
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

        {/* Public */}
        <Route path="/"         element={<WithLayout><HomePage /></WithLayout>} />
        <Route path="/projets" element={<WithLayout><ProjectsPage /></WithLayout>} />
        <Route path="/a-propos"    element={<WithLayout><AboutPage /></WithLayout>} />
        <Route path="/competences"   element={<WithLayout><SkillsPage /></WithLayout>} />
        <Route path="/contact"  element={<WithLayout><ContactPage /></WithLayout>} />

        {/* Backoffice (authentification requise) */}
        <Route path="/mes-informations"       element={<ProtectedRoute><WithLayout><MesInformations /></WithLayout></ProtectedRoute>} />
        <Route path="/modifier-mon-portfolio" element={<ProtectedRoute><WithLayout><ModificationPortfolio /></WithLayout></ProtectedRoute>} />
        <Route path="/gerer-mes-projets"      element={<ProtectedRoute><WithLayout><GestionProjets /></WithLayout></ProtectedRoute>} />
        <Route path="/gerer-mes-competences"  element={<ProtectedRoute><WithLayout><GestionCompetences /></WithLayout></ProtectedRoute>} />
        <Route path="/gerer-autres"           element={<ProtectedRoute><WithLayout><GestionAutres /></WithLayout></ProtectedRoute>} />
        <Route path="/parametres-du-compte"   element={<ProtectedRoute><WithLayout><ParametresCompte /></WithLayout></ProtectedRoute>} />
        <Route path="/aide-et-support"        element={<ProtectedRoute><WithLayout><AideSupport /></WithLayout></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App
