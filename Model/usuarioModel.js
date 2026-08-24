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

function pegarLogin(callback) {
    const sql = `SELECT idUsuario, email, senha FROM usuarios`
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


function buscarEmail(callback){
    const sql = `SELECT email FROM usuarios ORDER BY nome`
    conexao.query(sql, callback)
}

function atualizarUsuario(idUsuario, usuario, callback) {

    if(!usuario.senha){
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
    }else{
        const sql = `
            UPDATE usuarios
            SET nome = ?, email = ?, telefone = ?, senha = ?, nome_usuario = ?
            WHERE idUsuario = ?
        `
        conexao.query(sql, [
            usuario.nome,
            usuario.email,
            usuario.telefone,
            usuario.senha,
            usuario.nome_usuario,
            idUsuario
        ], callback)
    }
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
    buscarEmail,
    atualizarUsuario,
    deletarUsuario
}
