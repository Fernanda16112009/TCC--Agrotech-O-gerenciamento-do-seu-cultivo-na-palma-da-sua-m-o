const express = require('express')
const router = express.Router()
const path = require('path');


const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.get('/pegarcalendario', plantaUsuarioController.pegarPlantasCalendario);

module.exports = router