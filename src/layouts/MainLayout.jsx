import { Outlet } from "react-router-dom";
import { useModal }    from '../hooks/useModal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  const addModal = useModal();

  return (
    <>
      <Navbar onAddProject={addModal.open} />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;