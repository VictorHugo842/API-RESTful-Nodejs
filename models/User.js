const mongoose = require("mongoose")

const User = mongoose.model("User", {
    nome:String,
    email:String,
    senha:String,
    telefones:Array,
    data_criacao:Date,
    data_atualizacao:Date,
    ultimo_login:Date
});

module.exports = User;