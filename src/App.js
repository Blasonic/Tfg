import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './componentes/Home/Home';
import Header from './componentes/Header/Header';
import BarraLateral from './componentes/BarraLateral/BarraLateral';
import Logo from './componentes/Logo/Logo';
import Login from './componentes/Login/Login';
import Registro from './componentes/Registro/Registro';
import Section from './componentes/Section/Section';
import Footer from './componentes/Footer/Footer';
import SobreNosotros from './componentes/SobreNosotros/SobreNosotros';
import IzquierdaFooter from './componentes/IzquierdaFooter/IzquierdaFooter';
import AvisoLegal from './componentes/AvisoLegal/AvisoLegal';
import PoliticaCookies from './componentes/PoliticaCookies/PoliticaCookies';
import VerPerfil from './componentes/VerPerfil/VerPerfil';
import Admin from './componentes/Admin/Admin';
import CalendarioGlobal from './componentes/Calendario/CalendarioGlobal';
import FormularioAnadir from './componentes/Calendario/FormularioAnadir';
import ProtegerAdmin from './componentes/Admin/ProtegerAdmin';
import CalendarioPatronal from './componentes/Calendario/CalendarioPatronal';
import CalendarioLocal from './componentes/Calendario/CalendarioLocal';






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
          <Route path="/Section" element={<Section />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/IzquierdaFooter" element={<IzquierdaFooter />} />
          <Route path="/SobreNosotros" element={<SobreNosotros />} />
          <Route path="/AvisoLegal" element={<AvisoLegal />} />
          <Route path="/PoliticaCookies" element={<PoliticaCookies />} />
          <Route path="/VerPerfil" element={<VerPerfil />} />
          <Route path="/CalendarioGlobal" element={<CalendarioGlobal />} />
         <Route path="/CalendarioLocal" element={<CalendarioLocal />} />
         <Route path="/CalendarioPatronal" element={<CalendarioPatronal />} />
          <Route path="/FormularioAnadir" element={<FormularioAnadir />} />
          <Route
  path="/admin"
  element={
    <ProtegerAdmin>
      <Admin />
    </ProtegerAdmin>
  }
/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
