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
import AvisoLegal from './componentes/AvisoLegal/AvisoLegal';
import PoliticaCookies from './componentes/PoliticaCookies/PoliticaCookies';
import VerPerfil from './componentes/VerPerfil/VerPerfil';
import Admin from './componentes/Admin/Admin';
import CalendarioGlobal from './componentes/Calendario/CalendarioGlobal';
import FormularioAnadir from './componentes/Calendario/FormularioAnadir';
import ProtegerAdmin from './componentes/Admin/ProtegerAdmin';
import ComentariosPanel from './componentes/Comentarios/Comentarios';
import Soporte from './componentes/Soporte/Soporte';
import Ayuda from './componentes/Ayuda/Ayuda';






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

          <Route path="/SobreNosotros" element={<SobreNosotros />} />
          <Route path="/AvisoLegal" element={<AvisoLegal />} />
          <Route path="/PoliticaCookies" element={<PoliticaCookies />} />
          <Route path="/VerPerfil" element={<VerPerfil />} />
          <Route path="/comentarios" element={<ComentariosPanel />} />
          <Route path="/Soporte" element={<Soporte />} />
          <Route path="/Ayuda" element={<Ayuda />} />
          <Route path="/CalendarioGlobal" element={<CalendarioGlobal />} />

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
