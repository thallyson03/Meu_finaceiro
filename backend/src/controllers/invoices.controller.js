const prisma = require('../lib/prismaClient');
const ocrService = require('../services/ocr.service');
const fs = require('fs');

exports.upload = async (req, res, next) => {
  try {
    const { path } = req.file;
    const rawText = await ocrService.extractText(path);
    const rec = await prisma.invoiceUpload.create({ data: { userId: req.userId, path, rawText } });

    // Nota: aqui poderia ocorrer o parse específico da fatura para gerar transações automáticas.
    res.json({ id: rec.id, rawText });
  } catch (err) { next(err); }
};
