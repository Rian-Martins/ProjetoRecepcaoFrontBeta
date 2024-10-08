import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Pages/Home';
import MatriculaPage from './Pages/MatriculaPage';
import ReposicaoPage from './Pages/ReposicaoPage';
import ImportDataFromExcel from './Pages/ImportDataFromExcel';

function App() {
  const [sidebarAberto, setSidebarAberto] = useState(() => {
    const saved = localStorage.getItem('sidebarAberto');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    const novoEstado = !sidebarAberto;
    setSidebarAberto(novoEstado);
    localStorage.setItem('sidebarAberto', novoEstado);
  };

  return (
    <div className='layout-container'>
      <Router>
        <div className={sidebarAberto ? 'sidebar' : 'sidebar-acionado hide-text'} id="sidebar">
          <button className="closebtn" onClick={toggleSidebar}>☰</button>
          <nav>
            <Link to="/Home">Página Inicial</Link>
            <Link to="/MatriculaPage">Planilha de Matrícula</Link>
            <Link to="/ReposicaoPage">Planilha de Reposição</Link>
            <Link to="/ImportDataFromExcel">Importar dados da Tabela Reposição</Link>
          </nav>
        </div>
        <div className="main-content" id="main-content">        
          <Routes>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/MatriculaPage" element={<MatriculaPage />} />
            <Route path="/ReposicaoPage" element={<ReposicaoPage />} />
            <Route path="/ImportDataFromExcel" element={<ImportDataFromExcel />} />
          </Routes>
        </div>
      </Router>
      <div className="aluno-container">
        
      </div>
    </div>
  );
}

export default App;
