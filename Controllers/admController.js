const usuarioModel = require('../Model/usuarioModel')
const admModel = require('../Model/admModel')
const validar = require('../Constantes/validar')
const esc = validar.escaparHtml

// Monta a página do painel. Usada por painelAdm e listarPorID.
// opcoes: { busca: texto pesquisado, mostrarStats: true ou false }
function montarPaginaAdm(usuarios, opcoes) {

    const busca = opcoes.busca || ''

    const linhasUsuarios = usuarios.map(u => `
        <tr>
            <td>${esc(u.idUsuario)}</td>
            <td>${esc(u.nome)}</td>
            <td>${esc(u.email)}</td>
            <td class="acoes">
                <a class="btn edit" href="/adm/${esc(u.idUsuario)}/editar">Editar</a>

                <form action="/adm/${esc(u.idUsuario)}/deletar" method="POST" class="inline-form">
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

    const statsHtml = opcoes.mostrarStats ? `
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">${usuarios.length}</span>
                <span class="stat-label">Usuários cadastrados</span>
            </div>
        </div>
    ` : ''

    const infoBusca = busca
        ? `<p class="search-info">${usuarios.length} resultado(s) para "${esc(busca)}"</p>`
        : ''

    const botaoLimpar = busca
        ? '<a class="btn btn-adm-secondary" href="/adm#usuarios">Limpar</a>'
        : ''

    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Painel Administrativo — AgroTech</title>
            <link rel="stylesheet" href="/admStyle.css">
            <script src="/js/vlibras.js" defer></script>
        </head>
        <body class="bodyAdm">

            <aside class="sidebar">
                <div class="sidebar-logo">AgroTech</div>

                <nav class="sidebar-nav">
                    <a class="btn-nav" href="/adm">Painel Principal</a>
                    <a class="btn-nav" href="/adm/usuarios">Listar usuários</a>

                    <form action="/priUsuarios/sair" method="post">
                        <button class="btn-nav">Sair</button>
                    </form>
                </nav>
            </aside>

            <main class="content">
                <h1 class="titulo-adm">Painel Administrativo</h1>

                ${statsHtml}

                <section id="usuarios" class="card">

                    <div class="section-header">
                        <h2>Usuários</h2>
                        <a class="btn btn-adm-primary" href="/cadastroUsuario.html">+ Novo usuário</a>
                    </div>

                    <form class="search-form" action="/adm" method="GET">
                        <input type="text"
                               name="busca_usuario"
                               placeholder="Buscar por nome..."
                               value="${esc(busca)}">

                        <button class="btn btn-adm-primary" type="submit">Buscar</button>

                        ${botaoLimpar}
                    </form>

                    ${infoBusca}

                    ${tabelaUsuarios}

                </section>
            </main>

            <footer>
                <div class="footer-conteudo">
                    <h3>AgroTech</h3>
                    <p>O gerenciamento do plantio na palma da sua mão.</p>
                    <p>
                        Sugestões, críticas ou dúvidas?
                        <a href="mailto:agrotech@email.com">Entre em contato conosco</a>
                    </p>
                    <p class="copyright">© 2026 AgroTech. Todos os direitos reservados.</p>
                </div>
            </footer>

        </body>
        </html>
    `
}

// /adm : ordenado por nome, com busca e contagem de usuários
function painelAdm(req, res) {

    const busca = typeof req.query.busca_usuario === 'string'
        ? req.query.busca_usuario.trim()
        : ''

    const obterUsuarios = busca
        ? (cb) => admModel.buscarUsuarioPorNome(busca, cb)
        : admModel.listarUsuarios

    obterUsuarios((erro, usuarios) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar usuários.')
        }

        res.send(montarPaginaAdm(usuarios, { busca, mostrarStats: !busca }))
    })
}

// /adm/usuarios : ordenado por ID, sem contagem
function listarPorID(req, res) {

    admModel.listarUsuariosID((erro, usuarios) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar usuários.')
        }

        res.send(montarPaginaAdm(usuarios, { busca: '', mostrarStats: false }))
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