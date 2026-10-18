# API de Gestão Agrícola (Culturas e Manejos)

API RESTful desenvolvida para o gerenciamento de culturas agrícolas e seus respetivos manejos, com foco em validações de datas e consistência das regras de negócio.

## 🚀 Tecnologias Utilizadas

* **Node.js** com **Express**
* **PostgreSQL** (driver `pg`)
* **Nodemon** (ambiente de desenvolvimento)

## 📋 Regras de Negócio e Validações de Datas

* **Padrão Único (ISO):** A API recebe, valida e retorna datas estritamente no formato padrão `YYYY-MM-DD`.
* **Validação Temporal Estrita:** Validações personalizadas impedem a inclusão de datas inválidas no calendário e garantem que a data de colheita seja estritamente posterior à data de plantio.
* **Isolamento de Fuso Horário:** As comparações e validações são feitas em formato puramente textual para evitar desfasamentos causados por fusos horários locais/UTC.

## ⚙️ Como Executar a API

### Pré-requisitos

* Node.js instalado.
* Instância do PostgreSQL em execução, com a base de dados configurada.

### Passos para Execução

**1. Clone o repositório e aceda à pasta do projeto:**

```bash
git clone <URL_DO_REPOSITORIO_API>
cd <NOME_DA_PASTA_API>
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure a conexão com a base de dados:**

Configure a conexão com o PostgreSQL no ficheiro `configDB.js` ou através de um ficheiro `.env`, conforme a implementação do projeto.

**4. Inicie o servidor em modo de desenvolvimento com o Nodemon:**

```bash
npm run start:dev
```
