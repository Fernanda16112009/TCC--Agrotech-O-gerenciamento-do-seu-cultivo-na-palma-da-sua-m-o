const conexao = require('../Config/config')

function criarUsuario(usuario, callback) {
    const sql = `
        INSERT INTO usuarios
        (nome, email, senha, role)
        VALUES (?, ?, ?, ? )
    `
    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.senha,
        usuario.role
    ], callback)
}

function pegarLogin(email, callback) {
    const sql = `SELECT idUsuario, senha, role FROM usuarios WHERE email = ?`
    conexao.query(sql, [email], callback)
}

function buscarUsuarioPorId(idUsuario, callback) {
    const sql = `SELECT idUsuario, nome, email FROM usuarios WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

function buscarSenhaPorId(idUsuario, callback) {
    const sql = `SELECT senha FROM usuarios WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

function buscarIDSenha(email, callback){
    const sql = `SELECT idUsuario, senha FROM usuarios Where email = ? `
    conexao.query(sql,[email], callback)
}

function atualizarUsuario(idUsuario, usuario, callback) {

    const sql = `
        UPDATE usuarios
        SET nome = ?, email = ?
        WHERE idUsuario = ?
    `
    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        idUsuario
    ], callback)
}

function atualizarSenha(usuario, callback) {
    const sql = `
        UPDATE usuarios
        SET senha = ?
        WHERE idUsuario = ?
    `
    conexao.query(sql, [
        usuario.senha,
        usuario.idUsuario
    ], callback)
}


module.exports = {
    criarUsuario,
    pegarLogin,
    buscarUsuarioPorId,
    buscarSenhaPorId,    
    buscarIDSenha,
    atualizarUsuario,
    atualizarSenha
}
