import React, { useState } from 'react';
import axios from 'axios';
import '../App.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ImportDataFromExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('Escolher arquivo para importar');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : 'Escolher arquivo para importar'); // Atualiza o rótulo com o nome do arquivo
  };

  const importData = async () => {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      console.log("Enviando arquivo para importação:", selectedFile);
      await axios.post('https://localhost:44388/api/alunosreposicao/import/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar dados do Excel:', error);
      alert('Erro ao importar dados.');
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get('https://localhost:44388/api/alunosreposicao/export/excel', {
        responseType: 'blob', // Define a resposta como um blob para tratar arquivos binários
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'AlunosReposicao.xlsx'); // Salva o arquivo Excel no cliente
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados do Excel:', error);
      alert('Erro ao exportar dados.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-4">Gerenciar Dados Excel</h3>

        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-7 text-center">
            <div className="custom-file mb-3">
              <input
                type="file"
                className="custom-file-input"
                id="inputFile"
                onChange={handleFileChange}
              />
              <label className="custom-file-label" htmlFor="inputFile">
                {fileName}
              </label>
            </div>
            <button className="btn btn-success btn-block" onClick={importData}>
              <i className="fas fa-file-import"></i> Importar Dados
            </button>
          </div>

          <div className="col-md-6 text-center">
            <button className="btn btn-primary btn-block btnExpAcertar" onClick={exportData}>
              <i className="fas fa-file-export"></i> Exportar Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDataFromExcel;
