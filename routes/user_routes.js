require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const router = require("express").Router();

// trata acesso a rota de busca de registro sem id.
router.get("/", function(req, res) {
    return res.status(422).json(
        { mensagem: "Informe o ID do Usuário" }
    );
});


// GET busca de registro
router.get("/:id", check_token, async function(req, res) {
    const id = req.params.id;

    try {
        const user = await User.findById(id, "-senha");

        return res.status(200).json({ user });

    } catch (erro) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
});

// POST busca de registro
router.post("/:id", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método POST não é suportado. Métodos Permitidos: GET" }
    );
});


// DELETE busca de registro
router.delete("/:id", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: GET" }
    );
});


// PUT busca de registro
router.put("/:id", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: GET" }
    );
});

router.post("/", function(req, res) {
    return res.status(200).json(
        { mensagem: "O método POST não é suportado. Métodos Permitidos: GET" }
    );
});

router.put("/", function(req, res) {
    return res.status(422).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: GET" }
    );
});

router.delete("/", function(req, res) {
    return res.status(422).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: GET" }
    );
});

// verifica token
function check_token(req,res,next){
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

module.exports = router;
