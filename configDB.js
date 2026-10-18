const { Pool } = require('pg');

// Passa a URL completa direto para o Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Testa a conexão ao iniciar o servidor
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar no PostgreSQL:', err.stack);
  }
  console.log('Conectado ao PostgreSQL com sucesso!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};