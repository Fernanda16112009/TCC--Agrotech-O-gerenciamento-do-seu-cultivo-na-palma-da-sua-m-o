const express = require('express')
const router = express.Router()

const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.get('/pegarPlantasCalendario', plantaUsuarioController.pegarPlantasCalendario);

router.get('/pegarPlantasAdmCalendario', plantaUsuarioController.pegarPlantasADMCalendario);

module.exports = router
