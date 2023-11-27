const mongoose = require("mongoose");

const connection = async function () {
  try {

    // credentials
    const db_user = process.env.DB_USER; // .env
    const db_password = process.env.DB_PASS;  // .env

    await mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.6folvza.mongodb.net/dbfinal_apirestful`, {
      useNewUrlParser: true, // para o novo analisador de url do mongoose , define como true.
      useUnifiedTopology: true
    });

    console.log("Conectou ao banco de dados");
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);  // encerra o processo no caso de erro
  }
};

module.exports = connection;