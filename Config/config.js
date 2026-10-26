require('dotenv').config()
const mysql = require('mysql2')

if (!process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error('Defina DB_USER e DB_NAME no .env')
}

const conexao = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
})

// Teste de conexão na inicialização (substitui o antigo conexao.connect)
conexao.getConnection((erro, conexaoTeste) => {
    if (erro) {
        console.log('Erro ao conectar ao banco:', erro)
        return
    }

    console.log('Banco conectado com sucesso!')
    conexaoTeste.release()
})

module.exports = conexao