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


router.get('/cadastroPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.html'));
});

router.get('/instrucoesPlantas/morango', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','morango.html'));
});

router.get('/instrucoesPlantas/cenoura', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','cenoura.html'));
});

router.get('/instrucoesPlantas/pepino', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','pepino.html'));
});

router.get('/instrucoesPlantas/tomate', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','tomate.html'));
});

router.get('/configuracoes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'configuracoes.html'));
});

module.exports = router