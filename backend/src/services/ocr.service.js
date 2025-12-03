const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

exports.extractText = async (filePath) => {
  try {
    // Verificar se é PDF
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      return 'OCR para PDF requer conversão prévia para imagem. Por favor, faça upload de uma imagem (JPG, PNG) da fatura.';
    }
    
    // Para imagens, processar com Tesseract
    const { data: { text } } = await Tesseract.recognize(filePath, 'por');
    return text;
  } catch (error) {
    console.error('Erro no OCR:', error.message);
    return `Erro ao processar arquivo: ${error.message}. Tente fazer upload de uma imagem (JPG ou PNG).`;
  }
};
