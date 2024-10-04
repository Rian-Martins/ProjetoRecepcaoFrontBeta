import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ImportDataFromExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const importData = async () => {
    if (!selectedFile) return;
    console.log("Dados do import:", importData)

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('https://localhost:44388/api/alunosreposicao/import/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar dados do Excel:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={importData}>Importar Dados</button>
    </div>
  );
};

export default ImportDataFromExcel;
