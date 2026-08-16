const usuarioModel = require('../Model/usuarioModel');
const bcrypt = require('bcryptjs')


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
        
            console.log(req.body)

            res.redirect('/login.html')
        })

    }catch(erro){
        console.log(erro);
        res.status(500).res.send("Erro ao criptografar a senha.");
    }
    
}

async function logarUsuario(req, res){
    
    usuarioModel.pegarLogin(async (erro, loginValor) => {
    if (erro) {
        console.log(erro);
        return send("Erro");
    }

    const emailAdm = "admin@gmail";
    const senhaAdm = "admin123";
    let usuarioemail = req.body.email.trim().toLowerCase()
    let usuariosenha = req.body.senha
    let verificar = false

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

        console.log(resultados)

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

                        <label for="senha">Senha:</label>
                        <input type="password" name="senha" id="senha" value="${u.senha}">

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

        console.log(resultados)

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

    usuarioModel.atualizarUsuario(idUsuario, req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar usuário.')
        }
        res.redirect('/privado/pg_entrar')
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



module.exports = {
    criarUsuario,
    logarUsuario,
    mostrarFormularioEdicao,
    atualizarUsuario,
    deletarUsuario,
    perfil,
    logout

}