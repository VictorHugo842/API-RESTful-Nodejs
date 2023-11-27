require("dotenv").config();
const express = require("express");
const connection = require("./connection");

const app = express();
app.use(express.json());

// localhost é 8002
// render é 8003 (variable definida no render)
const port = process.env.PORT || 8002;

// connections
connection().then(function () {
    // inicia o servidor após conexão bem-sucedida
    app.listen(port, function () {
        console.log("Servidor rodando na porta " + port);
    });
}).catch((err) => console.error(err));

// trata JSON incorreto
app.use(function(err, req, res, next) {
  if (err && err instanceof SyntaxError && (err.status === 400 || err.hasOwnProperty("body"))) {
      res.status(400).json({ erro: "JSON incorreto" });
    } else {
      next();
    }
});

// middlewares/routes
const home_routes = require("./middlewares/home_route.js");
app.use("/", home_routes);

const signup_route = require("./middlewares/signup_route.js");
app.use("/signup", signup_route);

const signin_route = require("./middlewares/signin_route.js");
app.use("/signin", signin_route);

const user_route = require("./middlewares/user_route.js");
app.use("/user", user_route);

// trata endpoint não existente
const endpoint_erro = require("./middlewares/endpoint_erro");
app.use(endpoint_erro);


module.exports = app;