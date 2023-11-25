require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// credentials
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;

// localhost é 8002, pelo deploy render sobreescreve o .env para a porta 3000.
const port = process.env.PORT || 8002;

// connections
mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.6folvza.mongodb.net/db-desafio02`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(function() {
  app.listen(port, function() {
    console.log("Conectou ao banco de dados");
    console.log("Servidor rodando na porta " + port);
  });
})
.catch((err) => console.log(err));

// models
const User = require("./models/User");

// GET index route
app.get("/", function(req, res) {
    res.status(200).json({
        msg: "ENDPOINTS",
        busca: "/user/:id/",
        signin: "/signin/",
        signup: "/signup/"
    });
});

// POST index route
app.post("/", function(req, res) {
    res.status(200).json({
        msg: "ENDPOINTS",
        busca: "/user/:id/",
        signin: "/signin/",
        signup: "/signup/"
    });
});

// GET signup route
app.get("/signup", function(req, res) {
    res.status(200).json(
        { msg: "O método GET não é suportado. Métodos Permitidos: POST" }
    );
});

// POST signup route
app.post("/signup", async function(req, res) {
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
        return res.status(409).json({ mensagem: "E-mail já existente"});
    }

    // password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(senha,salt);

    // dates
    const currentDate = new Date();

    // new user
    const new_user = new User({
        data_atualizacao: currentDate,
        data_criacao: currentDate,
        email,
        nome,
        senha: password_hash,
        telefones,
        ultimo_login: null
    });

    // salva o usuário e exibe o retorno em JSON.
    try {
        const user = await new_user.save();

        // token
        const secret = process.env.SECRET;
        const expira_token = 30 * 60; // 30 minutos em segundos
        const token = jwt.sign(
            {
                id: user._id
            },
            secret,
            { expiresIn: expira_token }
        );

        // retorno dos dados em JSON, não alterar no JSLint
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
app.get("/signin", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método GET não é suportado. Métodos Permitidos: POST" }
    );
});

// POST rota sign in
app.post("/signin", async function(req, res) {

    // verifica email e senha null
    const {email,senha} = req.body;
    if (!email){
        return res.status(422).json({ mensagem: "O e-mail é obrigatório" });
    }
    if (!senha){
        return res.status(422).json({ mensagem: "A senha é obrigatório" });
    }

    try {
        // verifica e-mail e senha.
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json(
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
        const expira_token = 30 * 60; // 30 minutos em segundos
        const token = jwt.sign(
            {
                id: user._id
            },
            secret,
            { expiresIn: expira_token }
        );

        // atualiza e salva as datas
        const current_date = new Date();
        user.data_atualizacao = current_date;
        user.ultimo_login = current_date;
        await user.save();

        // retorno dos dados em JSON, não alterar no JSLint
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
app.get("/user", function(req, res) {
    return res.status(422).json(
        { mensagem: "Informe o ID do Usuário" }
    );
});

// POST busca de registro
app.post("/user/:id", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método POST não é suportado. Métodos Permitidos: GET" }
    );
});

// GET busca de registro
app.get("/user/:id", checkToken, async function(req, res) {
    const id = req.params.id;

    try {
        const user = await User.findById(id, "-senha");

        return res.status(200).json({ user });

    } catch (erro) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
});

// verifica token
function checkToken(req,res,next){
    const bearer_header = req.headers.authorization;
    const token =  bearer_header && bearer_header.split(" ")[1];

    // verifica null ou se tem bearer
    if(!token){
        return res.status(401).json({ mensagem: "Não autorizado" });
    }

    // verificação token
    try{
        const secret =  process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ mensagem: "Sessão expirada" });
        } else {
            return res.status(401).json({ mensagem: "Não autorizado" });
        }
    }
}

// trata endpoint não existente
app.use(function(req, res) {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});

// trata JSON incorreto
app.use(function(err, req, res, next) {
    if (err && err instanceof SyntaxError && (err.status === 400 || err.hasOwnProperty("body"))) {
        res.status(422).json({ erro: "JSON incorreto" });
      } else {
        next();
      }
});