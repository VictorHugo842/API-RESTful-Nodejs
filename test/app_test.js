const chai = require("chai");
const expect = chai.expect;
const app = require("../app");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);


// testes unitários
describe("Testes da API Restful", function() {

  // testa conexão com banco de dados
  it("Conexão com o banco de dados", function(done) {
    chai.request(app)
      .get("/") // testa com o endpoint "/"
      .end(function(err, res) {
        expect(res).to.have.status(200); // deve retornar 200
        console.log(res.body);
        done();
      });
  });

   // testa rota de sign up
    it("Envio de JSON para rota sign up", function(done) {
      chai.request(app)
        .post("/signup")
        .send({
          nome: "teste01",
          email: "teste@01.com",
          senha: "@01",
          telefones: [{"numero": "997699427", "ddd": "11"},
                       {"numero": "48293138", "ddd": "11"}]
        }
        )
        .end(function(err, res) {
          //expect(res).to.have.status(200);
          console.log("JSON de retorno SIGN UP", res.body);
          done();
        });
  });

  // testa rota de sign in
  it("Envio de JSON para rota sign in", function(done) {
    chai.request(app)
      .post("/signin")
      .send({ email: "admin@admin.com", senha: "@admin" })
      .end(function(err, res) {
        //expect(res).to.have.status(200);
        console.log("JSON de retorno SIGN IN:", res.body);
        done();
      });
  });

    // testa rota de sign in e user
    it("Envio de JSON para rota sign in e busca de registro com o token", function(done) {
      chai.request(app)
        .post("/signin")
        .send({ email: "admin@admin.com", senha: "@admin" })
        .end(function(err, res) {
          console.log("JSON de retorno SIGN IN:", res.body);

          // tenta fazer a busca de registro utilizando o token retornado
          if(res.status === 200){
            const auth_token = res.body.token;
            chai.request(app)
              .get("/user/" + res.body.id)
              .set("Authorization", `Bearer ${auth_token}`)
              .end(function(err, response) {
                console.log("JSON de retorno USER", response.body);
                done();
              });
          }

        });
    });
});