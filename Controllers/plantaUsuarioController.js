const plantaUsuarioModel = require('../Model/plantaUsuarioModel');

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

            switch (req.body.planta){

                case "morango":
                    res.redirect('/privado/instrucoesPlantas/morango');
                    break;
                case "cenoura":
                    res.redirect('/privado/instrucoesPlantas/cenoura');
                    break;
                case "pepino":
                    res.redirect('/privado/instrucoesPlantas/pepino');
                    break;
                case "tomate":
                    res.redirect('/privado/instrucoesPlantas/tomate');
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
        

        const cardPlanta = resultado.map(p =>{
            const nomePlanta = p.planta.charAt(0).toUpperCase() + p.planta.slice(1);
            return`
            <h3>${nomePlanta}</h3><br>

            <form action="/planta/${p.planta}" method="get" required>
                    <button class="btn_pg_inicial">Ver Mais informações</button><br><br>
            </form>
            
        `}).join("<Br>")

        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Minhas Plantas</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>

                <main>
                    <div class="form">
                        <h1>Minhas plantas</h1><br><br>
                        <div>
                            ${cardPlanta}<br>
                        </div>
                        <form action="/privado/escolherPlanta" method="get" required>
                            <button class="btn_pg_inicial">Cadastrar nova planta</button><br><br>
                        </form>
                        <form action="/" method="get" required>
                            <button class="btn_pg_inicial">Voltar</button><br><br>
                        </form>
                    </div>
                </main>
                <footer>
                    <p>rodapé</p>
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


        const cardPlanta = resultados.map(p =>{
            const nomeTipoPlanta = p.tipoPlanta.charAt(0).toUpperCase() + p.tipoPlanta.slice(1);
            return`
            <h3>${nomeTipoPlanta}</h3><br>

            <form action="/planta/${planta}/${p.tipoPlanta}" method="get" required>
                    <button class="btn_pg_inicial">Ver Mais informações</button><br><br>
            </form>
            
        `}).join("<Br>")

        
        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Meus tipo de ${planta}</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>

                <main>
                    <div class="form">
                        <h1>Meus tipo de ${planta}</h1><br><br>
                        <div>
                            ${cardPlanta}<br>
                        </div>
                        <form action="/planta/minhasPlantas" method="get" required>
                            <button class="btn_pg_inicial">Voltar</button><br><br>
                        </form>
                    </div>
                </main>
                <footer>
                    <p>rodapé</p>
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

        const nomeTipoPlanta = resultado[0].tipoPlanta.charAt(0).toUpperCase() + resultado[0].tipoPlanta.slice(1);
        
        plantaUsuarioModel.atualizarSafraNome(resultado[0].safraNome, idUsuario, resultado[0].idPlanta, (erro) =>{
            
            if (erro) {
            console.log(erro)
            return res.send('Erro ao atualizar o nome da safra.')
            }
        
            const cardPlanta = resultado.map(p =>{
                return`
                <h3>${p.safraNome.charAt(0).toUpperCase() + p.safraNome.slice(1)}</h3><br>

                <form action="/planta/${planta}/${p.tipoPlanta}/${p.idPlanta}" method="get" required>
                        <button class="btn_pg_inicial">Ver Mais informações</button><br><br>
                </form>
                
            `}).join("<Br>")

            
            const html = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Meus tipo de ${nomeTipoPlanta}</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>

                    <main>
                        <div class="form">
                            <h1>Meus tipo de ${nomeTipoPlanta}</h1><br><br>
                            <div>
                                ${cardPlanta}<br>
                            </div>
                            <form action="/planta/minhasPlantas" method="get" required>
                                <button class="btn_pg_inicial">Voltar</button><br><br>
                            </form>
                        </div>
                    </main>
                    <footer>
                        <p>rodapé</p>
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

        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ver Planta</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <main>
                    <fieldset>

                        <form action="/planta/${idUsuario}/${idPlanta}/${planta}/${tipoPlanta}" method="post">
                            <label>Nome da safra</label>
                            <textarea type="text" name="safraNome" class="safraNome">${p.safraNome.charAt(0).toUpperCase() + p.safraNome.slice(1)}</textarea><br>
                            <button type="submit">Trocar nome da safra</button>
                        </form>

                        <br>
                        
                        <label>Sua planta é</label>
                        <p>${p.tipoPlanta.charAt(0).toUpperCase() + p.tipoPlanta.slice(1)}</p>

                        <br>

                        <label>Quantidade de sementes plantadas:</label>
                        <p>${p.quantidade} sementes plantadas</p>

                        <br>

                        <label>Dia que sua semente foi plantada:</label>
                        <p>${p.data_plantacao.toLocaleDateString()}</p>
                        
                        <br>

                        <form action="/planta/${idUsuario}/${idPlanta}/${planta}/${tipoPlanta}/localizacao" method="post">
                            <label for="localizacao" class="form_pergunta">Gostaria de mudar a localização da sua planta? Certifique-se de estar no local exato em que você gostaria de plantar</label><br>
                            <input type="hidden"  id="longitude" name="longitude" required>
                            <input type="hidden" id="latitude" name="latitude" required>
                            <button type="button" id="btn_mapa" >Selecionar localização</button><br>
                            <button type="submit" >Atualizar localização</button>
                        </form>

                        <p id="mensagemLocalizacao"></p>

                        <br>                        

                        <label>Você está utilizando agrotóxicos?</label>
                        <p>${agrotoxico}</p>
                        
                        <br>

                        <form action="/planta/${idPlanta}/${planta}/${tipoPlanta}/anotacoes" method="get">
                            <button class="btn_pg_inicial" type ="submit">Suas anotações</button><br><br>
                        </form>

                        <form action="/planta/${idPlanta}/deletar" method="post" required>
                            <button class="btn_pg_inicial" onclick="return confirm('Excluir ${p.safraNome}?')">Deletar planta</button><br><br>
                        </form>

                        <br>
                        <form action="/planta/minhasPlantas" method="get">
                            <button class="btn_pg_inicial">Voltar</button><br><br>
                        </form>
                    </fieldset>

                </main>

                <footer>
                    <p>rodapé</p>
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
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Anotações</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
            <header>
                <h1>Anotações</h1>
            </header>
            <main>
                <form action="/planta/${idUsuario}/${idPlanta}/${planta}/${tipoPlanta}/anotacoes" method="post">
                    <label for="anotacao" class="form_pergunta">Escreva suas anotações</label><br>
                    <textarea name="anotacao" id="caixa_anotacao" class="caixa_anotacao" rows="20"  placeholder="Digite suas anotações">${a.comentarios ||  "" }</textarea>
                    <button type="submit">Salvar anotações</button>
                </form><br>
                <form action="/planta/${planta}/${tipoPlanta}/${idPlanta}" method="get" required>
                    <button class="btn_pg_inicial">Voltar</button><br><br>
                </form>
            </main>
            <footer>
                <p>rodapé</p>
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
