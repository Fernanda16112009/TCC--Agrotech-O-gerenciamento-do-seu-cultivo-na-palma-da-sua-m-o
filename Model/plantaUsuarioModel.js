const conexao = require('../Config/config')

function criarPlantaUsuario(plantausuario,  callback) {
    const sql = `
        
        INSERT INTO plantausuario
        (idUsuario, tipoPlanta, nomePlanta, quantidade, longitude, latitude, data_plantacao, agrotoxico)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    conexao.query(sql, [
        plantausuario.idUsuario,
        plantausuario.tipoPlanta,
        plantausuario.nomePlanta,
        plantausuario.quantidade,
        plantausuario.longitude,
        plantausuario.latitude,
        plantausuario.data_plantacao,
        plantausuario.agrotoxico,
    ], callback)
}

function cadastrarAnotacao( anotacao, idUsuario, idPlanta,  callback){
    const sql = `
        UPDATE plantausuario
        SET anotacao = ?
        WHERE idUsuario = ?
        AND idPlanta = ?
        `

    conexao.query(sql, [
        anotacao.anotacao,
        idUsuario,
        idPlanta,
    ], callback)
}

function listarPlantas(callback) { // Só será usado no ADM
    const sql = `SELECT * FROM plantausuario ORDER BY nomePlanta`
    conexao.query(sql, callback)
}

function buscarPlantaPorUsuario(idUsuario, callback) {
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ?`
    conexao.query(sql, [idUsuario], callback)
}

function buscarPlantaPorIdPlanta(idUsuario, idPlanta, callback){
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql, [idUsuario,idPlanta], callback)
}

function buscarPlantaPorNome(idUsuario,nomePlanta, callback) {
    const sql = `SELECT * FROM plantausuario WHERE idUsuario = ? AND nomePlanta LIKE ? ORDER BY nomePlanta`
    conexao.query(sql, [idUsuario,`%${nomePlanta}%`], callback)
}

function buscarAnotacoes(idUsuario, idPlanta, callback){
    const sql = `SELECT anotacao FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql, [idUsuario,idPlanta], callback)
}


function deletarPlanta(idUsuario, idPlanta, callback) {
    const sql = `DELETE FROM plantausuario WHERE idUsuario = ? AND idPlanta = ?`
    conexao.query(sql,[idUsuario,idPlanta], callback)
}
module.exports = {
    criarPlantaUsuario,
    cadastrarAnotacao,
    listarPlantas,
    buscarPlantaPorUsuario,
    buscarPlantaPorIdPlanta,
    buscarPlantaPorNome,
    deletarPlanta,
    buscarAnotacoes
    
}