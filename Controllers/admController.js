const usuarioModel = require('../Model/usuarioModel')
const admModel = require('../Model/admModel')
const validar = require('../Constantes/validar')

function painelAdm(req, res) {

    const buscaUsuario = req.query.busca_usuario || ''

    const obterUsuarios = buscaUsuario
        ? (cb) => admModel.buscarUsuarioPorNome(buscaUsuario, cb)
        : admModel.listarUsuarios

    obterUsuarios((erroU, usuarios) => {

        if (erroU) {
            console.log(erroU)
            return res.status(500).send('Erro ao buscar usuários.')
        }

        const linhasUsuarios = usuarios.map(u => `
            <tr>
                <td>${validar.escaparHtml(u.idUsuario)}</td>
                <td>${validar.escaparHtml(u.nome)}</td>
                <td>${validar.escaparHtml(u.email)}</td>
                <td class="acoes">
                    <a class="btn edit" href="/adm/${validar.escaparHtml(u.idUsuario)}/editar">
                        Editar
                    </a>

                    <form action="/adm/${validar.escaparHtml(u.idUsuario)}/deletar"
                          method="POST"
                          class="inline-form">

                        <button class="btn delete"
                                type="submit"
                                onclick="return confirm('Excluir este usuário? Todas as plantas dele também serão apagadas.')">
                            Excluir
                        </button>

                    </form>
                </td>
            </tr>
        `).join('')

        const tabelaUsuarios = usuarios.length === 0

            ? '<p class="empty-state">Nenhum usuário encontrado.</p>'

            : `
                <div class="tabela-container">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${linhasUsuarios}
                        </tbody>

                    </table>

                </div>
            `

        const statsHtml = (!buscaUsuario) ? `
            <div class="stats">

                <div class="stat-card">

                    <span class="stat-number">
                        ${usuarios.length}
                    </span>

                    <span class="stat-label">
                        Usuários cadastrados
                    </span>

                </div>

            </div>
        ` : ''

        const infoUsuario = buscaUsuario
            ? `
                <p class="search-info">
                    ${usuarios.length} resultado(s) para "${validar.escaparHtml(buscaUsuario)}"
                </p>
            `
            : ''

        const html = `
            <!DOCTYPE html>

            <html lang="pt-BR">

            <head>

                <meta charset="UTF-8">

                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">

                <title>Painel Administrativo — AgroTech</title>

                <link rel="stylesheet" href="/admStyle.css">

                <script src="/js/vlibras.js" defer></script>
            </head>

            <body class="bodyAdm">

                <aside class="sidebar">

                    <div class="sidebar-logo">
                        AgroTech
                    </div>

                    <nav class="sidebar-nav">

                        <a class = "btn-nav" href="/adm/usuarios">
                            Listar usuários
                        </a>

                        <form action="/priUsuarios/sair" method="post" required>
                            <button  class ="btn-nav">Sair</button>
                        </form>

                    </nav>

                </aside>


                <main class="content">

                    <h1 class="titulo-adm">
                        Painel Administrativo
                    </h1>


                    ${statsHtml}


                    <section id="usuarios" class="card">

                        <div class="section-header">

                            <h2>
                                Usuários
                            </h2>

                            <a class="btn btn-adm-primary"
                               href="/cadastroUsuario.html">
                                + Novo usuário
                            </a>

                        </div>


                        <form class="search-form"
                              action="/adm"
                              method="GET">

                            <input
                                type="text"
                                name="busca_usuario"
                                placeholder="Buscar por nome..."
                                value="${buscaUsuario}"
                            >

                            <button
                                class="btn btn-adm-primary"
                                type="submit">
                                Buscar
                            </button>

                            ${
                                buscaUsuario
                                ? `
                                    <a class="btn btn-adm-secondary"
                                       href="/adm#usuarios">
                                        Limpar
                                    </a>
                                `
                                : ''
                            }

                        </form>


                        ${infoUsuario}

                        ${tabelaUsuarios}

                    </section>

                </main>


                <footer>

                    <div class="footer-conteudo">

                        <h3>
                            AgroTech
                        </h3>

                        <p>
                            O gerenciamento do plantio na palma da sua mão.
                        </p>

                        <p>
                            Sugestões, críticas ou dúvidas?
                            <a href="mailto:agrotech@email.com">
                                Entre em contato conosco
                            </a>
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

function listarPorID(req, res) {

    admModel.listarUsuariosID((erroU, usuarios) => {
        if (erroU) {
            console.log(erroU)
            return res.status(500).send('Erro ao buscar usuários.')
        }

    const linhasUsuarios = usuarios.map(u => `
        <tr>
            <td>${validar.escaparHtml(u.idUsuario)}</td>
            <td>${validar.escaparHtml(u.nome)}</td>
            <td>${validar.escaparHtml(u.email)}</td>
            <td>
                <a class="btn edit" href="/adm/${validar.escaparHtml(u.idUsuario)}/editar">Editar</a>
                <form action="/adm/${validar.escaparHtml(u.idUsuario)}/deletar" method="POST" class="inline-form">
                    <button class="btn delete" type="submit" onclick="return confirm('Excluir este usuário? Todas as plantas dele também serão apagadas')">Excluir</button>
                </form>
            </td>
        </tr>
    `).join('')

    const tabelaUsuarios = usuarios.length === 0
        ? '<p class="empty-state">Nenhum usuário encontrado.</p>'
        : `<table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
            <tbody>${linhasUsuarios}</tbody>
        </table>`



    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Painel Administrativo — AgroTech</title>
            <link rel="stylesheet" href="/admStyle.css">
            <script src="/js/vlibras.js" defer></script>
        </head>
        <body class= "bodyAdm">
            <aside class="sidebar">

                    <div class="sidebar-logo">
                        AgroTech
                    </div>
                    <nav class="sidebar-nav">

                        <a class = "btn-nav" href="/adm/usuarios">
                            Listar usuários
                        </a>

                        <form action="/priUsuarios/sair" method="post" required>
                            <button  class ="btn-nav">Sair</button>
                        </form>

                    </nav>

                </aside>

            <main class="content">
                    <h1 class="titulo-adm">
                        Painel Administrativo
                    </h1>

                <section id="usuarios" class="card">
                    <div class="section-header">
                        <h2>Usuários</h2>
                        <a class="btn primary" href="/cadastroUsuario.html">+ Novo usuário</a>
                    </div>

                    ${tabelaUsuarios}
                </section>

            </main>
            <footer>
                <div class="footer-conteudo">

                    <h3>AgroTech</h3>

                    <p>
                        O gerenciamento do plantio na palma da sua mão.
                    </p>

                    <p>
                        Sugestões, críticas ou dúvidas?
                        <a href="mailto:agrotech@email.com">
                            Entre em contato conosco
                        </a>
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
                            ${erroEmail}
                        <div class="editar-usuario-card">
                        
                            <form action="/adm/${validar.escaparHtml(u.idUsuario)}/editar" method="POST">

                                <div class="elemento_form">
                                    <label for="nome">Nome Completo</label>
                                    <input type="text" name="nome" id="nome" value="${validar.escaparHtml(u.nome)}" required>
                                </div>

                                <div class="elemento_form">
                                    <label for="email">E-mail</label>
                                    <input type="email" name="email" id="email" value="${validar.escaparHtml(u.email)}" required>
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
    const idUsuario  = req.params.idUsuario;

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
        return res.status(404).send("Id inválido")
    }

    usuarioModel.atualizarUsuario(idUsuario, req.body, (erro) => {
        if (erro) {
            if (erro.code ==='ER_DUP_ENTRY'){
                return res.redirect(`/adm/${idUsuario}/editar?erro=email`)
            }
            console.log(erro)
            return res.status(500).send('Erro ao atualizar usuário.')
        }
        res.redirect('/adm')
    })
}

function deletarUsuario(req, res) {

    const { idUsuario } = req.params

    if(idUsuario === 0){
        return res.status(404).send("Id inválido")
    }

    if(Number(idUsuario) === req.session.usuario.idUsuario){
        return res.status(403).send("Não é possivel apagar o próprio usuario")
    }

    admModel.deletarUsuario(idUsuario, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao excluir usuário.')
        }
        res.redirect('/adm')
    })
}
    
module.exports = {
    painelAdm,
    listarPorID,
    mostrarFormularioEdicao,
    atualizarUsuario,
    deletarUsuario
}