const express = require('express')
const router = express.Router()

const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.post('/', plantaUsuarioController.criarPlantaUsuario);

// Rotas específicas primeiro
router.get('/minhasPlantas', plantaUsuarioController.mostrarCategoriasPlanta);

router.get('/:idPlanta/:planta/:tipoPlanta/anotacoes', plantaUsuarioController.anotacoesPlanta);

router.post('/:idUsuario/:idPlanta/:planta/:tipoPlanta/anotacoes', plantaUsuarioController.cadastrarAnotacao);

router.post('/:idPlanta/deletar', plantaUsuarioController.deletarPlanta);

// Rotas mais genéricas depois
router.get('/:planta', plantaUsuarioController.mostrarCategoriasTipoPlanta);

router.get('/:planta/:tipoPlanta', plantaUsuarioController.mostrarSafraPlanta);

router.get('/:planta/:tipoPlanta/:idPlanta', plantaUsuarioController.mostrarPlantaUsuario);

router.post('/:idUsuario/:idPlanta/:planta/:tipoPlanta', plantaUsuarioController.atualizarSafraNome);

router.post('/:idUsuario/:idPlanta/:planta/:tipoPlanta/localizacao', plantaUsuarioController.atualizarLocalizacao);

module.exports = router