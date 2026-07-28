const express = require('express')
const router = express.Router()

const admController = require('../Controllers/admController')

router.get('/', admController.painelAdm)

module.exports = router