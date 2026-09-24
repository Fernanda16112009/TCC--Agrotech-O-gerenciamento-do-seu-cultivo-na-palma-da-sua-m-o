const express = require('express')
const router = express.Router()
const path = require('path');
const plantaUsuarioController = require('../Controllers/plantaUsuarioController')


router.get('/pg_entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'pg_entrar.html'));
});

router.get('/escolherPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'escolherCadastro.html'));
});

router.get('/calendario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'calendario.html'));
});

router.get('/cadastroPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.html'));
});

router.get('/areaDePragas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'areaDePragas.html'));
});

router.get('/pragas/:praga', (req, res) => {
    let praga = req.params.praga

    switch (praga) {
        case "acaros":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'acaros.html'))
            break;
        case "brocas":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'brocas.html'))
            break;
        case "lagartas":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'lagartas.html'))
            break;
        case "lesmasECaramujos":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'lesmasECaramujos.html'))
            break;
        case "moscaBranca":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'moscaBranca.html'))
            break;
        case "moscaDaCenoura":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'moscaDaCenoura.html'))
            break;
        case "moscaDasFrutas":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'moscaDasFrutas.html'))
            break;
        case "nematoides":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'nematoides.html'))
            break;
        case "pulgoes":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'pulgoes.html'))
            break;
        case "tripes":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'tripes.html'))
            break;
    }
});

router.get('/tipos/:planta', (req, res) => {
    let planta = req.params.planta

    switch (planta) {
        case "morango":
             res.sendFile (path.join(__dirname, '..', 'privado', 'tipos', 'tiposMorango.html'))
            break;
        case "cenoura":
             res.sendFile (path.join(__dirname, '..', 'privado', 'tipos', 'tiposCenoura.html'))
            break;
        case "pepino":
             res.sendFile (path.join(__dirname, '..', 'privado', 'tipos', 'tiposPepino.html'))
            break;
        case "tomate":
             res.sendFile (path.join(__dirname, '..', 'privado', 'tipos', 'tiposTomate.html'))
            break;
    }
});

router.get('/tipos/:planta/:tipo', (req, res) => {

    const planta = req.params.planta;
    const tipo = req.params.tipo;

    res.redirect(`/privado/cadastroPlanta?planta=${planta}&tipo=${tipo}`);
});

router.get('/instrucoesPlantas/:tipoPlanta', (req, res) => {
    let tipoPlanta = req.params.tipoPlanta

    switch (tipoPlanta) {    
        case "morangoAlbino":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','morangoAlbion.html'));
            break;
        case "morangoCaminoReal":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','morangoCaminoReal.html'));            
            break;
        case "morangoSanAndreas":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','morangoSanAndreas.html'));            
            break;
        case "cenouraTradicional":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','cenoura.html'));            
            break;
        case "pepinoCaipira":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','pepinoCaipira.html'));            
            break;
        case "pepinoConserva":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','pepinoConserva.html'));            
            break;
        case "pepinoJapones":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','pepinoJapones.html'));            
            break;
        case "tomateCereja":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','tomateCereja.html'));            
            break;
        case "tomateLongaVida":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','tomateLongaVida.html'));            
            break;
        case "tomateSaladete":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','tomateSaladete.html'));            
            break;
    }
});

router.get('/configuracoes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'configuracoes.html'));
});

router.get('/cadastroPlantaUsuario.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.js'));
});

router.get('/teste', (req, res) => {
    res.sendFile(path.join (__dirname, '..','teste.html'));
});

module.exports = router