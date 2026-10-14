const express = require('express')
const router = express.Router()

const admController = require('../Controllers/admController')

router.get('/', admController.painelAdm)
router.get('/usuarios',admController.listarPorID)
router.get('/:idUsuario/editar', admController.mostrarFormularioEdicao)
router.post('/:idUsuario/editar', admController.atualizarUsuario)
router.post('/:idUsuario/deletar', admController.deletarUsuario)

module.exports = router