const express = require('express')
const router = express.Router()

const admController = require('../Controllers/admController')

router.get('/', admController.painelAdm)
router.get('/usuarios',admController.listarPorID)

module.exports = router