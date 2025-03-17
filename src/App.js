import { Route, Router, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={"/"} />
        </Routes>
      
    </div>
    </Router>
  );
}

export default App;
