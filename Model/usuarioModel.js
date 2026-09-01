const conexao = require('../Config/config')

function criarUsuario(usuario, callback) {
    const sql = `
        INSERT INTO usuarios
        (nome, email, telefone, senha, nome_usuario, role)
        VALUES (?, ?, ?, ?, ?, ?)
    `
    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.telefone,
        usuario.senha,
        usuario.nome_usuario,
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

function buscarNomeUsuario(callback){
    const sql = `SELECT nome_usuario FROM usuarios ORDER BY nome`
    conexao.query(sql, callback)
}

function buscarSenhaPorId(idUsuario, callback) {
    const sql = `SELECT senha FROM usuarios WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

function buscarEmail(callback){
    const sql = `SELECT email FROM usuarios ORDER BY nome`
    conexao.query(sql, callback)
}

function buscarIDSenha(email, callback){
    const sql = `SELECT idUsuario, senha FROM usuarios Where email = ? `
    conexao.query(sql,[email], callback)
}

function atualizarUsuario(idUsuario, usuario, callback) {

    const sql = `
        UPDATE usuarios
        SET nome = ?, email = ?, telefone = ?, nome_usuario = ?
        WHERE idUsuario = ?
    `
    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.telefone,
        usuario.nome_usuario,
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
    buscarNomeUsuario,
    buscarSenhaPorId,    
    buscarEmail,
    buscarIDSenha,
    atualizarUsuario,
    atualizarSenha,
    deletarUsuario
}
