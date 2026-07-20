const plantaUsuarioModel = require('../Model/plantaUsuarioModel');


function criarPlantaUsuario(req, res) {

    req.body.idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.criarPlantaUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar planta.')
        }

        switch (req.body.nomePlanta){

            case "morango":
                res.redirect('/privado/instrucoesPlantas/morango');
                break;
            case "cenoura":
                res.redirect('/privado/instrucoesPlantas/cenoura');
                break;
            case "pepino":
                res.redirect('/privado/instrucoesPlantas/pepino');
                break;
            case "tomate":
                res.redirect('/privado/instrucoesPlantas/tomate');
                break;
        }
    
        
    })
}


module.exports = {
    criarPlantaUsuario
} 
