import React from 'react'; 
import { BrowserRouter } from "react-router-dom"; 
import AppRoutes from "./routes/AppRoutes";

/**
 * App — composant racine
 * Gère le layout global : Navbar + Page + Footer
 */
const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
