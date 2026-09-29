# Desabafo Anônimo

![Versão](https://img.shields.io/badge/Versão-1.0.0-blue?style=flat-square)

O Desabafo Anônimo é um site que fornece um espaço seguro para as pessoas expressarem seus sentimentos, serem elas mesmas sem receios e se sentirem apoiadas.

Você pode acessar o site aqui: [www.desabafoanonimo.com.br]("https://www.desabafoanonimo.com.br")

### Conteúdo

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
  - [Disponíveis](#funcionalidades-disponiveis)
  - [Em Desenvolvimento](#funcionalidades-em-desenvolvimento)
- [API](#api)
  - [Obter Informações Sobre o Serviço](#info-sobre-servico)
  - [Listar Desabafos](#listar-desabafos)
  - [Registrar Desabafo](#registrar-desabafo)
  - [Registrar Apoio](#registrar-apoio)
- [Instalação Local](#instalacao-local)
  - [Como Executar o Projeto](#como-executar-o-projeto)
  - [Como Executar os Testes](#como-executar-os-testes)
- [Licença](#licença)
- [Contato com o Criador](#contato-com-o-criador)

<a id="tecnologias-utilizadas"></a>

## Tecnologias utilizadas

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/) [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/) [![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/) [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Prisma](https://img.shields.io/badge/Prisma-%230C344D.svg?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)](https://ai.google.dev/) [![Vitest](https://img.shields.io/badge/Vitest-%23FFA500.svg?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

<a id="funcionalidades"></a>

## Funcionalidades

<a id="funcionalidades-disponiveis"></a>

### Disponíveis

- **Registrar Desabafo:** Registre um novo desabafo anônimo com opção de acolhimento inicial por IA;
- **Listar Desabafos:** Visualize o feed com design moderno estilo Google/Material 3, carregamento progressivo e proteção a conteúdos sensíveis;
- **Registrar Apoio:** Demonstre carinho e apoio ao desabafo de outro usuário com atualização instantânea (otimista) no Redux;
- **Mensagens de Apoio (Comentários):** Deixe palavras gentis e acolhedoras para quem desabafou;
- **Modo Claro / Modo Escuro (Dark Mode):** Alterne visualmente entre o tema claro e escuro acolhedor, com persistência automática de preferência;
- **Canal de Apoio Emocional Emergencial (CVV 188):** Acesso rápido e em destaque em toda a plataforma.

<a id="api"></a>

## API

<a id="info-sobre-servico"></a>

- GET `/api/v1/status`

  **Descrição:** <br/>
  Retorna informações sobre a disponibilidade do serviço

  **Resposta:** <br/>

  ```json
  {
    "updated_at": "2024-11-22T15:47:03.150Z",
    "database": {
      "version": "16.5",
      "max_connections": 112,
      "opened_connections": 2
    }
  }
  ```

  <hr/>

<a id="listar-desabafos"></a>

- GET `/api/v1/unburden`

  **Descrição:** <br/>
  Retorna lista de desabafos cadastrados

  **Resposta:** <br/>

  ```json
  {
    "unburdens": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "created_at": "string",
        "supports_amount": "number"
      }
    ]
  }
  ```

  <hr/>

<a id="registrar-desabafo"></a>

- POST `/api/v1/unburden`

  **Descrição:** <br/>
  Registrar um novo desabafo

  **Resposta:** <br/>

  ```json
  {
    "title": "string",
    "content": "string",
    "created_at": "string",
    "supports_amount": "number"
  }
  ```

  **Body:** <br/>

  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```

  <hr/>

<a id="registrar-apoio"></a>

- POST `/api/v1/support`

  **Descrição:** <br/>
  Registrar um novo apoio para um desabafo registrado

  **Resposta:** <br/>

  ```json
  {
    "id": "string",
    "unburdenId": "string"
  }
  ```

  **Body:** <br/>

  ```json
  {
    "unburdenId": "string"
  }
  ```

  <hr/>

<a id="instalacao-local"></a>

## Instalação Local

### Requisítos

- **Nodejs** ^20.0.0
- **Docker** ^27.3.1
- **Docker compose** ^2.29.7
<hr/>

<a id="como-executar-o-projeto"></a>

### Como executar o projeto

Para rodar o projeto localmente é super simples, basta abrir o terminal do seu computador e seguir o passo a passo abaixo:

**Clone o repositório:**

```bash
git clone https://github.com/ygorevaldt/desabafo-anonimo.git
```

**Instale as dependências:**

```bash
npm install
```

**Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Abra o navegador e acesse http://localhost:3000.

<a id="como-executar-os-testes"></a>

### Como executar os testes

Para executar os testes, utilize os scripts disponíveis no arquivo `package.json` localizado na raiz do projeto

**Exemplos:**

Executar todos os testes

```bash
npm run test
```

Manter testes executando

```bash
npm run test:watch
```

Executar testes e gerar relatório de cobertura de código

```bash
npm run test:coverage
```

Executa os testes e disponibiliza interface de usuário para análise

```bash
npm run test:ui
```

<a id="licenca"></a>

## Licença

Este projeto está licenciado sob a MIT License.

<a id="contato-com-o-criador"></a>

## Contato com o criador

Se você tiver dúvidas, sugestões de melhorias ou evidências de bugs para este projeto, por favor, não deixe de entrar em contato através do e-mail abaixo:

[evaldtygor@gmail.com]("evaldtygor@gmail.com")
