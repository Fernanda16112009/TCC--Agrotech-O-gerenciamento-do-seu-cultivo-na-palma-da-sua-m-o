const usuarioModel = require('../Model/usuarioModel')
const admModel = require('../Model/admModel')
const validar = require('../Constantes/validar')
const bcrypt = require('bcryptjs')

// Monta a página do painel. Usada por painelAdm e listarPorID.
// opcoes: { busca: texto pesquisado, mostrarStats: true ou false }

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

        res.render('adm/painel', { usuarios, busca, mostrarStats: !busca })
    })
}

// /adm/usuarios : ordenado por ID, sem contagem
function listarPorID(req, res) {

    admModel.listarUsuariosID((erro, usuarios) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar usuários.')
        }

        res.render('adm/painel', { usuarios, busca: '', mostrarStats: false })
    })
}

function mostrarFormularioEdicao(req, res) {

    const { idUsuario } = req.params

    usuarioModel.buscarUsuarioPorId(idUsuario, (erro, resultados) => {

        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar usuário.')
        }
        if (resultados.length === 0) {
            return res.status(404).send('Usuário não encontrado.')
        }

        res.render('adm/editarUsuario', {
            usuario: resultados[0],
            erroEmail: req.query.erro === 'email'
        })
    })
}

// /adm/cadastrar : formulário de cadastro de novo usuário, feito pelo próprio painel
function mostrarFormularioCadastro(req, res) {
    res.render('adm/cadastrarUsuario', {
        erroEmail: req.query.erro === 'email'
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
    
async function cadastrarUsuario(req, res) {

    const nome = validar.validarNome(req.body.nome)

    if (nome.erro) {
        return res.status(400).send(nome.erro)
    }

    const email = validar.validarEmail(req.body.email)

    if (email.erro) {
        return res.status(400).send(email.erro)
    }

    const senha = validar.validarSenha(req.body.senha)

    if (senha.erro) {
        return res.status(400).send(senha.erro)
    }

    try {
        const senhaHash = await bcrypt.hash(req.body.senha, 10)

        usuarioModel.criarUsuario({
            nome: nome.value,
            email: email.value,
            senha: senhaHash,
            role: 'user'
        }, (erro) => {

            if (erro) {
                if (erro.code === 'ER_DUP_ENTRY') {
                    return res.redirect('/adm/cadastrar?erro=email')
                }
                console.log(erro)
                return res.status(500).send('Erro ao cadastrar usuário.')
            }

            res.redirect('/adm')
        })
    } catch (erro) {
        console.log(erro)
        res.status(500).send('Erro ao criptografar a senha.')
    }
}

module.exports = {
    painelAdm,
    listarPorID,
    mostrarFormularioEdicao,
    mostrarFormularioCadastro,
    cadastrarUsuario,
    atualizarUsuario,
    deletarUsuario
}