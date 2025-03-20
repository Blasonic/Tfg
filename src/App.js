import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home/Home';
import Header from './componentes/Header/Header';
import BarraLateral from './componentes/BarraLateral/BarraLateral';
import Logo from './componentes/Logo/Logo';
import Login from './componentes/Login/Login';
import Registro from './componentes/Registro/Registro';
import Carrusel from './componentes/Carrusel/Carrusel';
import Section from './componentes/Section/Section';
import TextoSection from './componentes/TextoSection/TextoSection';

function App() {
  return (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Header" element={<Header/>} />
        <Route path="/BarraLateral" element={<BarraLateral/>} />
        <Route path="/Logo" element={<Logo/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Registro" element={<Registro/>} />
        <Route path="/Carrusel" element={<Carrusel/>} />
        <Route path="/Section" element={<Section/>} />
        <Route path="/TextoSection" element={<TextoSection/>} />

        </Routes>  
    </div>
    </Router>
  );
}

export default App;
