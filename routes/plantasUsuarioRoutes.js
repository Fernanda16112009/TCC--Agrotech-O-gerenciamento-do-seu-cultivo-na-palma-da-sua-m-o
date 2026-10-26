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

router.param('idPlanta', (req, res, next, valor) => {
    if (!/^[1-9]\d*$/.test(valor)) {
        return res.status(400).send('Id inválido')
    }
    next()
})

router.post('/', plantaUsuarioController.criarPlantaUsuario);

router.get('/minhasPlantas', plantaUsuarioController.mostrarCategoriasPlanta);

router.get('/:idPlanta/mostrar', plantaUsuarioController.mostrarPlantaUsuario);

router.get('/:idPlanta/veranotacoes', plantaUsuarioController.anotacoesPlanta);

router.post('/:idPlanta/cadastraranotacoes', plantaUsuarioController.cadastrarAnotacao);

router.post('/:idPlanta/imagem', upload.single('imagem'), plantaUsuarioController.adicionarImagemSafra);

router.post('/:idPlanta/nomesafra', plantaUsuarioController.atualizarSafraNome);

router.post('/:idPlanta/localizacao', plantaUsuarioController.atualizarLocalizacao);

router.post('/:idPlanta/deletar', plantaUsuarioController.deletarPlanta);

// Rotas mais genéricas depois
router.get('/:planta', plantaUsuarioController.mostrarCategoriasTipoPlanta);

router.get('/:planta/:tipoPlanta', plantaUsuarioController.mostrarSafraPlanta);



module.exports = router

