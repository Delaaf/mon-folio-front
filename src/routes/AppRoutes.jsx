import { Routes, Route } from "react-router-dom";

import { useModal } from '../hooks/useModal'; 

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import RegisterPage from '../pages/authPages/RegisterPage.jsx';
import LoginPage from '../pages/authPages/LoginPage.jsx'; 

import ProjectsPage from "../pages/ProjectsPage";
import AboutPage from "../pages/AboutPage";
import ResumePage from "../pages/ResumePage.jsx";
import ContactPage from "../pages/ContactPage";
import AccueilPage from "../pages/AccueilPage.jsx";
import MesInformations from "../pages/backoffice/MesInformations.jsx"
import ModificationPortfolio from "../pages/backoffice/ModificationPortfolio.jsx"
import GestionProjets from "../pages/backoffice/GestionProjets.jsx"
import GestionCompetences from "../pages/backoffice/GestionCompetences.jsx"
import GestionAutres from "../pages/backoffice/GestionAutres.jsx"
import ParametresCompte from "../pages/backoffice/ParametresCompte.jsx"
import AideSupport from "../pages/backoffice/AideSupport.jsx"

export default function AppRoutes() {

     const addModal = useModal(); 

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/projects" element={<ProjectsPage externalAddModal={addModal}/>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/mes-informations" element={<MesInformations />} />
        <Route path="/modifier-mon-portfolio" element={<ModificationPortfolio />} />
        <Route path="/gerer-mes-projets" element={<GestionProjets />} />
        <Route path="/gerer-mes-competences" element={<GestionCompetences />} />
        <Route path="/gerer-autres" element={<GestionAutres />} />
        <Route path="/parametres-du-compte" element={<ParametresCompte />} />
        <Route path="/aide-et-support" element={<AideSupport />} />
  
      </Route>

      {/* Pages SANS Navbar/Footer */}
      <Route element={<AuthLayout />}>
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
      </Route>

    </Routes>
    
  );
}