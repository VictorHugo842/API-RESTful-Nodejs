## Desafio02-APIRestful

**Clone este repositório:**
```git clone https://github.com/trezzuri/Desafio02-APIRestful```

**Execute pelo:**
```npm run start```

### Como Usar

Abra o arquivo 

Para utilizar esta API, você pode usar uma plataforma como o Postman para fazer a execução dos endpoints.

Por padrão, o serviço estará disponível na porta 3000 do seu host. Exemplo: `http://localhost:3000`

1. **Criação de Usuário**
   - Método: `POST`
   - Endpoint: `/auth/signup`
   - Exemplo: `http://localhost:3000/auth/signup`
   - JSON para Envio:
     ```json
     {
       "nome": "teste26",
       "email": "teste@026.com",
       "senha": "@026",
       "telefones": [{"numero": "996699427", "ddd": "11"}]
     }
     ```
   - Resposta da API (JSON):
     ```json
     {
       "id": "65610896a1295f112c57f26d",
       "data_criacao": "2023-11-24T20:33:26.788Z",
       "data_atualizacao": "2023-11-24T20:33:26.788Z",
       "ultimo_login": null,
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjEwODk2YTEyOTVmMTEyYzU3ZjI2ZCIsImlhdCI6MTcwMDg1ODAwNn0.VirFZcIlBgeGypPQw9rCn2lY3PfBdwMrA9568s5CiKY"
     }
     ```

2. **Autenticação de Usuário**
   - Método: `POST`
   - Endpoint: `/auth/signin`
   - Exemplo: `http://localhost:3000/auth/signin`
   - JSON para Envio:
     ```json
     {
       "email": "teste@026.com",
       "senha": "@026"
     }
     ```
   - Resposta da API (JSON):
     ```json
     {
       "id": "6560f3031c2b3e23bc41bf6d",
       "data_criacao": "2023-11-24T19:01:23.876Z",
       "data_atualizacao": "2023-11-24T19:17:37.722Z",
       "ultimo_login": "2023-11-24T19:17:37.722Z",
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjBmMzAzMWMyYjNlMjNiYzQxYmY2ZCIsImlhdCI6MTcwMDg1MzQ1N30.554Riqz_Rf5weWei2JSzR1ogo8UBfzwvJglrUNcmopc"
     }
     ```

3. **Buscar Usuário**
   - Método: `GET`
   - Endpoint: `/user/:id`
   - Exemplo: `http://localhost:3000/user/6560f3031c2b3e23bc41bf6d`
   - Header: `Authentication` - Incluir o Bearer Token retornado na autenticação
   - Resposta da API (JSON):
     ```json
     {
       "user": {
         "telefones": [{"numero": "996690427", "ddd": "11"}],
         "_id": "6560eff0e7dc5830c81b9b12",
         "nome": "Victor22",
         "email": "teste@022.com",
         "data_criacao": "2023-11-24T18:48:16.570Z",
         "data_atualizacao": "2023-11-24T18:48:33.161Z",
         "ultimo_login": "2023-11-24T18:48:33.161Z",
         "__v": 0
       }
     }
     ```
