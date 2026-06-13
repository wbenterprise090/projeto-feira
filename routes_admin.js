const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verificarAuth } = require('./middleware_auth');

router.post('/salvar-teste', (req, res) => {
  const arquivo = path.join(__dirname, 'historico.json');
  let historico = fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, 'utf8')) : [];
  historico.push({...req.body, id: Date.now(), data: new Date().toISOString()});
  if (historico.length > 200) historico = historico.slice(-200);
  fs.writeFileSync(arquivo, JSON.stringify(historico, null, 2));
  res.json({ sucesso: true });
});

router.get('/dados', verificarAuth, (req, res) => {
  const arquivo = path.join(__dirname, 'historico.json');
  const historico = fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, 'utf8')) : [];
  res.json({ total: historico.length, testes: historico.slice(-50).reverse() });
});

module.exports = router;