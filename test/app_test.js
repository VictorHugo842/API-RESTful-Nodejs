const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");

chai.use(chaiHttp);


// testa conexão com banco de dados
describe("Testes da API Restful", function() {

  // testa conexão com banco de dados
  it("Conexão com o banco de dados", function(done) {
    chai.request(app)
      .get("/") // testa com o endpoint "/"
      .end(function(err, res) {
        expect(res).to.have.status(200); // deve retornar 200
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
  
});