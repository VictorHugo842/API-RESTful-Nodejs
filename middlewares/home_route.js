const router = require("express").Router();

// GET
router.get("/", function(req, res) {
    res.status(405).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// POST
router.post("/", function(req, res) {
    res.status(405).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// PUT
router.put("/", function(req, res) {
    res.status(405).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// DELETE
router.delete("/", function(req, res) {
    res.status(405).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

// PATCH
router.patch("/", function(req, res) {
    res.status(405).json({
        mensagem: "ENDPOINTS",
        busca: "/user/:id/",
        auth: "/signin/",
        registro: "/signup/"
    });
});

module.exports = router;