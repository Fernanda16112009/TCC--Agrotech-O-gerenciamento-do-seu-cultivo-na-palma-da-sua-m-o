const express = require('express')
const router = express.Router()

const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.post('/', plantaUsuarioController.criarPlantaUsuario);
router.get('/minhasPlantas', plantaUsuarioController.mostrarPlantasUsuario);
router.get('/:idPlanta', plantaUsuarioController.mostrarPlanta);
router.post('/:idPlanta/deletar', plantaUsuarioController.deletarPlanta);
router.get('/:idPlanta/anotacoes', plantaUsuarioController.anotacoesPlanta);
router.post('/anotacao', plantaUsuarioController.cadastrarAnotacao);


module.exports = router