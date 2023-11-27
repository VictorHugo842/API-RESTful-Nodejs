require("dotenv").config();

const router = require("express").Router();

// trata endpoint não existente
router.use(function(req, res) {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});

module.exports = router;