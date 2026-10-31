const plantaUsuarioModel = require('../Model/plantaUsuarioModel');
const plantaADMModel = require('../Model/plantaAdmModel');
const tiposPorPlanta = require('../Constantes/plantas')
const validar = require('../Constantes/validar')
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require('fs/promises');

function formatarNomeExibicao(texto) {
    return texto
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^./, (c) => c.toUpperCase());
}

const imagensPorTipo = {
    morangoAlbion: 'morangoAlb.png',
    morangoCaminoReal: 'morangoCam.png',
    morangoSanAndreas: 'morangoSan.png',
    cenouraTradicional: 'cenouraTrad.png',
    pepinoCaipira: 'pepinoCai.png',
    pepinoConserva: 'pepinoCon.png',
    pepinoJapones: 'pepinoJap.png',
    tomateCereja: 'tomateCer.png',
    tomateLongaVida: 'tomateLon.png',
    tomateSaladete: 'tomateSal.png'
};

function pegarPlantasCalendario(req, res) {
    const idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.buscarPlantasCalendario(idUsuario, (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send('Erro ao buscar plantas do calendário.');
        }
        return res.json(resultados);
    });
}

function pegarPlantasADMCalendario(req, res) {

    plantaADMModel.buscarPlantasAdmCalendario((erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send('Erro ao buscar plantas do calendário.');
        }

        return res.json(resultados);
    });
}

function criarPlantaUsuario(req, res) {

    req.body.idUsuario = req.session.usuario.idUsuario;

    const tipoPlanta = req.body.tipoPlanta

    const idUsuario = req.body.idUsuario

    const formularioValido = validar.validarCadastroPlanta(req.body)

    if (formularioValido.erro) {
        return res.status(400).send(formularioValido.erro)
    }

    const data = validar.validarData(req.body.data_plantacao)

    if (data.erro) {
        return res.status(400).send(data.erro)
    }

    const localizacao = validar.validarLocalizacao(req.body.latitude, req.body.longitude)

    if (localizacao.erro) {
        return res.status(400).send(localizacao.erro)
    }

    req.body.quantidade = formularioValido.value.quantidade
    req.body.longitude = localizacao.value.longitude
    req.body.latitude = localizacao.value.latitude
    req.body.data_plantacao = data.value

    plantaUsuarioModel.buscarNumeroSafra(idUsuario, tipoPlanta, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar numero da safra.')
        }

        let safraNumero

        if (resultado.length === 0) {
            safraNumero = 1
        } else {
            safraNumero = resultado[0].safraNumero + 1
        }

        req.body.safraNumero = safraNumero

        let safraNome = `${req.body.tipoPlanta} safra ${req.body.safraNumero}`

        req.body.safraNome = safraNome

        plantaUsuarioModel.criarPlantaUsuario(req.body, (erro) => {
            if (erro) {
                console.log(erro)
                return res.status(500).send('Erro ao cadastrar planta.')
            }

            res.redirect(`/privado/instrucoesPlantas/${tipoPlanta}`);
        })
    })
}

function mostrarCategoriasPlanta(req, res) {

    const idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.checarCategoriaPlanta(idUsuario, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar categoria das plantas.')
        }

        const imagensPorPlanta = {
            morango: 'morango.webp',
            cenoura: 'cenoura.png',
            pepino: 'pepino.png',
            tomate: 'tomate.webp'
        };

        const plantas = resultado.map(p => ({
            url: `/planta/${p.planta}`,
            nome: formatarNomeExibicao(p.planta),
            imagem: `/privado/img/${imagensPorPlanta[p.planta] || ''}`
        }))

        res.render('planta/categorias', {
            titulo: 'Minhas Plantas',
            estilos: ['/privado/privadoStyle.css'],
            plantas
        })
    })
}

function mostrarCategoriasTipoPlanta(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const planta = req.params.planta

    if (!Object.hasOwn(tiposPorPlanta, planta)) {
        return res.status(404).send('Planta inválida')
    }

    plantaUsuarioModel.checarCategoriaTipoPlanta(idUsuario, planta, (erro, resultados) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar categoria dos tipos das plantas.')
        }

        if (resultados.length === 0) {
            return res.status(404).send('Planta não encontrado.')
        }

        const tipos = resultados.map(p => ({
            url: `/planta/${planta}/${p.tipoPlanta}`,
            nome: formatarNomeExibicao(p.tipoPlanta),
            imagem: `/privado/img/${imagensPorTipo[p.tipoPlanta] || ''}`
        }))

        res.render('planta/tipos', {
            titulo: `Meus tipos de ${planta}`,
            estilos: ['/privado/privadoStyle.css'],
            planta,
            tipos
        })
    })
}

function mostrarSafraPlanta(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.buscarSafra(idUsuario, planta, tipoPlanta, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar safra das plantas.')
        }

        if (resultado.length <= 0) {
            return res.status(404).send('Essa safra não existe')
        }

        const nomeTipoPlanta = formatarNomeExibicao(resultado[0].tipoPlanta);

        const safras = resultado.map(p => ({
            url: `/planta/${p.idPlanta}/mostrar`,
            nome: formatarNomeExibicao(p.safraNome),
            imagem: p.url || `/privado/img/${imagensPorTipo[p.tipoPlanta] || ''}`
        }))

        res.render('planta/safras', {
            titulo: `Meus tipos de ${nomeTipoPlanta}`,
            estilos: ['/privado/privadoStyle.css'],
            nomeTipoPlanta,
            safras
        })
    })
}

function atualizarSafraNome(req, res) {
    const idUsuario = req.session.usuario.idUsuario
    const idPlanta = req.params.idPlanta
    const safraNome = req.body.safraNome

    const safraValida = validar.validarSafraNome(safraNome)

    if (safraValida.erro) {
        return res.status(400).send(safraValida.erro)
    }

    const safraEnviar = safraValida.value

    plantaUsuarioModel.atualizarSafraNome(safraEnviar, idUsuario, idPlanta, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao atualizar o nome da safra.')
        }
        return res.redirect(`/planta/${idPlanta}/mostrar`)
    })
}

function atualizarLocalizacao(req, res) {

    const idUsuario = req.session.usuario.idUsuario
    const idPlanta = req.params.idPlanta

    const localizacao = validar.validarLocalizacao(req.body.latitude, req.body.longitude)

    if (localizacao.erro) {
        return res.status(400).send(localizacao.erro)
    }

    req.body.longitude = localizacao.value.longitude
    req.body.latitude = localizacao.value.latitude

    plantaUsuarioModel.atualizarLocalizacao(req.body, idUsuario, idPlanta, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao atualizar localizacao.')
        }
        return res.redirect(`/planta/${idPlanta}/mostrar`)
    })
}

function mostrarPlantaUsuario(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    plantaUsuarioModel.buscarPlantaPorIdPlanta(idUsuario, idPlanta, (erro, resultados) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar planta.')
        }

        if (resultados.length <= 0) {
            return res.status(404).send('Essa planta não existe')
        }

        const p = resultados[0];

        const nomeSafra = p.safraNome.charAt(0).toUpperCase() + p.safraNome.slice(1);

        res.render('planta/detalhes', {
            titulo: `Ver ${nomeSafra}`,
            estilos: ['/privado/privadoStyle.css'],
            idPlanta,
            nomeSafra,
            imagem: p.url || `/privado/img/${imagensPorTipo[p.tipoPlanta] || ''}`,
            nomeTipoPlanta: formatarNomeExibicao(p.tipoPlanta),
            quantidade: p.quantidade,
            dataPlantacao: p.data_plantacao.toLocaleDateString('pt-BR'),
            agrotoxico: p.agrotoxico === 'nao' ? 'Não' : 'Sim'
        })
    })
}

async function adicionarImagemSafra(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    if (!req.file) {
        return res.status(400).send('Envie uma imagem JPG, PNG ou WEBP.');
    }

    try {
        const resultado = await cloudinary.uploader.upload(req.file.path);
        const imagem = resultado.secure_url;

        plantaUsuarioModel.adicionarImagem(idUsuario, idPlanta, imagem, (erro) => {
            if (erro) {
                console.log(erro);
                return res.status(500).send('Erro ao salvar imagem.');
            }

            res.redirect(`/planta/${idPlanta}/mostrar`);
        })
    } catch (erro) {
        console.log(erro)
        return res.status(500).send('Falha ao salvar imagem.');

    } finally {

        try {
            await fs.unlink(req.file.path);
        } catch (erro) {
            console.log(erro)
        }
    }
}

function cadastrarAnotacao(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    const anotacao = validar.validarAnotacao(req.body.anotacao)

    if (anotacao.erro) {
        return res.status(400).send(anotacao.erro)
    }

    req.body.anotacao = anotacao.value

    plantaUsuarioModel.cadastrarAnotacao(req.body, idUsuario, idPlanta, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao cadastrar anotação.')
        }

        res.redirect(`/planta/${idPlanta}/veranotacoes`);
    })
}

function anotacoesPlanta(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    plantaUsuarioModel.buscarAnotacoes(idUsuario, idPlanta, (erro, resultado) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send('Erro ao buscar anotação');
        }

        if (resultado.length <= 0) {
            return res.status(404).send('Essa anotação não existe')
        }

        res.render('planta/anotacoes', {
            titulo: 'Anotações',
            estilos: ['/privado/privadoStyle.css'],
            idPlanta,
            comentario: resultado[0].comentarios || ''
        })
    })
}

function deletarPlanta(req, res) {

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    plantaUsuarioModel.deletarPlanta(idUsuario, idPlanta, (erro) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao excluir planta.')
        }
        res.redirect('/planta/minhasPlantas')
    })
}

module.exports = {
    pegarPlantasCalendario,
    pegarPlantasADMCalendario,
    criarPlantaUsuario,
    mostrarCategoriasPlanta,
    mostrarCategoriasTipoPlanta,
    mostrarSafraPlanta,
    atualizarSafraNome,
    atualizarLocalizacao,
    mostrarPlantaUsuario,
    adicionarImagemSafra,
    cadastrarAnotacao,
    anotacoesPlanta,
    deletarPlanta
}