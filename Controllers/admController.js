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
            <td>${u.senha}</td>
            <td>${u.nome_usuario}</td>
            <td>
                <a class="btn edit" href="/usuarios/${u.idUsuario}/editar">Editar</a>
                <form action="/usuarios/${u.idUsuario}/deletar" method="POST" class="inline-form">
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
                        <th>Senha</th>
                        <th>Nome de Usuário</th>
                        <th>Ações</th>
                    </tr>
                </thead>
            <tbody>${linhasUsuarios}</tbody>
        </table>`

    const statsHtml = (!buscaUsuario) ? `
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">${usuarios.length}</span>
                <span class="stat-label">Usuários cadastrados</span>
            </div>
        </div>
    ` : ''

    
    const infoUsuario = buscaUsuario
        ? `<p class="search-info">${usuarios.length} resultado(s) para "${buscaUsuario}"</p>`
        : ''

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Painel ADM — MeuCRUD</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>

            <aside class="sidebar">
                <div class="sidebar-logo">MeuCRUD</div>
                <nav>
                    <span class="nav-label">Geral</span>
                    <a href="/adm">Dashboard</a>

                    <span class="nav-label">Usuários</span>
                    <a href="/adm#usuarios">Listar usuários</a>
                    <a href="/cadastroUsuario.html">Novo usuário</a>
                    <a href= "/priUsuarios/sair">Sair</a>
                    
                </nav>
            </aside>

            <main class="content">
                <h1>Painel Administrativo</h1>

                ${statsHtml}

                <section id="usuarios" class="card">
                    <div class="section-header">
                        <h2>Usuários</h2>
                        <a class="btn primary" href="/cadastroUsuario.html">+ Novo usuário</a>
                    </div>

                    <form class="search-form" action="/adm" method="GET">
                        <input type="text" name="busca_usuario" placeholder="Buscar por nome..." value="${buscaUsuario}">
                        <button class="btn primary" type="submit">Buscar</button>
                        ${buscaUsuario ? '<a class="btn secondary" href="/adm#usuarios">Limpar</a>' : ''}
                    </form>

                    ${infoUsuario}
                    ${tabelaUsuarios}
                </section>

            </main>

        </body>
        </html>
    `

    res.send(html)
    })
}


module.exports = {
    painelAdm
}