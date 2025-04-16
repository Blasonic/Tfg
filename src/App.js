import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { Navigate } from 'react-router-dom';
import Admin from './componentes/Admin/Admin'; 
const user = JSON.parse(localStorage.getItem("user"));
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Header" element={<Header />} />
          <Route path="/BarraLateral" element={<BarraLateral />} />
          <Route path="/Logo" element={<Logo />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Carrusel" element={<Carrusel />} />
          <Route path="/Section" element={<Section />} />
          <Route path="/TextoSection" element={<TextoSection />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/IzquierdaFooter" element={<IzquierdaFooter />} />
          <Route path="/SobreNosotros" element={<SobreNosotros />} />
          <Route path="/AvisoLegal" element={<AvisoLegal />} />
          <Route path="/PoliticaCookies" element={<PoliticaCookies />} />
          <Route path="/VerPerfil" element={<VerPerfil />} />
          <Route
  path="/admin"
  element={
    user?.email === process.env.REACT_APP_ADMIN_EMAIL ? (
      <Admin token={localStorage.getItem("token")} user={user} />
    ) : (
      <Navigate to="/" />
    )
  }
/>



        </Routes>
      </div>
    </Router>
  );
}

export default App;
