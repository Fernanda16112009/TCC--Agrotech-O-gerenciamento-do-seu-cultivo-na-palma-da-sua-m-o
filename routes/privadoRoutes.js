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
        case "praga1":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'praga1.html'))
            break;
        case "praga2":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'praga2.html'))
            break;
        case "praga3":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'praga3.html'))
            break;
        case "praga4":
            res.sendFile (path.join(__dirname, '..', 'privado', 'pragas', 'praga4.html'))
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