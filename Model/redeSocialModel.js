const conexao = require('../Config/config')

function criarPost(post,  callback) {

    if(post.imagem){
        const sql = `
            INSERT INTO postagem
            (idUsuario, tipoPlanta, imagem, post)
            VALUES (?, ?, ?, ?)
        `
        conexao.query(sql, [
            post.idUsuario,
            post.tipoPlanta,
            post.imagem,
            post.post,
        ], callback)
    }else{
        const sql = `
            INSERT INTO postagem
            (idUsuario, tipoPlanta, post)
            VALUES (?, ?, ?)
        `
        conexao.query(sql, [
            post.idUsuario,
            post.tipoPlanta,
            post.post,
        ], callback)
    }
    

}

function pegarPosts (callback){
    const sql = `SELECT * FROM postagem `
    conexao.query(sql, callback)
}

function pegarNomeUsuarioPorID(idUsuario) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT nome_usuario FROM usuarios WHERE idUsuario = ?`

        conexao.query(sql, [idUsuario], (erro, resultado) => {
            
            if (erro) {
                reject(erro);
            } else {
                resolve(resultado);
            }
        });
    });
}

function pegarComentarios(idPostagem, callback){
    const sql = `SELECT idUsuario, imagem, comentario, dataComentario FROM comentarios WHERE idPostagem = ?`
    conexao.query(sql, [idPostagem], callback)
}

function comentar( comentario, callback){

    if(comentario.imagem){
        const sql = `
        INSERT INTO comentarios
        (idPostagem, idUsuario, imagem, comentario)
        VALUES (?, ?, ?, ?)
    `
    conexao.query(sql, [
        comentario.idPostagem,
        comentario.idUsuario,
        comentario.imagem,
        comentario.comentario,
    ], callback)
    }else{
        const sql = `
        INSERT INTO comentarios
        (idPostagem, idUsuario, comentario)
        VALUES (?, ?, ?)
    `
    conexao.query(sql, [
        comentario.idPostagem,
        comentario.idUsuario,
        comentario.comentario,
    ], callback)
    }
}


module.exports = {
    criarPost,
    pegarPosts,
    pegarNomeUsuarioPorID,
    pegarComentarios,
    comentar
}

