import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { pedidoDiaGet } from '../apiServicePlanilhasDia.js';
import '../App.js';

function Home() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [matrizAlunos, setMatrizAlunos] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [modalEscolhaPlanilhaDia, setModalEscolhaPlanilhaDia] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState({ data: '' });
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const semana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const horarios = [
    "06:00 - 06:40", "06:40 - 07:20", "07:20 - 08:00", "08:00 - 08:40",
    "08:40 - 09:20", "09:20 - 10:00", "10:00 - 10:40", "10:40 - 11:20",
    "15:30 - 16:10", "16:10 - 16:50", "16:50 - 17:30", "17:30 - 18:10",
    "18:10 - 18:50", "18:50 - 19:30", "19:30 - 20:10", "20:10 - 20:50",
    "20:50 - 21:30"
  ];

  // Função para abrir e fechar o modal
  const abrirFecharModalEscolhaPlanilhaDia = () => {
    setModalEscolhaPlanilhaDia(!modalEscolhaPlanilhaDia);
  };

  // Atualiza os horários disponíveis com base na data selecionada
  // const atualizarHorariosDisponiveis = (dataSelecionada) => {
  //   setLoadingHorarios(true);

  //   const horariosDisponiveisParaData = originalData
  //     .filter(aluno => aluno.data === dataSelecionada)
  //     .map(aluno => aluno.horario);

  //   const horariosUnicos = [...new Set(horariosDisponiveisParaData)];
  //   setHorariosDisponiveis(horariosUnicos);
  //   setLoadingHorarios(false);
  // };
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const dados = await pedidoDiaGet(selectedDate);
      setOriginalData(dados);
      setLoadingData(false);
      console.log("Dados carregados:", dados);
    };
  
    if (selectedDate) {
      fetchData();
      atualizarHorariosDisponiveis(selectedDate); // Chama a função para atualizar os horários
    }
  }, [selectedDate]);
  
  const atualizarHorariosDisponiveis = (dataSelecionada) => {
    setLoadingHorarios(true);
    const horariosDisponiveisParaData = originalData
      .filter(aluno => aluno.data === dataSelecionada)
      .map(aluno => aluno.horario);
  
    const horariosUnicos = [...new Set(horariosDisponiveisParaData)];
    console.log("Horários disponíveis:", horariosUnicos); // Verifica se está preenchido
    setHorariosDisponiveis(horariosUnicos);
    setLoadingHorarios(false);
  };
  

  // Carregar dados ao selecionar uma data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const dados = await pedidoDiaGet(selectedDate);
      setOriginalData(dados);
      setLoadingData(false);
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  const handleHorarioChange = (e) => {
    const horario = e.target.value;
    setHorarioSelecionado(horario);
    atualizarTabelaPorHorario(horario);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    atualizarHorariosDisponiveis(date);
  };

  // Filtra os alunos por horário
  const atualizarTabelaPorHorario = (horario) => {
    if (horario && selectedDate) {
      const alunosFiltrados = originalData.filter(aluno => aluno.horario === horario && aluno.data === selectedDate);
      setData(alunosFiltrados);
    } else {
      setData(originalData);
    }
  };

  const incluirPlanilhaDia = async () => {
    if (selectedDate) { // Verifique apenas a data
      const alunosPorDia = await pedidoDiaGet(selectedDate);
  
      if (Array.isArray(alunosPorDia)) {
        const matriz = {};
        alunosPorDia.forEach(aluno => {
          const { diaSemana, horario } = aluno;
  
          // Adiciona todos os alunos, independentemente do horário
          matriz[horario] = matriz[horario] || {};
          matriz[horario][diaSemana] = matriz[horario][diaSemana] || [];
          matriz[horario][diaSemana].push(aluno);
        });
  
        setMatrizAlunos(matriz);
        setOriginalData(alunosPorDia);
        setPlanilhaCarregada(true);
        abrirFecharModalEscolhaPlanilhaDia();
      } else {
        console.error("Dados retornados não são um array:", alunosPorDia);
      }
    } else {
      alert("Por favor, selecione uma data."); // Remover mensagem sobre horário
    }
  };
  

  const handleRowClick = (aluno) => {
    setAlunoSelecionado(aluno);
  };

  return (
    <div className='layout-container'>
      <div className="main-content">
        <h1>Bem-Vindo à Página Inicial</h1>
      </div>
      <div className="aluno-container">
        <h3>Selecione a planilha que preferir</h3>

        <button className="btn btn-primary" onClick={abrirFecharModalEscolhaPlanilhaDia}>
          Planilha de Reposição
        </button>

        <Modal isOpen={modalEscolhaPlanilhaDia}>
          <ModalHeader>Planilha de Reposição</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Data:</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={handleDateChange}
              />
              <label>Escolha o Horário:</label>
              <select
                className="form-control"
                value={horarioSelecionado}
                onChange={handleHorarioChange}
                disabled={loadingHorarios}
              >
                <option value="">Selecione um horário</option>
                {loadingHorarios ? (
                  <option>Carregando horários...</option>
                ) : (
                  horariosDisponiveis.map((horario, index) => (
                    <option key={index} value={horario}>
                      {horario}
                    </option>
                  ))
                )}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={incluirPlanilhaDia}>
              Incluir
            </button>
            <button className="btn btn-danger" onClick={abrirFecharModalEscolhaPlanilhaDia}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        {data.length > 0 && (
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
                const alunosPorHorario = matrizAlunos[horario] || {};
                return (
                  <tr key={index}>
                    {semana.map((dia, idx) => (
                      <td key={idx}>
                        {alunosPorHorario[dia]?.map((aluno, alunoIdx) => (
                          <div
                            key={alunoIdx}
                            className="aluno-nome"
                            onClick={() => handleRowClick(aluno)}
                            style={{ cursor: 'pointer' }}
                          >
                            {aluno.nome}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Home;
