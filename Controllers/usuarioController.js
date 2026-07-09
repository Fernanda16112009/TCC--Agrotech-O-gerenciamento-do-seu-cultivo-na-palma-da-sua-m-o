const usuarioModel = require('../Model/usuarioModel')

function criarUsuario(req, res) {
    usuarioModel.criarUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar usuário.')
        }
        res.redirect('/')
    })
}
/*
function mostrarFormularioEdicao(req, res) {
    const { codigo } = req.params

    usuarioModel.buscarUsuarioPorId(codigo, (erro, resultados) => {
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
            </head>
            <body>

                <form action="/usuarios/${u.id}/editar" method="POST">
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
                        <input type="tel" name="telefone" id="telefone" value="${u.telefone || ''}">

                        <br><br>


                        <br><br>

                        <label for="endereco">Endereço:</label>
                        <input type="text" name="endereco" id="endereco" value="${u.endereco || ''}">

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
    const { id } = req.params

    usuarioModel.atualizarUsuario(id, req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar usuário.')
        }
        res.redirect('/adm')
    })
}

function deletarUsuario(req, res) {
    const { id } = req.params

    usuarioModel.deletarUsuario(id, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao excluir usuário.')
        }
        res.redirect('/adm')
    })
}
*/
module.exports = {
    criarUsuario,/*
    mostrarFormularioEdicao,
    atualizarUsuario,
    deletarUsuario*/
}