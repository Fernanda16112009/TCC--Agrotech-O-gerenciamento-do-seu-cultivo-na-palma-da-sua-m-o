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

function pegarLogin(callback) {
    const sql = `SELECT idUsuario, email, senha, role FROM usuarios`
    conexao.query(sql, callback)
}

function listarUsuarios(callback) {
    const sql = `SELECT * FROM usuarios ORDER BY nome`
    conexao.query(sql, callback)
}

function listarUsuariosID(callback) {
    const sql = `SELECT * FROM usuarios ORDER BY idUsuario`
    conexao.query(sql, callback)
}

function buscarUsuarioPorId(idUsuario, callback) {
    const sql = `SELECT * FROM usuarios WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

function buscarUsuarioPorNome(nome, callback) {
    const sql = `SELECT * FROM usuarios WHERE nome LIKE ? ORDER BY nome`
    conexao.query(sql, [`%${nome}%`], callback)
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

function deletarUsuario(idUsuario, callback) {
    const sql = `DELETE FROM usuarios WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}


module.exports = {
    criarUsuario,
    pegarLogin,
    listarUsuarios,
    listarUsuariosID,
    buscarUsuarioPorId,
    buscarUsuarioPorNome,
    buscarSenhaPorId,    
    buscarIDSenha,
    atualizarUsuario,
    atualizarSenha,
    deletarUsuario
}
