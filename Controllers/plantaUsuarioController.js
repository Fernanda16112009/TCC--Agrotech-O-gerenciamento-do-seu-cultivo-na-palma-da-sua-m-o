const plantaUsuarioModel = require('../Model/plantaUsuarioModel');

function criarPlantaUsuario(req, res) {
    
    req.body.idUsuario = req.session.usuario.idUsuario;
    
    if(!req.body.latitude || !req.body.longitude){
        return res.status(400).send(
            "A localização é necessaria"
        )
    }

    plantaUsuarioModel.criarPlantaUsuario(req.body, (erro) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar planta.')
        }

        switch (req.body.tipoPlanta){

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
}

function mostrarPlantas(req, res) {

    const idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.buscarPlantaPorUsuario(idUsuario, (erro, resultados) => {
        
        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar planta.')
        }

        const cardPlanta = resultados.map(p =>`

            <h3>${p.nomePlanta}</h3><br>

            <form action="/planta/${p.idPlanta}" method="get" required>
                    <button class="btn_pg_inicial">Ver Mais informações</button><br><br>
            </form>
            
        `).join("<Br>")

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
                    <form action="/privado/cadastroPlanta" method="get" required>
                        <button class="btn_pg_inicial">Cadastrar nova planta</button><br><br>
                    </form>
                    <div>
                        ${cardPlanta}<br>
                    </div>
                    <form action="/" method="get" required>
                        <button class="btn_pg_inicial">Voltar</button><br><br>
                    </form>
                </main>

            </body>
            </html>
        `

        res.send(html)
    })
}

function mostrarPlantaUsuario(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

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
                <fieldset>
                    <legend><b>${p.nomePlanta}</b></legend>
                    <br>

                    <label>Seu tipo de planta:</label>
                    <p>${p.tipoPlanta.charAt(0).toUpperCase() + p.tipoPlanta.slice(1)}</p>

                    <br>

                    <label>Quantidade de sementes plantadas:</label>
                    <p>${p.quantidade}</p>

                    <br>

                    <label>Dia que sua semente foi plantada:</label>
                    <p>${p.data_plantacao.toLocaleDateString()}</p>
                    
                    <br>

                    <label>Você está utilizando agrotóxicos?</label>
                    <p>${agrotoxico}</p>
                    
                    <br>

                    <form action="/planta/${p.idPlanta}/anotacoes" method="get" required>
                        <button class="btn_pg_inicial">Suas anotações</button><br><br>
                    </form>

                    <form action="/planta/${p.idPlanta}/deletar" method="post" required>
                        <button class="btn_pg_inicial">Deletar planta</button><br><br>
                    </form>

                    </fieldset>

                <br>
                <form action="/planta/minhasPlantas" method="get" required>
                    <button class="btn_pg_inicial">Voltar</button><br><br>
                </form>

            </body>
            </html>
        `

        res.send(html)


    })

}

function cadastrarAnotacao(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    plantaUsuarioModel.cadastrarAnotacao(req.body, idUsuario, idPlanta,  (erro,) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar planta.')
        }

        res.redirect(`/planta/${idPlanta}/anotacoes`)
    })
}

function anotacoesPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

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
                <form action="/planta/${idUsuario}/${idPlanta}/anotacoes" method="post">
                <label for="anotacao" class="form_pergunta">Escreva suas anotações</label><br>
                <textarea name="anotacao" id="caixa_anotacao" class="caixa_anotacao" rows="20"  placeholder="Digite suas anotações">${a.anotacao}</textarea>
                <button type="submit">Salvar anotações</button>
                </form><br>
                <form action="/planta/${idPlanta}" method="get" required>
                    <button class="btn_pg_inicial">Voltar</button><br><br>
                </form>
            </main>
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
    criarPlantaUsuario,
    mostrarPlantas,
    mostrarPlantaUsuario,
    deletarPlanta,
    anotacoesPlanta,
    cadastrarAnotacao
} 
