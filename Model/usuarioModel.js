const conexao = require('../Config/config')

function criarUsuario(usuario, callback) {
    const sql = `
        INSERT INTO usuarios
        (nome, email, telefone, senha, nome_usuario)
        VALUES (?, ?, ?, ?, ?)
    `
    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.telefone,
        usuario.senha,
        usuario.nome_usuario,
    ], callback)
}

function pegarEmailSenha(callback) {
    const sql = `SELECT email, senha FROM usuarios`
    conexao.query(sql, callback)
}

module.exports = {
    criarUsuario,
    pegarEmailSenha
}