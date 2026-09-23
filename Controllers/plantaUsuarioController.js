const plantaUsuarioModel = require('../Model/plantaUsuarioModel');
const plantaADMModel = require('../Model/plantaAdmModel');

function pegarPlantasCalendario(req,res) {
    const idUsuario = req.session.usuario.idUsuario;
    
    plantaUsuarioModel.buscarPlantasCalendario(idUsuario, (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.send('Erro ao buscar plantas do calendário.');
        }
        return res.json(resultados);
        
    });
}

function pegarPlantasADMCalendario(req,res) {
    
    plantaADMModel.buscarPlantasAdmCalendario( (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.send('Erro ao buscar plantas do calendário.');
        }

        return res.json(resultados);
        
    });
}

function formatarNomePlanta(texto) {
    const comEspacos = texto.replace(/([A-Z])/g, ' $1').trim();
    return comEspacos.charAt(0).toUpperCase() + comEspacos.slice(1);
}

function criarPlantaUsuario(req, res) {
    
    req.body.idUsuario = req.session.usuario.idUsuario;
    
    if(!req.body.latitude || !req.body.longitude){
        return res.status(400).send(
            "A localização é necessaria"
        )
    }


    const idUsuario = req.body.idUsuario
    
    const tipoPlanta = req.body.tipoPlanta

    plantaUsuarioModel.buscarNumeroSafra(idUsuario, tipoPlanta, (erro, resultado) =>{
        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar numero da safra.')
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
                return res.send('Erro ao cadastrar planta.')
            }

            switch (tipoPlanta){

                case "morangoAlbino":
                    res.redirect('/privado/instrucoesPlantas/morangoAlbino');
                    break;
                case "morangoCaminoReal":
                    res.redirect('/privado/instrucoesPlantas/morangoCaminoReal');
                    break;
                case "morangoSanAndreas":
                    res.redirect('/privado/instrucoesPlantas/morangoSanAndreas');
                    break;
                case "cenouraTradicional":
                    res.redirect('/privado/instrucoesPlantas/cenouraTradicional');
                    break;
                case "pepinoCaipira":
                    res.redirect('/privado/instrucoesPlantas/pepinoCaipira');
                    break;
                case "pepinoConserva":
                    res.redirect('/privado/instrucoesPlantas/pepinoConserva');
                    break;
                case "pepinoJapones":
                    res.redirect('/privado/instrucoesPlantas/pepinoJapones');
                    break;
                case "tomateCereja":
                    res.redirect('/privado/instrucoesPlantas/tomateCereja');
                    break;
                case "tomateLongaVida":
                    res.redirect('/privado/instrucoesPlantas/tomateLongaVida');
                    break;
                case "tomateSaladete":
                    res.redirect('/privado/instrucoesPlantas/tomateSaladete');
                    break;
            } 
        })

    })


}

function mostrarCategoriasPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.checarCategoriaPlanta(idUsuario, (erro,resultado) =>{
        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar categoria das plantas.')
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
            return res.send('Erro ao buscar categoria dos tipos das plantas.')
        }

        const imagensPorTipo = {
            morangoAlbino: 'morangoAlb.png',
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
            return res.send('Erro ao buscar safra das plantas.')
        }
        const nomeTipoPlanta = formatarNomePlanta(resultado[0].tipoPlanta);
        plantaUsuarioModel.atualizarSafraNome(resultado[0].safraNome, idUsuario, resultado[0].idPlanta, (erro) =>{
            
            if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar o nome da safra.')
            }

            const imagensPorTipo = {
                morangoAlbino: 'morangoAlb.png',
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

            const cardPlanta = resultado.map(p =>{
                const nomeSafra = formatarNomePlanta(p.safraNome)
                const imagemTipoPlanta = imagensPorTipo[p.tipoPlanta] || '';

                return `
                    <form action="/planta/${planta}/${p.tipoPlanta}/${p.idPlanta}" method="get" required>
                        <button class="card-planta">
                            <img src="/privado/img/${imagemTipoPlanta}" alt="${nomeTipoPlanta}" class="card-icon">
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
    })
}

function atualizarSafraNome(req,res){
    const idUsuario = req.params.idUsuario
    const idPlanta = req.params.idPlanta
    const safraNome = req.body.safraNome
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.atualizarSafraNome(safraNome, idUsuario, idPlanta, (erro) =>{
            if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar o nome da safra.')
        }
        return res.redirect(`/planta/${planta}/${tipoPlanta}/${idPlanta}`)
    })
}

function atualizarLocalizacao(req,res){
    const idUsuario = req.params.idUsuario
    const idPlanta = req.params.idPlanta
    const localizacao = req.body
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.atualizarLocalizacao(localizacao, idUsuario, idPlanta, (erro) =>{
            if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar localizacao.')
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
            return res.send('Erro ao buscar planta.')
        }


        const p = resultados[0];

        const agrotoxico = p.agrotoxico === "nao" ? "Não" : "Sim";

        // Apenas para exibição: transforma "tomateCereja" em "Tomate Cereja"
        // e escolhe a imagem já usada nas outras telas para esse tipo de planta.
        function formatarNomeExibicao(texto) {
            return texto
                .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                .replace(/^./, (c) => c.toUpperCase());
        }

        const imagensPorTipo = {
            morangoAlbino: 'morangoAlb.png',
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

        const imagemPlanta = `/privado/img/${imagensPorTipo[p.tipoPlanta] || ''}`;
        const nomeTipoPlantaExibicao = formatarNomeExibicao(p.tipoPlanta);
        const nomeSafraExibicao = p.safraNome.charAt(0).toUpperCase() + p.safraNome.slice(1);

        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ver ${nomeTipoPlantaExibicao}</title>
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
                                <img src="${imagemPlanta}" alt="${nomeTipoPlantaExibicao}" class="planta-imagem">
                            </div>

                            <p class="planta-nome">${nomeTipoPlantaExibicao}</p>

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

                            <form action="/planta/${idUsuario}/${idPlanta}/${planta}/${tipoPlanta}" method="post" class="campo">
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
                                <form action="/planta/${idUsuario}/${idPlanta}/${planta}/${tipoPlanta}/localizacao" method="post" class="form-localizacao">
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

function cadastrarAnotacao(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;
    const planta = req.params.planta
    const tipoPlanta = req.params.tipoPlanta

    plantaUsuarioModel.cadastrarAnotacao(req.body, idUsuario, idPlanta,  (erro,) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar planta.')
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
            return res.send('Erro ao buscar anotação');
        }


        const a = resultado[0]

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
                            <form action="/planta/${idUsuario}/${idPlanta}/${planta}/${tipoPlanta}/anotacoes" method="post" class="campo">
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
            return res.send('Erro ao excluir planta.')
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
    cadastrarAnotacao,
    anotacoesPlanta,
    deletarPlanta
} 
