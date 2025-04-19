import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './componentes/Home/Home';
import Header from './componentes/Header/Header';
import BarraLateral from './componentes/BarraLateral/BarraLateral';
import Logo from './componentes/Logo/Logo';
import Login from './componentes/Login/Login';
import Registro from './componentes/Registro/Registro';
import Carrusel from './componentes/Carrusel/Carrusel';
import Section from './componentes/Section/Section';
import TextoSection from './componentes/TextoSection/TextoSection';
import Footer from './componentes/Footer/Footer';
import SobreNosotros from './componentes/SobreNosotros/SobreNosotros';
import IzquierdaFooter from './componentes/IzquierdaFooter/IzquierdaFooter';
import AvisoLegal from './componentes/AvisoLegal/AvisoLegal';
import PoliticaCookies from './componentes/PoliticaCookies/PoliticaCookies';
import VerPerfil from './componentes/VerPerfil/VerPerfil';
import Admin from './componentes/Admin/Admin';
import CalendarioGlobal from './componentes/Calendario/CalendarioGlobal';

const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
const sessionAdmin = sessionStorage.getItem("admin-just-logged") === "true";

const token = sessionAdmin
  ? sessionStorage.getItem("admin-token")
  : localStorage.getItem("token");

const user = sessionAdmin
  ? { email: adminEmail }
  : JSON.parse(localStorage.getItem("user"));

const isAdmin = sessionAdmin;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Header" element={<Header />} />
          <Route path="/BarraLateral" element={<BarraLateral />} />
          <Route path="/Logo" element={<Logo />} />
          <Route path="/Carrusel" element={<Carrusel />} />
          <Route path="/Section" element={<Section />} />
          <Route path="/TextoSection" element={<TextoSection />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/IzquierdaFooter" element={<IzquierdaFooter />} />
          <Route path="/SobreNosotros" element={<SobreNosotros />} />
          <Route path="/AvisoLegal" element={<AvisoLegal />} />
          <Route path="/PoliticaCookies" element={<PoliticaCookies />} />
          <Route path="/VerPerfil" element={<VerPerfil /> } />
          <Route path="/CalendarioGlobal" element={<CalendarioGlobal /> } />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <Admin token={token} user={user} />
              ) : (
                <Navigate to="/Login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
