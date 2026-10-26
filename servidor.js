const express = require('express')
const path = require('path')
const session = require('express-session')
require('dotenv').config();
const middleware = require('./middlewares')




const usuarioRoutes = require('./routes/usuarioRoutes')
const plantasUsuarioRoutes = require('./routes/plantasUsuarioRoutes')
const privadoRoutes = require('./routes/privadoRoutes')
const admRoutes = require('./routes/admRoutes')
const usuarioRoutesPrivado = require('./routes/usuarioPrivadoRoutes')
const trocarSenhaRoutes = require('./routes/trocarSenhaRoutes')
const calendarioRoutes = require('./routes/calendarioRoutes')

const app = express()
const port = process.env.PORT || 8000

if(!process.env.SESSION_SECRET){
    throw new Error("Defina um secret no .env")
}
// Middleware
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    req.body ??= {};
    next();
});
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}
))

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))
app.use('/trocarSenha', middleware.checarHtml, express.static(path.join(__dirname, 'trocarSenha')))
app.use('/privado', middleware.verificarLogin,  express.static(path.join(__dirname, 'recursosPrivados')))

// Rotas
app.use('/usuarios', usuarioRoutes)

app.use('/priUsuarios', middleware.verificarLogin, usuarioRoutesPrivado)

app.use('/planta', middleware.verificarLogin, plantasUsuarioRoutes)

app.use('/adm', middleware.verificarLogin, middleware.verificarADM, admRoutes)

app.use('/privado', middleware.verificarLogin, privadoRoutes);

app.use('/calendario', middleware.verificarLogin, calendarioRoutes);

app.use('/trocarSenha', trocarSenhaRoutes);


// Página inicial

app.get('/', (req, res) => {
    if(req.session.usuario){
        res.sendFile(path.join(__dirname, 'privado', 'pg_entrar.html'))
    }else{
    res.sendFile(path.join(__dirname, 'public', 'pg_inicial.html'))
    }
})

// 404: chega aqui quando nenhuma rota anterior respondeu
app.use((req, res) => {
    res.status(404).send('Página não encontrada')
})

// Erros: precisa ter 4 parâmetros e ser o último app.use
app.use((err, req, res, next) => {
    console.error(err)

    if (res.headersSent) {
        return next(err)
    }

    if (err.name === 'MulterError') {
        const mensagem = err.code === 'LIMIT_FILE_SIZE'
            ? 'A imagem não pode passar de 5 MB.'
            : 'Erro ao enviar o arquivo.'
        return res.status(400).send(mensagem)
    }

    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
        ? err.status
        : 500

    res.status(status).send(status < 500 ? 'Requisição inválida.' : 'Erro interno do servidor.')
})

// Inicialização
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})