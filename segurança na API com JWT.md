# Segurança na API com JWT

## 1. Criação da tabela para usuários

É necessária a criação de uma tabela para armazenar os dados dos usuários, como o e-mail, a senha e as demais informações utilizadas na autenticação.

Crie a tabela de usuários e insira alguns registros utilizando os comandos SQL abaixo.

### Criação da tabela `usuarios`

```sql
CREATE TABLE usuarios (
    email VARCHAR(50) NOT NULL PRIMARY KEY,
    senha VARCHAR(20) NOT NULL,
    tipo CHAR(1) NOT NULL,
    CHECK (tipo = 'A' OR tipo = 'U'),
    telefone VARCHAR(14) NOT NULL,
    nome VARCHAR(50) NOT NULL
);
```

### Inserção de registros na tabela

```sql
INSERT INTO usuarios (email, senha, tipo, telefone, nome)
VALUES
    ('jorgebavaresco@ifsul.edu.br', '123456', 'A', '(54)99984-4348', 'Jorge Bavaresco'),
    ('joao@ifsul.edu.br', '123456', 'U', '(54)44484-4348', 'Joao');
```

**Tipos de usuário:**

- `A`: Administrador.
- `U`: Usuário.

A restrição `CHECK` garante que o campo `tipo` aceite somente os valores `'A'` ou `'U'`.

---

## 2. Bibliotecas adicionais para a segurança na API

Instale as bibliotecas `jsonwebtoken` e `dotenv-safe` utilizando o seguinte comando no terminal:

```bash
npm i jsonwebtoken dotenv-safe
```

- **jsonwebtoken:** permite gerar e verificar tokens JWT.
- **dotenv-safe:** permite carregar variáveis de ambiente a partir do arquivo `.env` e verificar se as variáveis necessárias estão definidas.

---

## 3. Arquivo `.env` com a chave de criptografia

Crie o arquivo `.env` na raiz da aplicação para armazenar a chave utilizada na assinatura dos tokens JWT.

**Caminho:** `/.env`

Conteúdo:

```text
SECRET=123456
```

Crie também o arquivo `.env.example` na raiz da aplicação, necessário para a utilização do `dotenv-safe`.

**Caminho:** `/.env.example`

Conteúdo:

```text
SECRET=123456
```

> **Observação de segurança:** o valor `123456` é utilizado apenas como exemplo didático. Em uma aplicação real, utilize uma chave secreta forte e mantenha o arquivo `.env` fora do controle de versão do Git.

---

## 4. Entidade `Usuario`

Crie o arquivo `usuario.js` no seguinte caminho:

**Caminho:** `/entities/usuario.js`

```javascript
class Usuario {
    constructor(email, tipo, telefone, nome) {
        this.email = email;
        this.tipo = tipo;
        this.telefone = telefone;
        this.nome = nome;
    }
}

module.exports = Usuario;
```

A classe `Usuario` representa um usuário da aplicação e armazena seu e-mail, tipo, telefone e nome.

---

## 5. Use case de segurança

Crie o arquivo `segurancaUseCases.js` no seguinte caminho:

**Caminho:** `/useCases/segurancaUseCases.js`

```javascript
const { pool } = require('../config');
const Usuario = require('../entities/usuario');

const autenticaUsuarioDB = async (body) => {
    try {
        const { email, senha } = body;

        const results = await pool.query(
            `SELECT * FROM usuarios WHERE email = $1 AND senha = $2`,
            [email, senha]
        );

        if (results.rowCount == 0) {
            throw "Usuário ou senha inválidos";
        }

        const usuario = results.rows[0];

        return new Usuario(
            usuario.email,
            usuario.tipo,
            usuario.telefone,
            usuario.nome
        );
    } catch (err) {
        throw "Erro ao autenticar o usuário: " + err;
    }
};

module.exports = {
    autenticaUsuarioDB
};
```

A função `autenticaUsuarioDB` recebe o e-mail e a senha informados pelo usuário, consulta o banco de dados e verifica se as credenciais correspondem a um registro existente.

Se a autenticação for bem-sucedida, retorna um objeto da classe `Usuario`. Caso contrário, lança um erro.

A consulta utiliza parâmetros (`$1` e `$2`) para evitar a concatenação direta dos valores recebidos na instrução SQL.

---

## 6. Controller de segurança

Crie o arquivo `segurancaController.js` no seguinte caminho:

**Caminho:** `/controllers/segurancaController.js`

```javascript
const { autenticaUsuarioDB } = require('../useCases/segurancaUseCases');

require("dotenv-safe").config();

const jwt = require('jsonwebtoken');

const login = async (request, response) => {
    await autenticaUsuarioDB(request.body)
        .then(usuario => {
            const token = jwt.sign(
                { usuario },
                process.env.SECRET,
                {
                    expiresIn: 300 // expira em 5 minutos
                }
            );

            return response.json({
                auth: true,
                token: token
            });
        })
        .catch(err => {
            response.status(401).json({
                auth: false,
                message: err
            });
        });
};

// Verificação do token
function verificaJWT(request, response, next) {
    const token = request.headers['authorization'];

    if (!token) {
        return response.status(401).json({
            auth: false,
            message: 'Nenhum token recebido.'
        });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            return response.status(401).json({
                auth: false,
                message: 'Erro ao autenticar o token.'
            });
        }

        // Se o token for válido, salva no request para uso posterior
        console.log("Usuario: " + JSON.stringify(decoded.usuario));

        request.usuario = decoded.usuario;

        next();
    });
}

module.exports = {
    login,
    verificaJWT
};
```

### 6.1. Função `login`

A função `login` recebe as credenciais enviadas na requisição e chama `autenticaUsuarioDB` para verificar se o usuário existe no banco de dados.

Se a autenticação for bem-sucedida, gera um token JWT com os dados do usuário. O token possui um tempo de expiração de `300` segundos, equivalente a cinco minutos.

A resposta contém:

- `auth`: indica se a autenticação foi realizada.
- `token`: token JWT gerado para o usuário autenticado.

### 6.2. Função `verificaJWT`

A função `verificaJWT` verifica se a requisição contém um token JWT válido.

O token é recebido pelo cabeçalho HTTP `Authorization`. Caso não exista ou seja inválido ou expirado, a API retorna o status HTTP `401` (Não autorizado).

Se o token for válido, os dados do usuário são armazenados em `request.usuario`, e a função `next()` permite que a execução continue para o próximo middleware ou controller.

---

## 7. Atualização do arquivo `rotas.js`

Atualize o arquivo de rotas principal para incluir a rota de login.

**Caminho:** `/routes/rotas.js`

```javascript
const { Router } = require('express');

const { rotasCategorias } = require('./rotasCategorias');
const { rotasProdutos } = require('./rotasProdutos');
const { login } = require('../controllers/segurancaController');

const rotas = new Router();

rotas.use(rotasCategorias);
rotas.use(rotasProdutos);

// Rota para fazer o login e obter o JWT
rotas.route("/login")
    .post(login);

module.exports = rotas;
```

A rota `/login` utiliza o método HTTP `POST` para receber as credenciais do usuário e retornar um token JWT após a autenticação.

As rotas de categorias e produtos continuam sendo registradas no roteador principal.

---

## 8. Proteção das demais rotas da API

Nos arquivos das outras rotas da API, adicione a função `verificaJWT` para verificar se a requisição contém um token JWT válido antes de executar a operação solicitada.

Os exemplos abaixo apresentam a proteção das rotas de categorias e produtos.

**Caminho:** `/routes/rotasCategorias.js`

```javascript
const { Router } = require('express');

const {
    getCategorias,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoriaPorCodigo
} = require('../controllers/categoriaController');

const {
    verificaJWT
} = require('../controllers/segurancaController');

const rotasCategorias = new Router();

rotasCategorias.route('/categoria')
    .get(verificaJWT, getCategorias)
    .post(verificaJWT, addCategoria)
    .put(verificaJWT, updateCategoria);

rotasCategorias.route('/categoria/:codigo')
    .delete(verificaJWT, deleteCategoria)
    .get(verificaJWT, getCategoriaPorCodigo);

module.exports = { rotasCategorias };
```

**Caminho:** `/routes/rotasProdutos.js`

```javascript
const { Router } = require('express');

const {
    getProdutos,
    addProduto,
    updateProduto,
    deleteProduto,
    getProdutoPorCodigo
} = require('../controllers/produtoController');

const {
    verificaJWT
} = require('../controllers/segurancaController');

const rotasProdutos = new Router();

rotasProdutos.route('/produto')
    .get(verificaJWT, getProdutos)
    .post(verificaJWT, addProduto)
    .put(verificaJWT, updateProduto);

rotasProdutos.route('/produto/:codigo')
    .delete(verificaJWT, deleteProduto)
    .get(verificaJWT, getProdutoPorCodigo);

module.exports = { rotasProdutos };
```

### 8.1. Funcionamento da proteção

A função `verificaJWT` é adicionada antes de cada controller nas rotas protegidas.

Dessa forma, a requisição somente prossegue se o token for válido.

Todas as operações de categoria e produto são protegidas:

| Método HTTP | Rota | Operação |
|---|---|---|
| `GET` | `/categoria` | Listar categorias |
| `POST` | `/categoria` | Adicionar categoria |
| `PUT` | `/categoria` | Atualizar categoria |
| `DELETE` | `/categoria/:codigo` | Excluir categoria |
| `GET` | `/categoria/:codigo` | Buscar categoria por código |
| `GET` | `/produto` | Listar produtos |
| `POST` | `/produto` | Adicionar produto |
| `PUT` | `/produto` | Atualizar produto |
| `DELETE` | `/produto/:codigo` | Excluir produto |
| `GET` | `/produto/:codigo` | Buscar produto por código |

O middleware é executado antes da função responsável pela operação. Caso a verificação falhe, a API retorna o status `401` e interrompe o processamento da requisição.

---

## 9. Resumo do funcionamento da autenticação JWT

O processo de autenticação e autorização da API ocorre da seguinte forma:

1. O usuário envia seu e-mail e sua senha para a rota `/login`.
2. A API consulta o banco de dados e verifica as credenciais.
3. Se os dados forem válidos, a API gera um token JWT.
4. O cliente utiliza o token nas próximas requisições, enviando-o no cabeçalho `Authorization`.
5. O middleware `verificaJWT` valida o token antes de permitir o acesso às rotas protegidas.
6. Se o token for inválido ou estiver expirado, a API retorna o status HTTP `401`.

**Importante:** a verificação do JWT comprova que o token é válido, mas não implementa, por si só, o controle de permissões. Para restringir operações a administradores, por exemplo, também é necessário verificar o tipo de usuário (`tipo`) em um middleware de autorização.

Além disso, em aplicações reais, as senhas devem ser armazenadas com hash seguro, como o gerado pelo `bcrypt`, e nunca em texto puro.
