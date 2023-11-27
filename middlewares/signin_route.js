require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = require("express").Router();

// POST
router.post("/",valida_chaves, async function(req, res) {

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

// GET
router.get("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método GET não é suportado. Métodos Permitidos: POST" }
    );
});


// PUT
router.delete("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: POST" }
    );
});


// DELETE
router.put("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: POST" }
    );
});


// PATCH
router.patch("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método PATCH não é suportado. Métodos Permitidos: GET" }
    );
});

//  chaves permitidas no body
const chaves_permitidas = ["email", "senha"];

// validar o body da requisição permitindo apenas as chaves desejadas
function valida_chaves(req, res, next) {
    const chaves_recebidas = Object.keys(req.body);

    // verifica as chaves recebidas, se tiver , da o erro.
    const chaves_invalidas = chaves_recebidas.filter(chave => !chaves_permitidas.includes(chave));

    if (chaves_invalidas.length > 0) {
        return res.status(400).json({ mensagem: `Chaves inválidas no corpo da requisição: ${chaves_invalidas.join(', ')}` });
    }

    next(); 
}

module.exports = router;