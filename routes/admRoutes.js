const express = require('express')
const router = express.Router()

const admController = require('../Controllers/admController')

router.param('idUsuario', (req, res, next, valor) => {
    if (!/^[1-9]\d*$/.test(valor)) {
        return res.status(400).send('Id inválido')
    }
    next()
})

router.get('/', admController.painelAdm)
router.get('/usuarios',admController.listarPorID)
router.get('/:idUsuario/editar', admController.mostrarFormularioEdicao)
router.post('/:idUsuario/editar', admController.atualizarUsuario)
router.post('/:idUsuario/deletar', admController.deletarUsuario)

module.exports = router