const conexao = require('../Config/config')

function criarPlantaUsuario(plantausuario,  callback) {
    const sql = `
        
        INSERT INTO plantausuario
        (idUsuario, planta, tipoPlanta, safraNumero, safraNome, quantidade, longitude, latitude, data_plantacao, agrotoxico)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    conexao.query(sql, [
        plantausuario.idUsuario,
        plantausuario.planta,
        plantausuario.tipoPlanta,
        plantausuario.safraNumero,
        plantausuario.safraNome,
        plantausuario.quantidade,
        plantausuario.longitude,
        plantausuario.latitude,
        plantausuario.data_plantacao,
        plantausuario.agrotoxico,
    ], callback)
}

function buscarNumeroSafra(idUsuario, tipoPlanta, callback){
    const sql = `SELECT safraNumero FROM plantausuario WHERE idUsuario = ? AND tipoPlanta = ? ORDER BY safraNumero DESC
LIMIT 1`
    conexao.query(sql, [idUsuario,tipoPlanta], callback)
}

function checarCategoriaPlanta(idUsuario, callback) {
    const sql = `SELECT DISTINCT planta FROM plantausuario WHERE idUsuario = ?
    `
    conexao.query(sql, [idUsuario], callback)
}

function checarCategoriaTipoPlanta(idUsuario, planta, callback) {
    const sql = `SELECT DISTINCT tipoPlanta FROM plantausuario WHERE idUsuario = ? AND planta = ?
    `
    conexao.query(sql, [idUsuario, planta], callback)
}

function buscarSafra(idUsuario, planta, tipoPlanta, callback) {
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ? AND planta = ? AND tipoPlanta = ?`
    conexao.query(sql, [idUsuario, planta, tipoPlanta], callback)
}

function buscarPlantaPorIdPlanta(idUsuario, idPlanta, callback){
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql, [idUsuario,idPlanta], callback)
}

function atualizarSafraNome(safraNome, idUsuario, idPlanta, callback){
        const sql = `
        UPDATE plantausuario
        SET safraNome = ?
        WHERE idUsuario = ?
        AND idPlanta = ?
        `
    console.log(safraNome)
    conexao.query(sql, [
        safraNome,
        idUsuario,
        idPlanta,
    ], callback)
}

function atualizarLocalizacao(localizacao, idUsuario, idPlanta, callback){
        const sql = `
        UPDATE plantausuario
        SET longitude = ?, latitude = ?
        WHERE idUsuario = ?
        AND idPlanta = ?
        `
        console.log(localizacao)
    conexao.query(sql, [
        localizacao.longitude,
        localizacao.latitude,
        idUsuario,
        idPlanta,
    ], callback)
}

function cadastrarAnotacao( anotacao, idUsuario, idPlanta,  callback){
    const sql = `
        UPDATE plantausuario
        SET comentarios = ?
        WHERE idUsuario = ?
        AND idPlanta = ?
        `
    console.log(anotacao)
    conexao.query(sql, [
        anotacao.anotacao,
        idUsuario,
        idPlanta,
    ], callback)
}

function buscarAnotacoes( idUsuario, idPlanta, callback){
    const sql = `SELECT comentarios FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql, [idUsuario,idPlanta], callback)
}

function deletarPlanta(idUsuario, idPlanta, callback) {
    const sql = `DELETE FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql,[idUsuario,idPlanta], callback)
}

module.exports = {
    criarPlantaUsuario,
    buscarNumeroSafra,
    checarCategoriaPlanta,
    checarCategoriaTipoPlanta,
    buscarSafra,   
    buscarPlantaPorIdPlanta,
    atualizarSafraNome,
    atualizarLocalizacao,    
    cadastrarAnotacao,
    buscarAnotacoes,
    deletarPlanta 
}
