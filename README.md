# Desafio02-APIRestful

## Acesso

Para acessar remotamente, a API está implantada e disponível via URL: [https://desafio02-api-restful.onrender.com](https://desafio02-api-restful.onrender.com/)

Para acessar localmente, clone este repositório:

```
git clone https://github.com/VictorHugo842/Desafio02-APIRestful/
```

Por padrão, o serviço estará disponível na porta 8002 do seu host. Por exemplo: `http://localhost:8002`.

## Como Usar

Para utilizar esta API , você pode usar uma plataforma como o Postman para fazer a execução dos endpoints. A API pode ser acessada remotamente e localmente.

**Endpoints:**

1. **Criação de Usuário**

   - Método: `POST`
   - Endpoint: `/signup`
   - Exemplo: `http://localhost:8002/signup` ou `https://desafio02-api-restful.onrender.com/signup`
   - JSON para Envio:

     ```json
     {
       "nome": "teste28",
       "email": "teste@028.com",
       "senha": "@028",
       "telefones": [{"numero": "996699427", "ddd": "11"},
                    {"numero": "48093138", "ddd": "11"}]
     }

     ```
   - Resposta da API (JSON):

     ```json
     {
         "id": "6561616c0693fc15283f3144",
         "data_criacao": "2023-11-25T02:52:28.691Z",
         "data_atualizacao": "2023-11-25T02:52:28.691Z",
         "ultimo_login": null,
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjE2MTZjMDY5M2ZjMTUyODNmMzE0NCIsImlhdCI6MTcwMDg4MDc0OCwiZXhwIjoxNzAwODgyNTQ4fQ.M596QtV_YVQi6xAPRGSvDtems2vzTLWAgubvjXaCUMs"
     }
     ```
   - Erros:

     Status: 422
     Erro: Unprocessable Entity
     Retorno:  ``{ "mensagem": "O nome é obrigatório" }``

     Status: 409
     Erro: Conflict
     Retorno:  ``{ ""mensagem": "E-mail já existente"" }``
2. **Autenticação de Usuário**

   - Método: `POST`
   - Endpoint: `/signin`
   - Exemplo: `http://localhost:8002/signin` ou `https://desafio02-api-restful.onrender.com/signin`
   - JSON para Envio:

     ```json
     {
       "email": "teste@028.com",
       "senha": "@028"
     }
     ```
   - Resposta da API (JSON):

     ```json
     {
         "id": "6561616c0693fc15283f3144",
         "data_criacao": "2023-11-25T02:52:28.691Z",
         "data_atualizacao": "2023-11-25T02:53:59.981Z",
         "ultimo_login": "2023-11-25T02:53:59.981Z",
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjE2MTZjMDY5M2ZjMTUyODNmMzE0NCIsImlhdCI6MTcwMDg4MDgzOSwiZXhwIjoxNzAwODgyNjM5fQ.CzQd9Yi-XmpWusx2YtXTMKoutaN0Rzm2K-MdZ2PkG58"
     }
     ```
   - Erros:

     Status: 400
     Erro: Bad Request
     Retorno:  ``{ "mensagem": "Usuário e/ou senha inválidos" }``

     Status: 401
     Erro: Unauthorized
     Retorno:  ``{ "mensagem": "Usuário e/ou senha inválidos" }``

     Status: 422
     Erro: Unprocessable Entity
     Retorno:  ``{ "mensagem": "O email é obrigatório" }``
3. **Buscar Usuário**

   - Método: `GET`
   - Endpoint: `/user/:id`
   - Exemplo: `http://localhost:8002/user/6561616c0693fc15283f3144` ou `https://desafio02-api-restful.onrender.com/user/6561616c0693fc15283f3144`
   - Header: `Authentication` - Incluir o Bearer Token retornado na autenticação
   - Resposta da API (JSON):

     ```json
     {
         "user": {
             "telefones": [{
                 "numero": "996699427",
                 "ddd": "11"
             }, {
                 "numero": "48093138",
                 "ddd": "11"
             }],
             "_id": "6561616c0693fc15283f3144",
             "data_atualizacao": "2023-11-25T02:53:59.981Z",
             "data_criacao": "2023-11-25T02:52:28.691Z",
             "email": "teste@028.com",
             "nome": "teste28",
             "ultimo_login": "2023-11-25T02:53:59.981Z",
             "__v": 0
         }
     }
     ```
   - Erros:

     Status: 404
     Erro: Not Found
     Retorno:  ``{ "mensagem": ""Usuário não encontrado" }``

     Status: 401
     Erro: Unauthorized
     Retorno:  ``{ "mensagem": "Não autorizado" }`` ou  ``{ "mensagem": "Sessão expirada" }``

## Referências

Node.js, Express, MongoDB, Mongoose, Dotenv, Nodemon, Chai, Chai-HTTP, Mocha (Testes Unitários), JWT (JSON Web Token), Bcrypt, JSHint/JSLint
