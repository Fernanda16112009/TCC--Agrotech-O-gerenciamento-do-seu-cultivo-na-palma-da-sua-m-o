const plantaUsuarioModel = require('../Model/plantaUsuarioModel');
const plantaADMModel = require('../Model/plantaAdmModel');
const tiposPorPlanta = require('../Constantes/plantas')
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require('fs/promises');

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

const diasAtraso = 60
const diasAdiantado = 30
const formato = /^\d{4}-\d{2}-\d{2}$/

function pegarPlantasCalendario(req,res) {
    const idUsuario = req.session.usuario.idUsuario;
    
    plantaUsuarioModel.buscarPlantasCalendario(idUsuario, (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send('Erro ao buscar plantas do calendário.');
        }
        return res.json(resultados);
        
    });
}

function pegarPlantasADMCalendario(req,res) {
    
    plantaADMModel.buscarPlantasAdmCalendario( (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send('Erro ao buscar plantas do calendário.');
        }

        return res.json(resultados);
        
    });
}

function formatarNomePlanta(texto) {
    const comEspacos = texto.replace(/([A-Z])/g, ' $1').trim();
    return comEspacos.charAt(0).toUpperCase() + comEspacos.slice(1);
}

function validarData(textoData){


    if(!textoData){
        return { erro: "É necessário uma data para plantio" }
    }

    if(typeof textoData !== 'string' || !formato.test(textoData)){
        return { erro: "É necessário uma data válida para plantio" }
    }

    const diaPlantacao = new Date(textoData)

    if(Number.isNaN(diaPlantacao.getTime()) || diaPlantacao.toISOString().slice(0, 10) !== textoData){
        return { erro: "É necessário uma data válida para plantio" }
    }

    // 4) janela de dias: "hoje" também em meia-noite UTC
    const agora = new Date()
    const hojeUTC = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate())

    const diferencaDias = Math.round((diaPlantacao.getTime() - hojeUTC) / 86400000)

    if(diferencaDias > diasAdiantado || diferencaDias < -diasAtraso){
        return { erro: `O dia da plantação deve estar entre ${diasAtraso} dias atrás e ${diasAdiantado} dias à frente` }
    }

    return { valor: textoData }
}

function validarCadastroPlanta(formulario){

    const tipoPlanta = formulario.tipoPlanta
    const planta = formulario.planta
    const latitude = Number(formulario.latitude)
    const longitude = Number(formulario.longitude)
    const quantidade = Number(formulario.quantidade)
    const agrotoxico = formulario.agrotoxico

    if(!Object.hasOwn(tiposPorPlanta, planta)){
        return { erro: "Sua planta não é válida" }
    }

    if(!tiposPorPlanta[planta].includes(tipoPlanta)){
        return { erro: "O tipo da sua planta não é válido" }
    }

    if(agrotoxico !== "sim" && agrotoxico !== "nao"){
        return { erro: "A resposta para agrotóxico deve ser sim ou não" }
    }


    if(!Number.isFinite(latitude) || !Number.isFinite(longitude) || !latitude || !longitude){
        return { erro: "A localização é necessaria" }
    }

    if(!Number.isInteger(quantidade) || quantidade <= 0){
        return { erro: "Quantidade de sementes inválida" }
    }

    return { valor: 
        {
            latitude: latitude,
            longitude:longitude, 
            quantidade:quantidade
        }
    }

}




function criarPlantaUsuario(req, res) {

    req.body.idUsuario = req.session.usuario.idUsuario;

    const tipoPlanta = req.body.tipoPlanta

    const idUsuario = req.body.idUsuario

    const formularioValido = validarCadastroPlanta(req.body)

    if (formularioValido.erro){
        return res.status(400).send(formularioValido.erro)
    }

    const data = validarData(req.body.data_plantacao)

    if (data.erro){
        return res.status(400).send(data.erro)
    }


    req.body.quantidade = formularioValido.valor.quantidade
    req.body.longitude = formularioValido.valor.longitude
    req.body.latitude = formularioValido.valor.latitude  
    req.body.data_plantacao = data.valor

    plantaUsuarioModel.buscarNumeroSafra(idUsuario, tipoPlanta, (erro, resultado) =>{
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

function mostrarCategoriasPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.checarCategoriaPlanta(idUsuario, (erro,resultado) =>{
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

        const cardPlanta = resultado.map(p =>{
            const nomePlanta = formatarNomePlanta(p.planta);
            const imagemPlanta = imagensPorPlanta[p.planta] || '';

            return `
                <form action="/planta/${p.planta}" method="get" required>
                    <button class="card-planta">
                        <img src="/privado/img/${imagemPlanta}" alt="${nomePlanta}" class="card-icon">
                        <span>${nomePlanta}</span>
                    </button>
                </form>`
            }).join("")

        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Minhas Plantas</title>
                <link rel="stylesheet" href="/privado/privadoStyle.css">
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>

                <main>
                    <div class="plantas-container">
                        <h1 class="titulo-pagina">Qual planta você quer verificar?</h1>

                        <div class="plantas-grid">
                            <form action="/privado/escolherPlanta" method="get" required>
                                <button class="card-planta card-add">
                                    <img src="/privado/img/adicionar.png" alt="Adicionar planta" class="card-icon">
                                    <span>Adicionar planta</span>
                                </button>
                            </form>

                            ${cardPlanta}
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

function mostrarCategoriasTipoPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const planta = req.params.planta

    plantaUsuarioModel.checarCategoriaTipoPlanta(idUsuario, planta, (erro, resultados) =>{
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar categoria dos tipos das plantas.')
        }



        const cardPlanta = resultados.map(p =>{
            const nomeTipoPlanta = formatarNomePlanta(p.tipoPlanta);
            const imagemTipoPlanta = imagensPorTipo[p.tipoPlanta] || '';

            return `
                <form action="/planta/${planta}/${p.tipoPlanta}" method="get" required>
                    <button class="card-planta">
                        <img src="/privado/img/${imagemTipoPlanta}" alt="${nomeTipoPlanta}" class="card-icon">
                        <span class="card-titulo">${nomeTipoPlanta}</span>
                        <span class="card-subtitulo">Ver safras de ${nomeTipoPlanta}</span>
                    </button>
                </form>`
            }).join("")


        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Meus tipo de ${planta}</title>
                <link rel="stylesheet" href="/privado/privadoStyle.css">
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>

                <main>
                    <div class="plantas-container">
                        <h1 class="titulo-pagina">Meus tipos de ${planta}</h1>

                        <div class="plantas-grid">
                            ${cardPlanta}
                        </div>

                        <form action="/planta/minhasPlantas" method="get">
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

function mostrarSafraPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.buscarSafra(idUsuario, planta, tipoPlanta, (erro, resultado) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar safra das plantas.')
        }

        if(resultado.length <= 0){
            console.log(erro)
            return res.status(404).send('Essa safra não existe')
        }

        const nomeTipoPlanta = formatarNomePlanta(resultado[0].tipoPlanta);
        
        
        if (erro) {
        console.log(erro)
        return res.status(500).send('Erro ao atualizar o nome da safra.')
        }

        const cardPlanta = resultado.map(p =>{

            const nomeSafra = formatarNomePlanta(p.safraNome)
            const imagemTipoPlanta = p.url || `/privado/img/${imagensPorTipo[p.tipoPlanta] || ""}`;


            return `
                <form action="/planta/${planta}/${p.tipoPlanta}/${p.idPlanta}" method="get" required>
                    <button class="card-planta">
                        <img src="${imagemTipoPlanta}" alt="${nomeTipoPlanta}" class="card-icon">
                        <span class="card-titulo">${nomeSafra}</span>
                        <span class="card-subtitulo">Ver detalhes</span>
                    </button>
                </form>`
            }).join("")

        
        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Meus tipo de ${nomeTipoPlanta}</title>
                <link rel="stylesheet" href="/privado/privadoStyle.css">
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>

                <main>
                    <div class="plantas-container">
                        <h1 class="titulo-pagina">Meus tipos de ${nomeTipoPlanta}</h1>

                        <div class="plantas-grid">
                            ${cardPlanta}
                        </div>

                        <form action="/planta/minhasPlantas" method="get">
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

function atualizarSafraNome(req,res){
    const idUsuario = req.session.usuario.idUsuario
    const idPlanta = req.params.idPlanta
    const safraNome = req.body.safraNome
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.atualizarSafraNome(safraNome, idUsuario, idPlanta, (erro) =>{
            if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao atualizar o nome da safra.')
        }
        return res.redirect(`/planta/${planta}/${tipoPlanta}/${idPlanta}`)
    })
}

function atualizarLocalizacao(req,res){
    const idUsuario = req.session.usuario.idUsuario
    const idPlanta = req.params.idPlanta
    const localizacao = req.body
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.atualizarLocalizacao(localizacao, idUsuario, idPlanta, (erro) =>{
            if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao atualizar localizacao.')
        }
        return res.redirect(`/planta/${planta}/${tipoPlanta}/${idPlanta}`)
    })
}

function mostrarPlantaUsuario(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.buscarPlantaPorIdPlanta(idUsuario, idPlanta, (erro, resultados) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao buscar planta.')
        }

        let p

        if(resultados.length <= 0){
            console.log(erro)
            return res.status(500).send('Essa planta não existe')
        }else{
            p = resultados[0];
        }

        const agrotoxico = p.agrotoxico === "nao" ? "Não" : "Sim";

        // Apenas para exibição: transforma "tomateCereja" em "Tomate Cereja"
        // e escolhe a imagem já usada nas outras telas para esse tipo de planta.
        function formatarNomeExibicao(texto) {
            return texto
                .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                .replace(/^./, (c) => c.toUpperCase());
        }

        const imagemPlanta = p.url || `/privado/img/${imagensPorTipo[p.tipoPlanta] || ""}`;
        const nomeTipoPlantaExibicao = formatarNomeExibicao(p.tipoPlanta);
        const nomeSafraExibicao = p.safraNome.charAt(0).toUpperCase() + p.safraNome.slice(1);

        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ver ${nomeSafraExibicao}</title>
                <link rel="stylesheet" href="/privado/privadoStyle.css">
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>
                <main>
                    <div class="planta-pagina">

                        <div class="planta-hero">
                            <form action="/planta/minhasPlantas" method="get">
                                <button class="btn-voltar" type="submit" title="Voltar">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </form>

                            <div class="planta-imagem-wrapper">
                                <img src="${imagemPlanta}" alt="${nomeSafraExibicao}" class="planta-imagem">
                            </div>

                            <p class="planta-nome">${nomeSafraExibicao}</p>

                            <form action="/planta/${idPlanta}/${planta}/${tipoPlanta}/anotacoes" method="get">
                                <button class="btn-anotacoes" type="submit" title="Suas anotações">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="4" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                                        <path d="M7.5 8h7M7.5 11.5h7M7.5 15h4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <div class="info-card">

                            <form action="/planta/${idPlanta}/${planta}/${tipoPlanta}/imagem" method="post" enctype="multipart/form-data" class="form-foto">
                                <label for="imagem" class="form_pergunta">Foto da sua plantação</label>
                                <input type="file" id="imagem" name="imagem" class="imagem" accept="image/*">
                                <button type="submit" class="btn-foto">Adicionar foto da plantação</button>
                            </form>

                            <form action="/planta/${idPlanta}/${planta}/${tipoPlanta}" method="post" class="campo">
                                <label for="safraNome" class="form_pergunta">Nome da safra</label>
                                <textarea id="safraNome" name="safraNome" class="safraNome">${nomeSafraExibicao}</textarea>
                                <button type="submit" class="btn-secundario">Trocar nome da safra</button>
                            </form>

                            <div class="info-item">
                                <span class="form_pergunta">Sua planta é</span>
                                <p class="info-valor">${nomeTipoPlantaExibicao}</p>
                            </div>

                            <div class="info-item">
                                <span class="form_pergunta">Quantidade de sementes plantadas</span>
                                <p class="info-valor">${p.quantidade} sementes plantadas</p>
                            </div>

                            <div class="info-item">
                                <span class="form_pergunta">Dia que sua semente foi plantada</span>
                                <p class="info-valor">${p.data_plantacao.toLocaleDateString()}</p>
                            </div>

                            <div class="campo">
                                <label for="btn_mapa" class="form_pergunta">Gostaria de mudar a localização da sua planta? Certifique-se de estar no local exato em que você gostaria de plantar</label>
                                <form action="/planta/${idPlanta}/${planta}/${tipoPlanta}/localizacao" method="post" class="form-localizacao">
                                    <input type="hidden" id="longitude" name="longitude" required>
                                    <input type="hidden" id="latitude" name="latitude" required>
                                    <button type="button" id="btn_mapa" class="btn-localizacao">Selecionar localização</button>
                                    <p id="mensagemLocalizacao" class="mensagem-localizacao"></p>
                                    <button type="submit" class="btn-cadastro">Atualizar localização</button>
                                </form>
                            </div>

                            <div class="info-item">
                                <span class="form_pergunta">Você está utilizando agrotóxicos?</span>
                                <p class="info-valor">${agrotoxico}</p>
                            </div>

                            <form action="/planta/${idPlanta}/deletar" method="post" class="form-deletar">
                                <button class="btn-perigo" type="submit" onclick="return confirm('Excluir ${p.safraNome}?')">Deletar planta</button>
                            </form>

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
                <script src="/privado/cadastroPlantaUsuario.js"></script>
            </body>
            </html>
        `

        res.send(html)


    })

}

async function adicionarImagemSafra(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta


    if(!req.file){
        return res.status(400).send('Envie uma imagem JPG, PNG ou WEBP.');
    }

    try{
        const resultado = await cloudinary.uploader.upload(req.file.path);
        const imagem = resultado.secure_url;

        plantaUsuarioModel.adicionarImagem(idUsuario, idPlanta, imagem, (erro) => {

            if (erro) {
                console.log(erro);
                return res.status(500).send('Erro ao salvar imagem.');
            }

            res.redirect(`/planta/${planta}/${tipoPlanta}/${idPlanta}`);
        })
    }catch(erro){
        console.log(erro)
        return res.status(500).send('Falha ao salvar imagem.');

    }finally{

        try{
            await fs.unlink(req.file.path);
        }catch(erro){
            console.log(erro)
        }
        
    }

}

function cadastrarAnotacao(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.cadastrarAnotacao(req.body, idUsuario, idPlanta,  (erro,) => {
        if (erro) {
            console.log(erro)
            return res.status(500).send('Erro ao cadastrar planta.')
        }

        res.redirect(`/planta/${idPlanta}/${planta}/${tipoPlanta}/anotacoes`);
    })
}

function anotacoesPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.buscarAnotacoes(idUsuario, idPlanta, (erro, resultado) => {
        if (erro) {
            console.log(erro);
            return res.status(500).send('Erro ao buscar anotação');
        }

        let a

        if(resultado.length <= 0){
            console.log(erro)
            return res.status(500).send('Essa anotação não existe')
        }else{
            a = resultado[0];
        }


        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Anotações</title>
                <link rel="stylesheet" href="/privado/privadoStyle.css">
                <script src="/js/vlibras.js" defer></script>
            </head>
            <body>
                <main>
                    <div class="anotacoes-pagina">
                        <h1 class="titulo-pagina">Anotações</h1>

                        <div class="anotacoes-card">
                            <form action="/planta/${idPlanta}/${planta}/${tipoPlanta}/anotacoes" method="post" class="campo">
                                <label for="caixa_anotacao" class="form_pergunta">Escreva suas anotações</label>
                                <textarea name="anotacao" id="caixa_anotacao" class="caixa_anotacao" placeholder="Digite suas anotações">${a.comentarios || ""}</textarea>
                                <button type="submit" class="btn-cadastro">Salvar anotações</button>
                            </form>
                        </div>

                        <form action="/planta/${planta}/${tipoPlanta}/${idPlanta}" method="get" class="form-voltar">
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

function deletarPlanta(req, res) {
    
    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    plantaUsuarioModel.deletarPlanta(idUsuario, idPlanta,  (erro) => {
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
