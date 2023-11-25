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

// localhost é 8002, pelo deploy render sobreescreve e manda pra porta 8003.
const port = process.env.PORT || 8002;

// connections
mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.6folvza.mongodb.net/dbfinal-desafio02`, {
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

// routes
const home_routes = require("./routes/home_routes.js")
app.use("/",home_routes)

const signup_routes = require("./routes/signup_routes.js")
app.use("/signup",signup_routes)

const signin_routes = require("./routes/signin_routes.js")
app.use("/signin",signin_routes)

const user_routes = require("./routes/user_routes.js")
app.use("/user",user_routes)

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