const usuarioModel = require('../Model/usuarioModel');
const bcrypt = require('bcryptjs')
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');

async function montarSecret(id) {
    
    return new Promise((resolve, reject) => {
        usuarioModel.buscarSenhaPorId(id, (erro, resultados) =>{
            
            if (erro) {
                reject(erro)
                return;
            }

            const senha = resultados[0].senha

            const  secret = process.env.JWT + senha; 

            resolve(secret)
        })
    })
}

function buscarEmail (req,res){

    usuarioModel.buscarEmail((erro, emails) => {
        if(erro){
            console.log(erro)
            return res.send('Erro ao buscar os emails')
        }
        return res.json(emails)
    })
}

function buscarNomeUsuario(req,res){
    
    usuarioModel.buscarNomeUsuario((erro, nomes) =>{
        if (erro){
            console.log(erro)
            return res.send('Erro ao buscar nome de usuario.')
        }
        return res.json(nomes);

    })
}

async function criarUsuario(req, res) {

    req.body.email = req.body.email.trim().toLowerCase();

    if (req.body.senha.length < 6) {
        return res.status(400).send(
            "A senha precisa ter pelo menos 6 caracteres."
        );
    }
    
    try{
        req.body.senha = await bcrypt.hash(req.body.senha, 10);

        usuarioModel.criarUsuario(req.body, (erro) => {
            if (erro) {
                console.log(erro)
                return res.send('Erro ao cadastrar usuário.')
            }
        

            res.redirect('/login.html')
        })
    }catch(erro){
        console.log(erro);
        res.status(500).res.send("Erro ao criptografar a senha.");
    }
    
}

async function logarUsuario(req, res){

    usuarioModel.pegarLogin( async (erro, loginValor) => {
    if (erro) {
        console.log(erro);
        return send("Erro");
    }

    const usuarioemail = req.body.email.trim().toLowerCase()
    const usuariosenha = req.body.senha
    const emailAdm = "admin@gmail";
    const senhaAdm = "admin123";


    if (usuarioemail === emailAdm && usuariosenha === senhaAdm){
        req.session.usuario = req.body
        return res.redirect('/adm')

    }

    for (let i = 0; i < loginValor.length; i++){

        if(usuarioemail === loginValor[i].email){

            const senhaCorreta = await bcrypt.compare(
                usuariosenha,
                loginValor[i].senha
            )

            if(senhaCorreta){
            req.session.usuario = loginValor[i]
            return res.redirect('/privado/pg_entrar')
            }
            
        }
        
    }
    res.send("Email ou senha incorretos")


       
});
}

function logout(req,res){
    req.session.destroy();
    return res.redirect('/')
}

function perfil(req, res){

    const idUsuario = req.session.usuario.idUsuario;

    usuarioModel.buscarUsuarioPorId(idUsuario, (erro, resultados) => {


        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar usuário.')
        }
        if (resultados.length === 0) {
            return res.send('Usuário não encontrado.')
        }

        const u = resultados[0]


        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Meu Perfil</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>

                <form action="/priUsuarios/${u.idUsuario}/editar" method="POST">
                    <fieldset>
                        <legend><b>Meu Perfil</b></legend>

                        <br>

                        <label for="nome">Nome Completo:</label>
                        <input type="text" name="nome" id="nome" value="${u.nome}" required>

                        <br><br>

                        <label for="email">E-mail:</label>
                        <input type="email" name="email" id="email" value="${u.email}" required>

                        <br><br>

                        <label for="telefone">Telefone:</label>
                        <input type="tel" name="telefone" id="telefone" value="${u.telefone}">

                        <br><br>

                        <label for="nome_usuario">Nome de usuário:</label>
                        <input type="text" name="nome_usuario" id="nome_usuario" value="${u.nome_usuario}">

                        <br><br>

                        <button type="submit">Salvar alterações</button>
                    </fieldset>
                </form>

                <br>
                <a href="/privado/configuracoes">Voltar</a>

            </body>
            </html>
        `

        res.send(html)
    })

}

function mostrarFormularioEdicao(req, res){
    const { idUsuario } = req.params 

    usuarioModel.buscarUsuarioPorId(idUsuario, (erro, resultados) => {


        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar usuário.')
        }
        if (resultados.length === 0) {
            return res.send('Usuário não encontrado.')
        }

        const u = resultados[0]


        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Editar Usuário</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>

                <form action="/priUsuarios/${u.idUsuario}/editar" method="POST">
                    <fieldset>
                        <legend><b>Editar Usuário</b></legend>

                        <br>

                        <label for="nome">Nome Completo:</label>
                        <input type="text" name="nome" id="nome" value="${u.nome}" required>

                        <br><br>

                        <label for="email">E-mail:</label>
                        <input type="email" name="email" id="email" value="${u.email}" required>

                        <br><br>

                        <label for="telefone">Telefone:</label>
                        <input type="tel" name="telefone" id="telefone" value="${u.telefone}">

                        <br><br>

                        <label for="nome_usuario">Nome de usuário:</label>
                        <input type="text" name="nome_usuario" id="nome_usuario" value="${u.nome_usuario}">

                        <br><br>

                        <button type="submit">Salvar alterações</button>
                    </fieldset>
                </form>

                <br>
                <a href="/adm">Voltar ao painel</a>

            </body>
            </html>
        `

        res.send(html)
    })
}
 
function atualizarUsuario(req, res) {
    const { idUsuario } = req.params || req.session.usuario.idUsuario;

    console.log(idUsuario)

    usuarioModel.atualizarUsuario(idUsuario, req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar usuário.')
        }
        res.redirect('/adm')
    })
}

function deletarUsuario(req, res) {
    const { idUsuario } = req.params

    usuarioModel.deletarUsuario(idUsuario, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao excluir usuário.')
        }
        res.redirect('/adm')
    })
}

async function montarToken(email) {

    return new Promise((resolve, reject) => {
        usuarioModel.buscarIDSenha(email, (erro, resultados) =>{
            
            if (erro) {
                reject(erro)
                return;
            }


            const id = resultados[0].idUsuario;
            const senha = resultados[0].senha

            const  secret = process.env.JWT + senha; 
            const  token = jwt.sign( { id : id, email : email }, secret, { expiresIn : '1h' }); 
            const resetURL = `http://localhost:8000/trocarSenha/trocarSenha?id=${id}&token=${token}`;

            resolve(resetURL)
        })
    })
        
}

async function enviarEmail (req,res) {

    const emailEnviar = req.body.email

    const resetURL = await montarToken(emailEnviar)

    const resend = new Resend(process.env.RESEND_API_KEY);

    (async function () {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [`${emailEnviar}`],
        subject: 'Hello World',
        html: `${resetURL}`,
    });

    if (error) {
        return console.error({ error });
    }

    /*console.log({ data });*/
    })();

    res.send('Email enviado!');
}

        

module.exports = {
    montarSecret,
    buscarEmail,
    buscarNomeUsuario,
    criarUsuario,
    logarUsuario,
    logout,
    perfil,
    mostrarFormularioEdicao,
    atualizarUsuario,
    deletarUsuario,
    enviarEmail
}
