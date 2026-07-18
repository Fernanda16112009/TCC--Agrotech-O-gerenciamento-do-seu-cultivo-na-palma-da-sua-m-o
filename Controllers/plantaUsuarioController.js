const plantaUsuarioModel = require('../Model/plantaUsuarioModel');

function criarPlantaUsuario(req, res) {
    plantaUsuarioModel.criarPlantaUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar planta.')
        }
        res.redirect('/')
    })
}


module.exports = {
    criarPlantaUsuario
}