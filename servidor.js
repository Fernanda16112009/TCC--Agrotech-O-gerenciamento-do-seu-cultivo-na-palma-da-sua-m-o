const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

const usuarioRoutes = require('./routes/usuarioRoutes')
const plantasUsuarioRoutes = require('./routes/plantasUsuarioRoutes')
const privadoRoutes = require('./routes/privadoRoutes')
const admRoutes = require('./routes/admRoutes')

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

app.use('/privado', verificarLogin, privadoRoutes);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// Rotas
app.use('/usuarios', usuarioRoutes)

app.use('/planta', plantasUsuarioRoutes)

app.use('/adm', verificarLogin, admRoutes)

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