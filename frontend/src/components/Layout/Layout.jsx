import Navbar from "../navbar/navbar.jsx";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;