const express = require('express')
const router = express.Router()

const usuarioController = require('../Controllers/usuarioController')

router.post('/', usuarioController.criarUsuario)
router.post('/login', usuarioController.logarUsuario)
router.get('/:idUsuario/editar', usuarioController.mostrarFormularioEdicao)
router.post('/:idUsuario/editar', usuarioController.atualizarUsuario)
router.post('/:idUsuario/deletar', usuarioController.deletarUsuario)

module.exports = router