const express = require('express')
const router = express.Router()
const path = require('path');
const tiposPorPlanta = require('../Constantes/plantas')
const tiposPragas = require('../Constantes/pragas')

router.get('/pg_entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'pg_entrar.html'));
});

router.get('/escolherPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'escolherCadastro.html'));
});

router.get('/calendario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'calendario.html'));
});

router.get('/compostagem', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'compostagem.html'));
});


router.get('/cadastroPlanta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'cadastroPlantaUsuario.html'));
});

router.get('/areaDePragas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'areaDePragas.html'));
});

router.get('/Instrucoes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'mostrarTodasIntrucoes.html'));
});

router.get('/pragas/:praga', (req, res) => {
    let praga = req.params.praga

    if(tiposPragas.includes(praga)){
        res.sendFile(path.join(__dirname, '..', 'privado', 'pragas', `${praga}.html`));
    }else{
        return res.status(404).send('Praga não encontrada')

    }

});

router.get('/tipos/:planta', (req, res) => {
    let planta = req.params.planta

    if(Object.hasOwn(tiposPorPlanta, planta)){
        res.sendFile(path.join(__dirname, '..', 'privado', 'tipos', `tipos${planta}.html`));
    }else{
        return res.status(404).send('Planta não encontrada')
    }


});

router.get('/tipos/:planta/:tipo', (req, res) => {

    const planta = req.params.planta;
    const tipoPlanta = req.params.tipo;

    if(!Object.hasOwn(tiposPorPlanta, planta)){
        return res.status(404).send(
            "Sua planta não é válida"
        )
    }
    
    if(!tiposPorPlanta[planta].includes(tipoPlanta)){
        return res.status(404).send(
            "O tipo da sua planta não é válido"
        )
    }

    res.redirect(`/privado/cadastroPlanta?planta=${planta}&tipo=${tipoPlanta}`);
});

router.get('/instrucoesPlantas/:tipoPlanta', (req, res) => {
    let tipoPlanta = req.params.tipoPlanta

    if(Object.values(tiposPorPlanta).flat().includes(tipoPlanta)){
        res.sendFile(path.join(__dirname, '..', 'privado', 'instrucoesPlantas', `${tipoPlanta}.html`));
    }else{
        return res.status(404).send(
            "O tipo da sua planta não é válido"
        )
    }


});

router.get('/configuracoes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'privado', 'configuracoes.html'));
});




module.exports = router