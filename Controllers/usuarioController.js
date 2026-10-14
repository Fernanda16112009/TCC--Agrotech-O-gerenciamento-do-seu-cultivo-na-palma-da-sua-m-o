const usuarioModel = require('../Model/usuarioModel');
const validar = require('../Constantes/validar')
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

            
            if(resultados.length === 0){
                resolve (null)
                return
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

    const nome = validar.validarNome(req.body.nome)

    if (nome.erro){
        return res.status(400).send(nome.erro)
    }

    const email = validar.validarEmail(req.body.email)

    if (email.erro){
        return res.status(400).send(email.erro)
    }

    const senha = validar.validarSenha(req.body.senha)

    if (senha.erro){
        return res.status(400).send(senha.erro)
    }
    
    req.body.email = email.value
        req.body.nome = nome.value

    
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

    const resultadoEmail = validar.validarEmail(req.body.email)

    if (resultadoEmail.erro){
        return res.status(400).send(resultadoEmail.erro)
    }

    if (typeof req.body.senha !== 'string') {
        return res.status(400).send ("Senha inválida") 
    }

    const email = resultadoEmail.value

    const usuariosenha = req.body.senha

    usuarioModel.pegarLogin( email, async (erro, resultado) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao ao busca senha.");
        }

        if (resultado.length === 0) {
            return res.redirect('/usuarios/login?erro=login')
        }

        const senhaCorreta = await bcrypt.compare(
            usuariosenha,
            resultado[0].senha
        )

        if(senhaCorreta){
            req.session.usuario = {
                idUsuario: resultado[0].idUsuario,
                role: resultado[0].role
            }

            if (req.session.usuario.role === "adm"){
                return res.redirect('/adm')
            }

            return res.redirect('/')
        }

        return res.redirect('/usuarios/login?erro=login')
    })
}

function logout(req,res){
    req.session.destroy(() =>{ return res.redirect('/')});  
}

function perfil(req, res){

    const idUsuario = req.session.usuario.idUsuario;

    const erroEmail = req.query.erro === 'email'
    ? '<p class="mensagem-erro">Esse e-mail já está em uso por outra conta.</p>'
    : ''

    usuarioModel.buscarUsuarioPorId(idUsuario, (erro, resultados) => {


        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar usuário.')
        }
        if (resultados.length === 0) {
            return res.status(404).send('Usuário não encontrado.')
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
                            ${erroEmail}
                            <form action="/priUsuarios/editar" method="POST">

                                <div class="campo">
                                    <label for="nome" class="form_pergunta">Nome completo</label>
                                    <input type="text" name="nome" id="nome" value="${validar.escaparHtml(u.nome)}" required>
                                </div>

                                <div class="campo">
                                    <label for="email" class="form_pergunta">E-mail</label>
                                    <input type="email" name="email" id="email" value="${validar.escaparHtml(u.email)}" required>
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
 
function atualizarUsuario(req, res) {
    const idUsuario  = req.session.usuario.idUsuario;

    const nome = validar.validarNome(req.body.nome)

    if (nome.erro){
        return res.status(400).send(nome.erro)
    }

    const email = validar.validarEmail(req.body.email)

    if (email.erro){
        return res.status(400).send(email.erro)
    }
    
    req.body.email = email.value
    req.body.nome = nome.value

    if(idUsuario === "0"){
        res.status(404).send("Id inválido")
    }


    usuarioModel.atualizarUsuario(idUsuario, req.body, (erro) => {
        if (erro) {
            if (erro.code ==='ER_DUP_ENTRY'){
                return res.redirect(`/priUsuarios/perfil?erro=email`)
            }
            console.log(erro)
            return res.status(500).send('Erro ao atualizar usuário.')
        }

        res.redirect('/priUsuarios/perfil')
    })
}

async function enviarEmail(req, res) {


    const resultadoEmail = validar.validarEmail(req.body.email)

    if (resultadoEmail.erro){
        return res.status(400).send(resultadoEmail.erro)
    }

    const emailEnviar = resultadoEmail.value

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

    try{

        const resultadoSenha = validar.validarSenha(req.body.senha)

        if (resultadoSenha.erro){
            return res.status(400).send(resultadoSenha.erro)
        }

        const resultadoConfirmacao = validar.validarSenhaTrocar(req.body.senha, req.body.senhaValida)

        if (resultadoConfirmacao.erro){
            return res.status(400).send(resultadoConfirmacao.erro)
        }

        req.body.senha = resultadoConfirmacao.value

        if (typeof req.body.idUsuario !== 'string') {
            return res.status(400).send('Id inválido')
        }

        if (typeof req.body.token !== 'string') {
            return res.status(400).send('Token inválido')
        }


        try{
            const secret = await montarSecret(req.body.idUsuario)

            if (!secret){
                return res.status(400).send("Token inválido ou expirado")
            }
            const decoded = jwt.verify(req.body.token, secret)
            req.body.idUsuario= decoded.id

        }catch(erro){
            console.log(erro)
            return res.status(400).send('Token inválido ou expirado')
        }

        req.body.senha = await bcrypt.hash(req.body.senha, 10);

        usuarioModel.atualizarSenha(req.body, (erro) =>{
            if (erro) {
                console.log(erro)
                return res.status(500).send('Erro ao atualizar senha.')
            }

            res.redirect('/')
        })
        
    }catch(erro){
        console.log(erro)
        return res.status(500).send('Erro ao atualizar senha.')
    }

}

module.exports = {
    montarSecret,
    criarUsuario,
    logarUsuario,
    logout,
    perfil,
    atualizarUsuario,
    enviarEmail,
    atualizarSenha
}
