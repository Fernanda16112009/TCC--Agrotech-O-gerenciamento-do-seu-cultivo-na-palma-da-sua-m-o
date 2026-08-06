const express = require('express')
const router = express.Router()

const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.post('/', plantaUsuarioController.criarPlantaUsuario)
router.get('/minhasPlantas', plantaUsuarioController.mostrarPlantasUsuario)
router.get('/:idPlanta', plantaUsuarioController.mostrarPlanta)

module.exports = router