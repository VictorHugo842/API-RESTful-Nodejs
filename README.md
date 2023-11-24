# Desafio02-APIRestful

## Como Usar

Você pode usar uma plataforma, como por exemplo o Postman, para fazer a execução da API.

Por padrão, o serviço estará disponível na porta 3000 de seu host. Ex: `http://localhost:8900`

### Cadastro de Usuário

Envie um POST para o endpoint `/auth/signup` com um JSON contendo os dados para a criação do usuário.

Exemplo: `http://localhost:3000/auth/signup`

#### JSON para Envio:

```json
{
	"nome":"teste26",
  	"email":"teste@026.com",
  	"senha":"@026",
  	"telefones":[{"numero":"996699427","ddd":"11"}]
}
