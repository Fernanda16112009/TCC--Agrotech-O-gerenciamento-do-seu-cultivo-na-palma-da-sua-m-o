const express = require('express')
const router = express.Router()
const path = require('path');


const usuarioController = require('../Controllers/usuarioController')

//Páginas
router.get('/cadastroUsuario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public','cadastroUsuario.html'));
});
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public','login.html'));
});

router.get('/emailRecuperarSenha', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public','emailRecuperaSenha.html'));
});


//Funções
router.post('/', usuarioController.criarUsuario)
router.post('/login', usuarioController.logarUsuario)
router.get('/buscarNomes', usuarioController.buscarNomeUsuario)
router.get('/bancoemails', usuarioController.buscarEmail)
router.post('/email', usuarioController.enviarEmail)


module.exports = router