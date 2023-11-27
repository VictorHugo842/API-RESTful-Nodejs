require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const router = require("express").Router();

// POST
router.post("/", valida_chaves, async function(req, res) {
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
        console.log(erro);
        res.status(422).json({ erro: "Erro ao registrar o usuário." });
    }
});

//  chaves permitidas no body
const chaves_permitidas = ["nome", "email", "senha", "telefones"];

// validar o body da requisição permitindo apenas as chaves desejadas
function valida_chaves(req, res, next) {
    const chaves_recebidas = Object.keys(req.body);

    // verifica as chaves recebidas, se tiver alguma inválida da o return
    const chaves_invalidas = chaves_recebidas.filter(chave => !chaves_permitidas.includes(chave));

    if (chaves_invalidas.length > 0) {
        return res.status(422).json({ mensagem: `Chaves inválidas no corpo da requisição: ${chaves_invalidas.join(', ')}` });
    }

    next(); // Avança para a próxima função de middleware ou rota
}

// GET
router.get("/", function(req, res) {
    res.status(405).json(
        { mensagem: "O método GET não é suportado. Métodos Permitidos: POST" }
    );
});

// DELETE
router.delete("/", function(req, res) {
    res.status(405).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: POST" }
    );
});


// PUT
router.put("/", function(req, res) {
    res.status(405).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: POST" }
    );
});


// PATCH
router.patch("/", function(req, res) {
    res.status(405).json(
        { mensagem: "O método PATCH não é suportado. Métodos Permitidos: GET" }
    );
});

module.exports = router;