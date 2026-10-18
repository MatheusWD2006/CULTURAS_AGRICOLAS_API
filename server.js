require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importa o arquivo principal de rotas (que já junta RotasPlanta, RotasCultura e RotasManejo)
const routes = require('./routes/rotas');

const app = express();

app.use(cors());
app.use(express.json());

// Registra todas as rotas de uma vez só
app.use(routes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});