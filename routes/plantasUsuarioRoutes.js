const express = require('express')
const router = express.Router()

const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.post('/', plantaUsuarioController.criarPlantaUsuario);
router.get('/minhasPlantas', plantaUsuarioController.mostrarCategoriasPlanta);
router.get('/:idPlanta', plantaUsuarioController.mostrarPlantaUsuario);
router.post('/:idPlanta/deletar', plantaUsuarioController.deletarPlanta);
router.get('/:idPlanta/anotacoes', plantaUsuarioController.anotacoesPlanta);
router.post('/:idUsuario/:idPlanta/anotacoes', plantaUsuarioController.cadastrarAnotacao);
router.get('/calendario', plantaUsuarioController.pegarPlantasCalendario)


module.exports = router