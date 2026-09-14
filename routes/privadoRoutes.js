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

router.get('/redeSocial', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'redeSocial.html'));
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

router.get('/instrucoesPlantas/:planta', (req, res) => {
    let planta = req.params.planta

    switch (planta) {
        case "morango":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','morango.html'));
            break;
        case "cenoura":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','cenoura.html'));
            break;
        case "pepino":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','pepino.html'));
            break;
        case "tomate":
            res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','tomate.html'));
            break;
    }
});

router.get('/configuracoes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'configuracoes.html'));
});

router.get('/cadastroPlantaUsuario.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.js'));
});

module.exports = router