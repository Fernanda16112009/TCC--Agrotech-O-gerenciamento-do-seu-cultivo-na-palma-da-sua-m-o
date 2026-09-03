const express = require('express')
const router = express.Router()
const path = require('path');
const plantaUsuarioController = require('../Controllers/plantaUsuarioController')


router.get('/pg_entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'pg_entrar.html'));
});

router.get('/cadastroPlantaUsuario.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.js'));
});

router.get('/calendario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'calendario.html'));
});

router.get('/cadastroPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.html'));
});

router.get('/escolherPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'escolherCadastro.html'));
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

module.exports = router