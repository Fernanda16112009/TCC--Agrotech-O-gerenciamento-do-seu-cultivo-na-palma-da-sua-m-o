const usuarioModel = require('../Model/usuarioModel')

function painelAdm(req, res) {

    const buscaUsuario = req.query.busca_usuario || ''

    const obterUsuarios = buscaUsuario
        ? (cb) => usuarioModel.buscarUsuarioPorNome(buscaUsuario, cb)
        : usuarioModel.listarUsuarios

    obterUsuarios((erroU, usuarios) => {

        if (erroU) {
            console.log(erroU)
            return res.send('Erro ao buscar usuários.')
        }

        const linhasUsuarios = usuarios.map(u => `
            <tr>
                <td>${u.idUsuario}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone}</td>
                <td>${u.nome_usuario}</td>
                <td class="acoes">
                    <a class="btn edit" href="/priUsuarios/${u.idUsuario}/editar">
                        Editar
                    </a>

                    <form action="/priUsuarios/${u.idUsuario}/deletar"
                          method="POST"
                          class="inline-form">

                        <button class="btn delete"
                                type="submit"
                                onclick="return confirm('Excluir ${u.nome}?')">
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
                                <th>Telefone</th>
                                <th>Nome de Usuário</th>
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
                    ${usuarios.length} resultado(s) para "${buscaUsuario}"
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

                        <a href="/adm/usuarios">
                            Listar usuários
                        </a>

                        <a href="/priUsuarios/sair">
                            Sair
                        </a>

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

    usuarioModel.listarUsuariosID((erroU, usuarios) => {
        if (erroU) {
            console.log(erroU)
            return res.send('Erro ao buscar usuários.')
        }

    const linhasUsuarios = usuarios.map(u => `
        <tr>
            <td>${u.idUsuario}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.telefone}</td>
            <td>${u.nome_usuario}</td>
            <td>
                <a class="btn edit" href="/priUsuarios/${u.idUsuario}/editar">Editar</a>
                <form action="/priUsuarios/${u.idUsuario}/deletar" method="POST" class="inline-form">
                    <button class="btn delete" type="submit" onclick="return confirm('Excluir ${u.nome}?')">Excluir</button>
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
                        <th>Telefone</th>
                        <th>Nome de Usuário</th>
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

                        <a href="/adm">Painel geral</a>

                        <a href="/priUsuarios/sair">
                            Sair
                        </a>

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
    
module.exports = {
    painelAdm,
    listarPorID
}