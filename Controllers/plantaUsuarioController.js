const plantaUsuarioModel = require('../Model/plantaUsuarioModel');


function criarPlantaUsuario(req, res) {
    plantaUsuarioModel.criarPlantaUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar planta.')
        }

        switch (req.body.nomePlanta){

            case "morango":
                res.redirect('/instrucoesPlantas/morango.html');
                break;
            case "cenoura":
                res.redirect('instrucoesPlantas/cenoura.html');
                break;
            case "pepino":
                res.redirect('/instrucoesPlantas/pepino.html');
                break;
            case "tomate":
                res.redirect('/instrucoesPlantas/tomate.html');
                break;
        }
      
        
    })
}


module.exports = {
    criarPlantaUsuario
} 
