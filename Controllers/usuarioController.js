const usuarioModel = require('../Model/usuarioModel');

function criarUsuario(req, res) {
    usuarioModel.criarUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar usuário.')
        }
        res.redirect('/')
    })
}

function logarUsuario(req, res){
    usuarioModel.pegarEmailSenha((erro, loginValor) => {
    if (erro) {
        console.log(erro);
        return send("Erro");
    }

    let usuarioemail = req.body.email
    let usuariosenha = req.body.senha
    let verifica = false

    for (let i in loginValor){

        if(usuarioemail === loginValor[i].email && usuariosenha === loginValor[i].senha){
            verifica = true
            break
        }      
    }
    if(verifica === true){
        res.redirect('/pg_entrar.html')
    }else{
        res.send("Email ou senha incorretos")
    }

});
}


module.exports = {
    criarUsuario,
    logarUsuario

}