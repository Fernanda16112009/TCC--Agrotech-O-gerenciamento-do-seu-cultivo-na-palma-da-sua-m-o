const express = require('express')
const router = express.Router()

const usuarioController = require('../Controllers/usuarioController')

router.post('/', usuarioController.criarUsuario)
router.post('/login', usuarioController.logarUsuario)


module.exports = router