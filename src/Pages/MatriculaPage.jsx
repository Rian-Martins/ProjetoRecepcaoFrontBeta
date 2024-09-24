import React, { useState, useEffect } from 'react';
import '../App.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { baseUrl, pedidoGet, pedidoPost, pedidoPut, pedidoDelete } from '../apiService.js';
import ReposicaoPage from './ReposicaoPage.jsx';
import { v4 as uuidv4 } from 'uuid';

function MatriculaPage() {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
  
    /*modal */
    const [modalIncluir, setModalIncluir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [modalEscolherHorario, setModalEscolherHorario] = useState(false);
    const [modalSistemaCores, setModalSistemaCores] = useState(false);
    /*fim do modal */
  
    const [horarioSelecionado, setHorarioSelecionado] = useState('');
    const [diaSelecionado, setDiaSelecionado] = useState('');
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [sidebarAberto, setSidebarAberto] = useState(() => {
      const saved = localStorage.getItem('sidebarAberto');
      return saved === 'true';
    });
    const [alunoSelecionado, setAlunoSelecionado] = useState({
      id: '',
      nome: '',
      horario: '',
      data: '',
      professor: '',
      diaSemana:''        
    });
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  
    const horarios = [
      "06:00 - 06:40", "06:40 - 07:20", "07:20 - 08:00", "08:00 - 08:40", "08:40 - 09:20",
      "09:20 - 10:00", "10:00 - 10:40", "10:40 - 11:20",
      "15:30 - 16:10", "16:10 - 16:50", "16:50 - 17:30", "17:30 - 18:10", "18:10 - 18:50",
      "18:50 - 19:30", "19:30 - 20:10", "20:10 - 20:50", "20:50 - 21:30"
    ];
  
    const semana = [
      "Segunda", "Terça", "Quarta", "Quinta", "Sexta"
    ];
  
    const abrirFecharModalIncluir = () => {//dados apertados no modalincluir vem parar aqui
      if (!modalIncluir) {
        limparFormulario();
      }
      setAlunoSelecionado({
        ...alunoSelecionado,
        id: uuidv4()
      });
      setModalIncluir(!modalIncluir);
    };
  console.log("dados setAlunoSelecionado",alunoSelecionado)
    const abrirFecharModalEditar = () => {
      setModalEditar(!modalEditar);
    };
  
    const abrirFecharModalExcluir = () => {
      setModalExcluir(!modalExcluir);
    };
  
    const abrirFecharModalEscolherHorario = () => {
      setModalEscolherHorario(!modalEscolherHorario);
      if (!modalEscolherHorario) {
        atualizarHorariosDisponiveis();
      }
    };
  
    const handleRowClick = aluno => {
      setSelectedAluno(aluno);
      setAlunoSelecionado(aluno);
    };
  
    const handleChange = e => {
      const { name, value } = e.target;
      setAlunoSelecionado({
        ...alunoSelecionado,
        [name]: value
      });
    };
  
    const handleHorarioChange = (e) => {
      const horario = e.target.value;
      setHorarioSelecionado(horario);
      atualizarTabelaPorHorario(horario);
      localStorage.setItem('setHorarioSelecionado', horario);
    };
  
    // const handleDiaChange = (e) => {
    //   const dia = e.target.value;
    //   const diaSemanaObj = {        
    //     diaSemana: dia, // Armazena o dia selecionado
    //   };
    // console.log("valor dia", dia)
    //   setDiaSelecionado(dia);
    //   setAlunoSelecionado(prevState => ({
    //     ...prevState,
    //     diaSemana: [diaSemanaObj] // Atualiza o dia da semana como um objeto no array//MECHI AQUI
    //   }));
    //   localStorage.setItem('setDiaSelecionado', dia);
    // };
    // Atualizar a função handleDiaChange para armazenar apenas um dia
    const handleDiaChange = (e) => {
      const dia = e.target.value;
      setDiaSelecionado(dia);
      
      // Atualiza o estado do alunoSelecionado para incluir o dia selecionado
      setAlunoSelecionado(prevState => ({
        ...prevState,
        diaSemana: dia // Atualiza diretamente para uma string
      }));
      
      localStorage.setItem('setDiaSelecionado', dia);
    };
    
  
  
    const atualizarTabelaPorHorario = (horario) => {
      if (horario) {
        const alunosFiltrados = originalData.filter(aluno => aluno.horario === horario);
        setData(alunosFiltrados);
      } else {
        setData(originalData);
      }
    };
  
    const atualizarHorariosDisponiveis = () => {
      if (alunoSelecionado.data) {
        const horariosDisponiveisParaData = originalData
          .filter(aluno => aluno.data === alunoSelecionado.data)
          .map(aluno => aluno.horario);
        const horariosUnicos = [...new Set(horariosDisponiveisParaData)];
        setHorariosDisponiveis(horariosUnicos);
      } else {
        setHorariosDisponiveis(horarios);
      }
    };
  
    const limparFormulario = () => {
      setAlunoSelecionado({
        id: '',
        nome: '',
        horario: '',
        data: '',
        professor: '',
        diaSemana: ''                
      });
    };
    const toggleSidebar = () => {
      const novoEstado = !sidebarAberto;
      setSidebarAberto(novoEstado);
      // Salva o novo estado no localStorage
      localStorage.setItem('sidebarAberto', novoEstado);
    };
  
    useEffect(() => {
      const loadData = async () => {
        const response = await pedidoGet(setData, setOriginalData);
        console.log("Dados da API:", response);//está chegando aqui
        const storedHorario = localStorage.getItem('setHorarioSelecionado');
        if (storedHorario) {
          setHorarioSelecionado(storedHorario);
          setData(response.filter(aluno => aluno.horario === storedHorario));
        } else {
          setData(response);
        }
      };
      loadData();
    }, []);
  
    useEffect(() => {
      if (modalEscolherHorario && alunoSelecionado.data) {
        atualizarHorariosDisponiveis();
      }
    }, [alunoSelecionado.data, modalEscolherHorario, originalData]);
  
    const organizarPorDiaEHorario = (alunos) => {
      const matriz = {};
    
      // Definir os dias da semana e horários
      semana.forEach(dia => {
        matriz[dia] = {}; // Inicializa a matriz para cada dia
        horarios.forEach(horario => {
          matriz[dia][horario] = []; // Inicializa cada horário com array vazio
        });
      });
    
      // Organizar os alunos por dia da semana e horário
      alunos.forEach(aluno => {
        let diaSemanaNormalizado = aluno.diaSemana.charAt(0).toUpperCase() + aluno.diaSemana.slice(1).toLowerCase();
        
        const { horario } = aluno;
    
        // Garantir que o dia da semana e o horário existam na matriz
        if (semana.includes(diaSemanaNormalizado) && matriz[diaSemanaNormalizado][horario]) {
          matriz[diaSemanaNormalizado][horario].push(aluno); // Adiciona o aluno ao dia e horário corretos
        } else {
          console.warn(`Dia ou horário inválido para o aluno ${aluno.nome}`);
        }
      });
    
      return matriz;
    };
    
    
    const matrizAlunos = organizarPorDiaEHorario(data);
    console.log('Dado matriz: ',data);


    
  
    return (
      <div className='layout-container'>
                
        <div className="main-content" id="main-content">
            <h1>Sistema para controle da Recepção</h1>      
          </div>    
          <div className="aluno-container">                                  
            
            <header>
              <button className="btn btn-primary btn-esc" onClick={abrirFecharModalEscolherHorario}>Escolher Horário</button>
              {selectedAluno && (
                <>
                  <button className="btn btn-primary btn-edit" onClick={abrirFecharModalEditar}>Editar Aluno</button>
                  <button className="btn btn-danger btn-exc" onClick={abrirFecharModalExcluir}>Excluir Aluno</button>
                </>
              )}
              <button className="btn btn-success" onClick={abrirFecharModalIncluir}>Adicionar Aluno</button>
            </header>
            <br/>
            <h3 style={{ textAlign: 'center' }}>Horário Selecionado: {horarioSelecionado}</h3>
            
            <table className="table table-bordered">
              <thead>
                <tr>
                  {semana.map((dia, index) => (
                    <th key={index}>{dia}</th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {horarios.map((horario, index) => {
                  // Verifica se existe algum aluno no horário e dia especificado
                  const hasAlunos = semana.some((dia) => matrizAlunos[dia] && matrizAlunos[dia][horario] && matrizAlunos[dia][horario].length > 0);

                  // Se não houver alunos, pula a renderização da linha
                  if (!hasAlunos) {
                    return null;
                  }

                  return (
                    <tr key={index}>
                      {semana.map((dia, idx) => (
                        <td 
                          key={idx} 
                          style={{ verticalAlign: 'top' }} 
                          className={matrizAlunos[dia] && matrizAlunos[dia][horario] && matrizAlunos[dia][horario].length > 0 ? '' : 'empty'}
                        >
                          {matrizAlunos[dia] && matrizAlunos[dia][horario] && matrizAlunos[dia][horario].length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {matrizAlunos[dia][horario].map((aluno, alunoIdx) => (
                                <div 
                                  key={alunoIdx} 
                                  className="aluno-nome" 
                                  onClick={() => setSelectedAluno(aluno)} // Atualiza o estado com o aluno clicado
                                  style={{ cursor: 'pointer', backgroundColor: selectedAluno === aluno ? '#e0e0e0' : 'transparent' }} // Realça o aluno selecionado
                                >
                                  {aluno.nome}
                                </div>
                              ))}
                            </div>
                          ) : null /* Não exibe nada se não houver alunos */}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

  
  
  
  
            
  
            {/* Modal de Adicionar Aluno */}
            <Modal isOpen={modalIncluir}>
              <ModalHeader>Adicionar Aluno</ModalHeader>
              <ModalBody>
                <div className="form-group">
                  <label>Nome do Aluno:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nome"
                    onChange={handleChange}
                    value={alunoSelecionado.nome}
                  />
                  <label>Horário:</label>
                  <select
                    className="form-control"
                    name="horario"
                    onChange={handleHorarioChange}
                    value={alunoSelecionado.horario}
                  >
                    <option value="">Selecione um horário</option>
                    {horarios.map((horario, index) => (
                      <option key={index} value={horario}>{horario}</option>
                    ))}
                  </select>
                  <label>Data:</label>
                  <input
                    type="date"
                    className="form-control"
                    name="data"
                    onChange={handleChange}
                    value={alunoSelecionado.data}
                  />
                  <label>Professor:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="professor"
                    onChange={handleChange}
                    value={alunoSelecionado.professor}
                  />
                  <label>Dia da Semana:</label>
                    <select
                      className="form-control"
                      name="diaSemana"
                      onChange={handleDiaChange} // O evento chamará a função atualizada
                      value={alunoSelecionado.diaSemana} // Atualiza para usar o estado correto
                    >
                      <option value="">Selecione um dia</option>
                      {semana.map((dia, index) => (
                        <option key={index} value={dia}>{dia}</option>
                      ))}
                    </select>

                </div>
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-primary" onClick={() => pedidoPost(alunoSelecionado, setData, abrirFecharModalIncluir)}>
                  Incluir
                </button>{" "}
                <button className="btn btn-danger" onClick={abrirFecharModalIncluir}>Cancelar</button>
              </ModalFooter>
            </Modal>
  
            {/* Modal de Editar Aluno */}
            <Modal isOpen={modalEditar}>
              <ModalHeader>Editar Aluno</ModalHeader>
              <ModalBody>
                <div className="form-group">
                  <label>ID:</label>
                  <input type="text" className="form-control" readOnly value={alunoSelecionado.id} />
                  <label>Nome do Aluno:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nome"
                    onChange={handleChange}
                    value={alunoSelecionado.nome}
                  />
                  <label>Horário:</label>
                  <select
                    className="form-control"
                    name="horario"
                    onChange={handleChange}
                    value={alunoSelecionado.horario}
                  >
                    <option value="">Selecione um horário</option>
                    {horarios.map((horario, index) => (
                      <option key={index} value={horario}>{horario}</option>
                    ))}
                  </select>
                  <label>Data:</label>
                  <input
                    type="date"
                    className="form-control"
                    name="data"
                    onChange={handleChange}
                    value={alunoSelecionado.data}
                  />
                  <label>Professor:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="professor"
                    onChange={handleChange}
                    value={alunoSelecionado.professor}
                  />
                  <label>Dia da Semana:</label>
                  <select
                    className="form-control"
                    name="diaSemana"
                    onChange={handleDiaChange}
                    value={diaSelecionado}
                  >
                    <option value="">Selecione um dia</option>
                    {semana.map((dia, index) => (
                      <option key={index} value={dia}>{dia}</option>
                    ))}
                  </select>
                </div>
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-primary" onClick={() => pedidoPut(alunoSelecionado, setData, abrirFecharModalEditar)}>Editar</button>{" "}
                <button className="btn btn-danger" onClick={abrirFecharModalEditar}>Cancelar</button>
              </ModalFooter>
            </Modal>
  
            {/* Modal de Excluir Aluno */}
            <Modal isOpen={modalExcluir}>
              <ModalBody>
                Confirma a exclusão deste(a) aluno(a): {alunoSelecionado.nome} ?
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-danger" onClick={() => pedidoDelete(alunoSelecionado.id, setData, abrirFecharModalExcluir)}>Sim</button>
                <button className="btn btn-secondary" onClick={abrirFecharModalExcluir}>Não</button>
              </ModalFooter>
            </Modal>
  
            {/* Modal de Escolher Horário */}
            <Modal isOpen={modalEscolherHorario}>
              <ModalHeader>Escolher Horário</ModalHeader>
              <ModalBody>
                <div className="form-group">
                  <label>Escolha o Horário:</label>
                  <select className="form-control" value={horarioSelecionado} onChange={handleHorarioChange}>
                    <option value="">Selecione um horário</option>
                    {horariosDisponiveis.map((horario, index) => (
                      <option key={index} value={horario}>{horario}</option>
                    ))}
                  </select>
                </div>
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-secondary" onClick={abrirFecharModalEscolherHorario}>Sair</button>
              </ModalFooter>
            </Modal>
          </div>
      </div>
  
      
    );
  }

export default MatriculaPage;
