const plantaUsuarioModel = require('../Model/plantaUsuarioModel');

function criarPlantaUsuario(req, res) {

    
    req.body.idUsuario = req.session.usuario.idUsuario;
    
    console.log(req.body)
    
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

function mostrarPlantasUsuario(req, res) {

    const idUsuario = req.session.usuario.idUsuario;

    plantaUsuarioModel.buscarPlantaPorUsuario(idUsuario, (erro, resultados) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar planta.')
        }
        if (resultados.length === 0) {
            return res.send('Plantas não encontradas.')
        }


        const cardPlanta = resultados.map(p => `

            <h3>${p.nomePlanta}</h3><br>

            <a href="/planta/${p.idPlanta}">Ver Mais informações</a>
            
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
                        ${cardPlanta}
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

function mostrarPlanta(req,res){

    const idUsuario = req.session.usuario.idUsuario;
    const idPlanta = req.params.idPlanta;

    plantaUsuarioModel.buscarPlantaPorIdPlanta(idUsuario, idPlanta, (erro, resultados) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao buscar planta.')
        }
        if (resultados.length === 0) {
            return res.send('Plantas não encontradas.')
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

                    </fieldset>

                <br>
                <a href="/planta/minhasPlantas">Voltar</a>

            </body>
            </html>
        `

        res.send(html)


    })

}

module.exports = {
    criarPlantaUsuario,
    mostrarPlantasUsuario,
    mostrarPlanta
} 
