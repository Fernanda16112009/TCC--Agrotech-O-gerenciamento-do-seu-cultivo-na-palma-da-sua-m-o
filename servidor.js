const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const { Resend } = require('resend');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2;


const usuarioRoutes = require('./routes/usuarioRoutes')
const plantasUsuarioRoutes = require('./routes/plantasUsuarioRoutes')
const privadoRoutes = require('./routes/privadoRoutes')
const admRoutes = require('./routes/admRoutes')
const usuarioRoutesPrivado = require('./routes/usuarioPrivadoRoutes')
const trocarSenhaRoutes = require('./routes/trocarSenhaRoutes')
const calendarioRoutes = require('./routes/calendarioRoutes')

const app = express()
const port = 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({secret:'1234'}))
app.use(bodyParser.urlencoded({extended:true}))

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

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))
app.use('/trocarSenha', express.static(path.join(__dirname, 'trocarSenha')))
app.use('/privado', verificarLogin, express.static(path.join(__dirname, 'privado')))

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