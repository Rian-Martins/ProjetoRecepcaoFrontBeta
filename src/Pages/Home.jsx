import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { pedidoDiaGet } from '../apiServicePlanilhasDia.js';
import '../App.js';

function Home() {
  const [data, setData] = useState([]); // Armazena os alunos filtrados por data e horário
  const [originalData, setOriginalData] = useState([]); // Armazena todos os alunos
  const [matrizAlunos, setMatrizAlunos] = useState({}); // Matriz de alunos para a tabela
  const [selectedDate, setSelectedDate] = useState("");
  const [modalEscolhaPlanilhaDia, setModalEscolhaPlanilhaDia] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState({ data: '' });
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]); // Lista de horários disponíveis
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  const semana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const horarios = [
    "06:00 - 06:40", "06:40 - 07:20", "07:20 - 08:00", "08:00 - 08:40",
    "08:40 - 09:20", "09:20 - 10:00", "10:00 - 10:40", "10:40 - 11:20",
    "15:30 - 16:10", "16:10 - 16:50", "16:50 - 17:30", "17:30 - 18:10",
    "18:10 - 18:50", "18:50 - 19:30", "19:30 - 20:10", "20:10 - 20:50",
    "20:50 - 21:30"
  ];

  const abrirFecharModalEscolhaPlanilhaDia = () => {
    setModalEscolhaPlanilhaDia(!modalEscolhaPlanilhaDia);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDate && horarioSelecionado) {
        setLoadingData(true);
        const dados = await pedidoDiaGet(selectedDate, horarioSelecionado); // Passando a data e o horário
        setOriginalData(dados);
        setData(dados); // Atualiza a tabela com os dados filtrados
        setLoadingData(false);
      }
    };

    fetchData();
  }, [selectedDate, horarioSelecionado]); // Atualiza quando a data ou horário selecionados mudarem

  // Adicione este useEffect para buscar horários disponíveis quando a data mudar
  useEffect(() => {
    const fetchHorariosDisponiveis = async () => {
      if (selectedDate) {
        // Se houver uma função para buscar horários disponíveis, você deve implementá-la aqui
        // Exemplo: const horarios = await buscarHorariosDisponiveis(selectedDate);
        // setHorariosDisponiveis(horarios);
        
        // Para exemplo, vamos considerar que você tem todos os horários disponíveis
        setHorariosDisponiveis(horarios);
      }
    };

    fetchHorariosDisponiveis();
  }, [selectedDate]); // Atualiza quando a data mudar

  const handleHorarioChange = (e) => {
    const horario = e.target.value;
    setHorarioSelecionado(horario);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setHorarioSelecionado(''); // Limpa a seleção de horário ao mudar a data
  };

  const incluirPlanilhaDia = async () => {
    if (selectedDate && horarioSelecionado) { // Verifica data e horário
      const alunosPorDia = await pedidoDiaGet(selectedDate, horarioSelecionado);
  
      if (Array.isArray(alunosPorDia)) {
        const matriz = {};
        alunosPorDia.forEach(aluno => {
          const { diaSemana, horario } = aluno;
  
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
      alert("Por favor, selecione uma data e um horário.");
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
          Filtro da Planilha de Matricula
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
                disabled={horariosDisponiveis.length === 0}
              >
                <option value="">Selecione um horário</option>
                {horariosDisponiveis.map((horario, index) => (
                  <option key={index} value={horario}>
                    {horario}
                  </option>
                ))}
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
                    {semana.map((dia, idx) => {
                      const alunosDoDia = alunosPorHorario[dia] || [];
                      return (
                        <td key={idx}>
                          {alunosDoDia.length > 0 ? (
                            alunosDoDia.map((aluno, alunoIdx) => (
                              <div
                                key={alunoIdx}
                                className="aluno-nome"
                                onClick={() => handleRowClick(aluno)}
                                style={{ cursor: 'pointer' }}
                              >
                                {aluno.nome}
                              </div>
                            ))
                          ) : null} {/* Renderiza null se não houver alunos, removendo linhas vazias */}
                        </td>
                      );
                    })}
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
