const express = require('express')
const router = express.Router()

const usuarioController = require('../Controllers/usuarioController')

router.post('/editar', usuarioController.atualizarUsuario)
router.get('/perfil', usuarioController.perfil)
router.post('/sair', usuarioController.logout)

module.exports = router