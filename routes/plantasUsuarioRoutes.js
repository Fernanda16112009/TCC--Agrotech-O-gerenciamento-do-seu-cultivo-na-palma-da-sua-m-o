const express = require('express')
const router = express.Router()

const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.post('/', plantaUsuarioController.criarPlantaUsuario)

module.exports = router