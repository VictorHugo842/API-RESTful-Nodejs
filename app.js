require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()) ;
 

// credentials 
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;

const port = process.env.PORT || 3000;

// connections
mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.6folvza.mongodb.net/db-desafio02`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(port, () => {
    console.log("Conectou no banco");
    console.log("Servidor rodando na porta 3000");
  });
})
.catch((err) => console.log(err));

// models
const User = require("./models/User");

// GET index route
app.get("/", function(req, res) {
    res.status(200).json({ 
        msg: "Desafio 02 - ENDPOINTS",
        signup: "/auth/signup/",
        signin: "/auth/signin/",
        busca: "/user/:id/",
    });
});

// POST index route
app.post("/", function(req, res) {
    res.status(200).json({ 
        msg: "Desafio 02 - ENDPOINTS",
        signup: "/auth/signup/",
        signin: "/auth/signin/",
        busca: "/user/:id/",
    });
});

// GET signup route
app.get("/auth/signup", function(req, res) {
    res.status(200).json({ msg: "O método GET não é suportado. Métodos Permitidos: POST" });
});

// POST signup route
app.post("/auth/signup", async function(req, res) {
    const { email, nome, senha, telefones } = req.body;

    // verifica se todos os dados estão preenchidos
    if (!nome){
        return res.status(422).json({ mensagem: "O nome é obrigatório" });
    }
    if (!email){
        return res.status(422).json({ mensagem: "O e-mail é obrigatório" });
    }
    if (!senha){
        return res.status(422).json({ mensagem: "A senha é obrigatório" });
    }
    if (!telefones){
        return res.status(422).json({ mensagem: "O telefone é obrigatório" });
    }

    // verifica e-mail existente
    const email_exists = await User.findOne({ email: email });
    if (email_exists) {
        return res.status(422).json({ mensagem: "E-mail já existente"});
    }

    // password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(senha,salt);

    // dates
    const currentDate = new Date();

    // new user
    const new_user = new User({
        nome,
        email,
        senha: password_hash,
        telefones,
        data_criacao: currentDate,
        data_atualizacao: currentDate,
        ultimo_login: null
    });

    // salva o usuário e exibe o retorno em JSON.
    try {
        const user = await new_user.save();

        // token
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret
        );

        // retorno dos dados
        const response = {
            id: user._id,
            data_criacao:user.data_criacao,
            data_atualizacao:user.data_atualizacao,
            ultimo_login:user.ultimo_login,
            token: token
        };
        return res.status(200).json(response);
    } catch (erro) {
        res.status(422).json({ erro: "Erro ao registrar o usuário." });
    }
});

// GET rota sign in
app.get("/auth/signin", async function(req, res) {
    return res.status(200).json({ mensagem: "O método GET não é suportado. Métodos Permitidos: POST" });
});

// POST rota sign in
app.post("/auth/signin", async (req, res) => {

    // verifica email e senha null
    const {email,senha} = req.body;
    if (!email){
        return res.status(422).json({ mensagem: "O e-mail é obrigatório" });
    }
    if (!senha){
        return res.status(422).json({ mensagem: "A senha é obrigatória" });
    }

    try {
        // verifica e-mail e senha.
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(422).json(
                { mensagem: "Usuário e/ou senha inválidos" }
            );
        }

        const senha_valida = await bcrypt.compare(senha, user.senha);
        if (!senha_valida) {
            return res.status(401).json(
                { mensagem: "Usuário e/ou senha inválidos" }
            );
        }

        // token
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret
        );

        // atualiza e salva as datas
        const current_date = new Date();
        user.data_atualizacao = current_date;
        user.ultimo_login = current_date;
        await user.save();

        // retorno dos dados em JSON
        const response = {
            id: user._id,
            data_criacao:user.data_criacao,
            data_atualizacao:user.data_atualizacao,
            ultimo_login:user.ultimo_login,
            token: token
        };
        return res.status(200).json(response);

    } catch (error) {
        return res.status(422).json({ mensagem: error.message });
    }

});

// trata acesso a rota de busca de registro sem id.
app.get("/user", async function(req, res) {
    return res.status(422).json(
        { mensagem: "Informe o ID do Usuário por parâmetro" }
    );
});

// POST busca de registro
app.post("/user/:id", async function(req, res) {
    return res.status(200).json({ mensagem: "O método POST não é suportado. Métodos Permitidos: GET" });
});

// GET busca de registro
app.get("/user/:id",checkToken, async function(req, res) {
    const id = req.params.id;

    try {
        const user = await User.findById(id, "-senha");

        return res.status(200).json({ user });

    } catch (erro) {
        return res.status(422).json({ mensagem: "ID do Usuário Inválido" });
    }

});

// verifica token
function checkToken(req,res,next){
    const authHeader = req.headers["authorization"];
    const token =  authHeader && authHeader.split(" ")[1];
    // verifica null
    if(!token){
        return res.status(404).json({ mensagem: "Token Inválido" });
    }

    // verificação token
    try{
        const secret =  process.env.SECRET;
        jwt.verify(token, secret);
        next();
    }catch(erro){
        return res.status(404).json({ mensagem: "Token Inválido" });
    }
}

// trata endpoint não existente
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});

// trata JSON incorreto
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {

      res.status(422).json({ erro: "JSON incorreto" });
    } else {
      next();
    }
});