const express = require('express')
const router = express.Router()
const path = require('path');

const redeSocialController = require('../Controllers/redeSocialController')


router.get('/postagem', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'criarPost.html'));
});


// funções
router.post('/criarPostagem', redeSocialController.criarPost);
router.get('/redeSocial', redeSocialController.mostrarPosts);


module.exports = router