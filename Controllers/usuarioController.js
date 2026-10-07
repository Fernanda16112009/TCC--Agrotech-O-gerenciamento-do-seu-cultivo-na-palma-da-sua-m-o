const usuarioModel = require('../Model/usuarioModel');
const bcrypt = require('bcryptjs')
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');
const resend = new Resend(process.env.RESEND_API_KEY)

if (!process.env.JWT) {
    throw new Error('Variável JWT não definida no .env');
}

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

async function montarToken(email) {

    return new Promise((resolve, reject) => {
        usuarioModel.buscarIDSenha(email, (erro, resultados) =>{
            
            if (erro) {
                reject(erro)
                return;
            }

            if(resultados.length === 0){
                resolve (null)
                return
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

async function criarUsuario(req, res) {

    req.body.role = "user"

    if (typeof req.body.email !== 'string') {
        return res.status(400).send('Email inválido')
    }

    if (typeof req.body.senha !== 'string') {
        return res.status(400).send('Senha inválida')
    }

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
                if(erro.code === 'ER_DUP_ENTRY'){
                 return res.redirect('/usuarios/cadastroUsuario?erro=email')
                }

                console.log(erro)
                return res.status(500).send('Erro ao cadastrar usuário.')
            }
        

            res.redirect('/usuarios/login')
        })
    }catch(erro){
        console.log(erro);
        res.status(500).send("Erro ao criptografar a senha.");
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


        for (let i = 0; i < loginValor.length; i++){

            if(usuarioemail === loginValor[i].email){

                const senhaCorreta = await bcrypt.compare(
                    usuariosenha,
                    loginValor[i].senha
                )

                if(senhaCorreta){
                    req.session.usuario = loginValor[i]

                    if (req.session.usuario.role === "adm"){
                        return res.redirect('/adm')
                    }

                    return res.redirect('/')
                }

                return res.redirect('/usuarios/login?erro=login')
            }
        }
        return res.redirect('/usuarios/login?erro=login')
    })
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
            return res.status(500).send('Erro ao buscar usuário.')
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
                <link rel="stylesheet" href="/privado/privadoStyle.css">
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>
                <main>
                    <div class="cadastro-pagina">

                        <h1 class="titulo-pagina">Meu Perfil</h1>

                        <div class="cadastro-card">
                            <form action="/priUsuarios/${u.idUsuario}/editar" method="POST">

                                <div class="campo">
                                    <label for="nome" class="form_pergunta">Nome completo</label>
                                    <input type="text" name="nome" id="nome" value="${u.nome}" required>
                                </div>

                                <div class="campo">
                                    <label for="email" class="form_pergunta">E-mail</label>
                                    <input type="email" name="email" id="email" value="${u.email}" required>
                                </div>

                                <button type="submit" class="btn-cadastro">Salvar alterações</button>
                            </form>

                            <form action="/usuarios/emailRecuperarSenha" method="get" required class="form-voltar">
                                <button type="submit" class="btn-secundario">Trocar senha</button>
                            </form>
                        </div>

                        <form action="/" method="get">
                            <button class="btn-voltar" type="submit" title="Voltar">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </form>

                    </div>
                </main>
                <footer>

                    <div class="footer-conteudo">

                        <h3>AgroTech</h3>

                        <p>
                            O gerenciamento do plantio na palma da sua mão.
                        </p>

                        <p>
                            Sugestões, críticas ou dúvidas?
                            <a href="mailto:agrotech@email.com">Entre em contato conosco</a>
                        </p>

                        <p class="copyright">
                            © 2026 AgroTech. Todos os direitos reservados.
                        </p>

                    </div>

                </footer>
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
            return res.status(500).send('Erro ao buscar usuário.')
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
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>
                <header>
                    <h1 class="titulo">AgroTech</h1>
                    <h2 class="subtitulo">Editar Usuário</h2>
                </header>

                <main>
                    <div class="editar-usuario-pagina">

                        <div class="editar-usuario-card">
                            <form action="/priUsuarios/${u.idUsuario}/editar" method="POST">

                                <div class="elemento_form">
                                    <label for="nome">Nome Completo</label>
                                    <input type="text" name="nome" id="nome" value="${u.nome}" required>
                                </div>

                                <div class="elemento_form">
                                    <label for="email">E-mail</label>
                                    <input type="email" name="email" id="email" value="${u.email}" required>
                                </div>

                                <button type="submit" class="btn">Salvar alterações</button>
                            </form>
                        </div>

                        <div class="editar-usuario-acoes">
                            <a href="/adm" class="btn-secundario">Voltar ao painel</a>
                        </div>

                    </div>
                </main>
                <footer>

                    <div class="footer-conteudo">

                        <h3>AgroTech</h3>

                        <p>
                            O gerenciamento do plantio na palma da sua mão.
                        </p>

                        <p>
                            Sugestões, críticas ou dúvidas?
                            <a href="mailto:agrotech@email.com">Entre em contato conosco</a>
                        </p>

                        <p class="copyright">
                            © 2026 AgroTech. Todos os direitos reservados.
                        </p>

                    </div>

                </footer>
            </body>
            </html>
        `

        res.send(html)
    })
}
 
function atualizarUsuario(req, res) {
    const { idUsuario } = req.params || req.session.usuario.idUsuario;

    usuarioModel.atualizarUsuario(idUsuario, req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao atualizar usuário.')
        }
        res.redirect('/adm')
    })
}

async function enviarEmail(req, res) {

    if (typeof req.body.email !== 'string') {
        return res.status(400).send('Email inválido')
    }

    const emailEnviar = req.body.email.trim().toLowerCase();

    if (!emailEnviar) {
        return res.status(400).send('Email vazio')
    }

    let resetURL
    try {
        resetURL = await montarToken(emailEnviar)
    } catch (erro) {
        console.error(erro)
        return res.status(500).send('Erro ao montar token')
    }

    if (resetURL) {
        try {
            const { error } = await resend.emails.send({
                from: 'Agrotech <onboarding@resend.dev>',
                to: [emailEnviar],
                subject: 'Recuperação de senha - AgroTech',
                html: `
                    <p>Clique no link abaixo para trocar sua senha. Ele vale por 1 hora.</p>
                    <p><a href="${resetURL}">Trocar minha senha</a></p>
                `,
            });

            if (error) {
                console.error({ error });
            }
        } catch (erro) {
            console.error({ erro });
        }
    }

    return res.redirect('/usuarios/emailRecuperarSenha?enviado=1')
}

async function atualizarSenha(req,res){

     if (req.body.senha.length < 6) {
        return res.status(400).send(
            "A senha precisa ter pelo menos 6 caracteres."
        );
    }
    req.body.senha = await bcrypt.hash(req.body.senha, 10);

    usuarioModel.atualizarSenha(req.body, (erro) =>{
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao atualizar senha.')
        }
    })
    res.redirect('/')
}

function deletarUsuario(req, res) {
    const { idUsuario } = req.params

    usuarioModel.deletarUsuario(idUsuario, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao excluir usuário.')
        }
        res.redirect('/adm')
    })
}

module.exports = {
    montarSecret,
    criarUsuario,
    logarUsuario,
    logout,
    perfil,
    mostrarFormularioEdicao,
    atualizarUsuario,
    enviarEmail,
    atualizarSenha,
    deletarUsuario
}
