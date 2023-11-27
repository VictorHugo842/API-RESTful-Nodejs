require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = require("express").Router();


// GET
router.get("/:id", check_token, async function(req, res) {
    const id = req.params.id;

    try {
        const user = await User.findById(id, "-senha");

        return res.status(200).json({ user });

    } catch (erro) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
});

// POST
router.post("/:id", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método POST não é suportado. Métodos Permitidos: GET" }
    );
});


// DELETE
router.delete("/:id", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: GET" }
    );
});


// PUT
router.put("/:id", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: GET" }
    );
});

// PATCH
router.put("/:id", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método PATCH não é suportado. Métodos Permitidos: GET" }
    );
});


// trata acesso a rota de busca de registro sem id.
router.get("/", function(req, res) {
    return res.status(422).json(
        { mensagem: "Informe o ID do Usuário" }
    );
});

// POST
router.post("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método POST não é suportado. Métodos Permitidos: GET" }
    );
});

// PUT
router.put("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método PUT não é suportado. Métodos Permitidos: GET" }
    );
});

// DELETE
router.delete("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método DELETE não é suportado. Métodos Permitidos: GET" }
    );
});

// PATCH
router.patch("/", function(req, res) {
    return res.status(405).json(
        { mensagem: "O método PATCH não é suportado. Métodos Permitidos: GET" }
    );
});

// verifica token
async function check_token(req,res,next){
    const bearer_header = req.headers.authorization;
    const token =  bearer_header && bearer_header.split(" ")[1];

    // verifica null ou se tem bearer
    if(!token){
        return res.status(401).json({ mensagem: "Não autorizado" });
    }

    // verificação token
    try{
        const secret =  process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        

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
