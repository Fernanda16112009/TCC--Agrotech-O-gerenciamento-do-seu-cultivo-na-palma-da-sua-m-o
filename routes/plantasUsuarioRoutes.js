const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, permitidos.includes(file.mimetype));
    }
});
const plantaUsuarioController = require('../Controllers/plantaUsuarioController')

router.post('/', plantaUsuarioController.criarPlantaUsuario);

// Rotas específicas primeiro
router.get('/minhasPlantas', plantaUsuarioController.mostrarCategoriasPlanta);

router.get('/:idPlanta/:planta/:tipoPlanta/anotacoes', plantaUsuarioController.anotacoesPlanta);

router.post('/:idPlanta/:planta/:tipoPlanta/anotacoes', plantaUsuarioController.cadastrarAnotacao);

router.post('/:idPlanta/:planta/:tipoPlanta/imagem', upload.single('imagem'), plantaUsuarioController.adicionarImagemSafra);

router.post('/:idPlanta/deletar', plantaUsuarioController.deletarPlanta);

// Rotas mais genéricas depois
router.get('/:planta', plantaUsuarioController.mostrarCategoriasTipoPlanta);

router.get('/:planta/:tipoPlanta', plantaUsuarioController.mostrarSafraPlanta);

router.get('/:planta/:tipoPlanta/:idPlanta', plantaUsuarioController.mostrarPlantaUsuario);

router.post('/:idPlanta/:planta/:tipoPlanta', plantaUsuarioController.atualizarSafraNome);

router.post('/:idPlanta/:planta/:tipoPlanta/localizacao', plantaUsuarioController.atualizarLocalizacao);

module.exports = router

