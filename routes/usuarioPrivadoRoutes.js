const express = require('express')
const router = express.Router()

const usuarioController = require('../Controllers/usuarioController')

router.get('/:idUsuario/editar', usuarioController.mostrarFormularioEdicao)
router.post('/:idUsuario/editar', usuarioController.atualizarUsuario)
router.post('/:idUsuario/deletar', usuarioController.deletarUsuario)
router.get('/perfil', usuarioController.perfil)
router.get('/sair', usuarioController.logout)

module.exports = router