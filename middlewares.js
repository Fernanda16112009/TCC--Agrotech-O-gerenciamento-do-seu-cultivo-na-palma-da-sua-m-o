function verificarLogin(req, res, next){

    if(req.session.usuario){
        next();
    }else{
        res.redirect('/');
    }

}

function verificarADM(req,res, next){
    if(req.session.usuario.role === "adm"){
        next()
    }else{
        res.redirect('/');
    }
}

function checarHtml(req,res,next){
    if(req.path.toLowerCase().endsWith('html')){
        return res.status(404).send("Não é permitido acessar arquivos html")
    }else{
        next()
    }
}

module.exports = { verificarLogin, verificarADM, checarHtml }