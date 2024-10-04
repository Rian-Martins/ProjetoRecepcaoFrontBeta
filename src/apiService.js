import axios from 'axios';
import { v4 as uuidv4} from 'uuid';



const baseUrl = "https://localhost:44388/api/alunos/listar";
const creUrl = "https://localhost:44388/api/alunos/criar";
const editUrl = id => `https://localhost:44388/api/alunos/${id}`;
const delUrl = id => `https://localhost:44388/api/alunos/${id}`;

const pedidoGet = async (setData, setOriginalData) => {
  try {
    const response = await axios.get(baseUrl);
    const sortedData = response.data.sort((a, b) => a.id - b.id);
    setData(sortedData);
    setOriginalData(sortedData);
    return sortedData; // Retorne os dados para uso posterior
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return []; // Retorne um array vazio em caso de erro
  }
};

//metodo do post
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const pedidoPost = async (alunoSelecionado, setData, abrirFecharModalIncluir) => {
  try {
    const alunoId = uuidv4(); // Gera um Guid válido para o aluno

    // Validação simples para garantir que os campos obrigatórios dos modais estão preenchidos
    if (!alunoSelecionado.diaSemana || !alunoSelecionado.nome /*|| !alunoSelecionado.horario */|| !alunoSelecionado.data) {
      console.error('Campos obrigatórios faltando');
      return;
    }

    // Se diaSemana for um array de objetos, converte para uma string com os dias
    if (Array.isArray(alunoSelecionado.diaSemana)) {
      alunoSelecionado.diaSemana = alunoSelecionado.diaSemana.map(item => item.semana).join(", ");
    }

    const alunoParaCriar = {
      id: alunoId,
      nome: alunoSelecionado.nome,
      horario: alunoSelecionado.horario,
      data: formatDate(alunoSelecionado.data), // Formata a data para yyyy-MM-dd
      professor: alunoSelecionado.professor,
      diaSemana: alunoSelecionado.diaSemana
    };

    const response = await axios.post(creUrl, alunoParaCriar, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      setData(prevData => [...prevData, response.data]);
      abrirFecharModalIncluir();
    } else {
      console.log('Resposta não esperada:', response);
    }
  } catch (error) {
    console.error('Erro ao criar aluno:', error.response ? error.response.data : error.message);
  }
};




const pedidoPut = async (AlunoSelecionado, setData, abrirFecharModalEditar) => {
  try {
    // Usa a função editUrl para gerar a URL com o alunoId
    const url = editUrl(AlunoSelecionado.alunoId);

    // Faz a requisição PUT
    const response = await axios.put(url, AlunoSelecionado, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Processa a resposta
    console.log(response.data);
    setData(response.data);
    abrirFecharModalEditar();
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
  }
};





const pedidoDelete = async (id, setData, abrirFecharModalExcluir) => {
  console.log('ID do aluno a ser excluído:', id); // Verifique o ID aqui
  try {
    const response = await axios.delete(delUrl(id));
    if (response.status === 200) {
      setData(prevData => prevData.filter(aluno => aluno.id !== id));
      abrirFecharModalExcluir();
    } else {
      console.log('Resposta não esperada:', response);
    }
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
  }
};


export { baseUrl, creUrl, editUrl, delUrl, pedidoGet, pedidoPost, pedidoPut, pedidoDelete };
