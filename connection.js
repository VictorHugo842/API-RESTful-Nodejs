const mongoose = require("mongoose");

const connection = async function () {
  try {

    // credentials
    const db_user = process.env.DB_USER; // .env
    const db_password = process.env.DB_PASS;  // .env

    // 8002 é definido pelo .env, pelo reader(produção) é definido outro banco de dados
    const db_name = process.env.DB_NAME;  // .env

     // ps parâmetros necessários deve ser criado pelo mongo atlas, e criando o arquivo .env
    await mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.6folvza.mongodb.net/${db_name}`, {
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