require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const router = require("express").Router();

// POST rota sign in
router.post("/", async function(req, res) {

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

// GET rota sign in
router.get("/", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método GET não é suportado. Métodos Permitidos: POST" }
    );
});


// PUT rota sign in
router.delete("/", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: POST" }
    );
});


// DELETE rota sign in
router.put("/", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: POST" }
    );
});


module.exports = router;
