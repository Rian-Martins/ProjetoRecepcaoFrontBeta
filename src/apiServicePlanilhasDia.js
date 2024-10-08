// apiServicePlanilhasDia.js para a rematricula
export const pedidoDiaGet = async (data, horario) => {
  try {
    const response = await fetch(`https://localhost:44388/api/alunosreposicao/listar/data/${data}/horario/${horario}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    const result = await response.json();
    return result; // Retorne apenas os dados
  } catch (error) {
    console.error("Erro ao buscar dados por data:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};
