const express = require('express')
const router = express.Router()
const path = require('path');
const jwt = require('jsonwebtoken');

const usuarioController = require('../Controllers/usuarioController')


router.get('/trocarSenha', async (req, res) => {

    const id = req.query.id;
    const token = req.query.token;

    try{
        const secret =  await usuarioController.montarSecret(id)

        if (!token) {
        return res.redirect('/');
        }

        jwt.verify(token, secret, (err, decoded) =>{
            if (err){
                return res.redirect('/');
            }

            res.sendFile(path.join(__dirname, '..', 'trocarSenha','trocarSenha.html')) 
        })

    }catch{
        return console.log('erro')
    }
})

module.exports = router