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

router.get('/instrucoesPlantas/morango', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas','morango.html'));
});

router.get('/escolherPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'escolherCadastro.html'));
});

router.get('/tipos/morango', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'tipos', 'tiposMorango.html'));
});

router.get('/tipos/cenoura', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'tipos', 'tiposCenoura.html'));
});

router.get('/tipos/pepino', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'tipos', 'tiposPepino.html'));
});

router.get('/tipos/tomate', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'tipos', 'tiposTomate.html'));
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