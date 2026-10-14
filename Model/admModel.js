const conexao = require('../Config/config')

function listarUsuarios(callback) {
    const sql = `SELECT idUsuario, nome, email FROM usuarios ORDER BY nome`
    conexao.query(sql, callback)
}

function listarUsuariosID(callback) {
    const sql = `SELECT idUsuario, nome, email FROM usuarios ORDER BY idUsuario`
    conexao.query(sql, callback)
}

function buscarUsuarioPorNome(nome, callback) {
    const sql = `SELECT idUsuario, nome, email FROM usuarios WHERE nome LIKE ? ORDER BY nome`
    conexao.query(sql, [`%${nome}%`], callback)
}

function deletarUsuario(idUsuario, callback) {
    const sql = `DELETE FROM usuarios WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

module.exports = {
    listarUsuarios,
    listarUsuariosID,
    buscarUsuarioPorNome,
    deletarUsuario
}