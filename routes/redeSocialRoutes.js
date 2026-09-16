const express = require('express')
const router = express.Router()
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const redeSocialController = require('../Controllers/redeSocialController')


router.get('/postagem', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'criarPost.html'));
});


// funções
router.post('/criarPostagem', upload.single('imagem'), redeSocialController.criarPost);
router.get('/redeSocial', redeSocialController.mostrarPosts);
router.get('/comentarios/:idPostagem', redeSocialController.mostrarComentarios);
router.post('/criarComentario/:idPostagem', upload.single('imagem'), redeSocialController.comentar);
router.post('/curtir/:idPostagem/:curtida', redeSocialController.curtir);





module.exports = router