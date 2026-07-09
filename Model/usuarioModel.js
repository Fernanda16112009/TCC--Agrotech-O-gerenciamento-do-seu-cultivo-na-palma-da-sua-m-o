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
function listarUsuarios(callback) {
    const sql = `SELECT * FROM usuarios ORDER BY nome`
    conexao.query(sql, callback)
}

function buscarUsuarioPorId(codigo, callback) {
    const sql = `SELECT * FROM usuarios WHERE codigo = ?`
    conexao.query(sql, [codigo], callback)
}

function buscarUsuarioPorNome(nome, callback) {
    const sql = `SELECT * FROM usuarios WHERE nome LIKE ? ORDER BY nome`
    conexao.query(sql, [`%${nome}%`], callback)
}

function atualizarUsuario(id, usuario, callback) {
    const sql = `
        UPDATE usuarios
        SET nome = ?, email = ?, telefone = ?, senha = ?, nome_usuario = ?
        WHERE codigo = ?
    `
    conexao.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.telefone,
        usuario.senha,
        usuario.nome_usuario,
        codigo
    ], callback)
}

function deletarUsuario(codigo, callback) {
    const sql = `DELETE FROM usuarios WHERE codigo = ?`
    conexao.query(sql, [codigo], callback)
}

module.exports = {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorNome,
    atualizarUsuario,
    deletarUsuario
}