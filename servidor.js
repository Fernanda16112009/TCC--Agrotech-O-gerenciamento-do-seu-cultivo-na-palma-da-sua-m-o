const express = require('express')
const path = require('path')
const session = require('express-session')
require('dotenv').config();



const usuarioRoutes = require('./routes/usuarioRoutes')
const plantasUsuarioRoutes = require('./routes/plantasUsuarioRoutes')
const privadoRoutes = require('./routes/privadoRoutes')
const admRoutes = require('./routes/admRoutes')
const usuarioRoutesPrivado = require('./routes/usuarioPrivadoRoutes')
const trocarSenhaRoutes = require('./routes/trocarSenhaRoutes')
const calendarioRoutes = require('./routes/calendarioRoutes')

const app = express()
const port = 8000

if(!process.env.SESSION_SECRET){
    throw new Error("Defina um secret no .env")
}
// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}
))

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
// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))
app.use('/trocarSenha', checarHtml, express.static(path.join(__dirname, 'trocarSenha')))
app.use('/privado', verificarLogin,  express.static(path.join(__dirname, 'recursosPrivados')))

// Rotas
app.use('/usuarios', usuarioRoutes)

app.use('/priUsuarios', verificarLogin, usuarioRoutesPrivado)

app.use('/planta', verificarLogin, plantasUsuarioRoutes)

app.use('/adm', verificarLogin, verificarADM, admRoutes)

app.use('/privado', verificarLogin, privadoRoutes);

app.use('/calendario', verificarLogin, calendarioRoutes);

app.use('/trocarSenha', trocarSenhaRoutes);


// Página inicial

app.get('/', (req, res) => {
    if(req.session.usuario){
        res.sendFile(path.join(__dirname, 'privado', 'pg_entrar.html'))
    }else{
    res.sendFile(path.join(__dirname, 'public', 'pg_inicial.html'))
    }
})

// Inicialização
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})