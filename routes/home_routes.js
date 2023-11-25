
const router = require("express").Router();

// GET index route
router.get("/", function(req, res) {
    res.status(200).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// POST index route
router.post("/", function(req, res) {
    res.status(200).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// PUT index route
router.put("/", function(req, res) {
    res.status(200).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// DELETE index route
router.delete("/", function(req, res) {
    res.status(200).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

module.exports = router;