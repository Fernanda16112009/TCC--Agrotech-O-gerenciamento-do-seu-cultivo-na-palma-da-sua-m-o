const emailValidado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formato = /^\d{4}-\d{2}-\d{2}$/
const diasAtraso = 60
const diasAdiantado = 30
const tiposPorPlanta = require('../Constantes/plantas')


function validarNome(nome){

    if (typeof nome !== 'string') {
        return { erro: "Nome inválido" }
    }

    nome = nome.trim()

    if(!nome){
        return { erro: "Nome é obrigatorio" }
    }



    if(Buffer.byteLength(nome) > 100){
        return { erro: "Nome não pode ter mais de 100 caracteres" }
    }

    

    return { value: nome }

}

function validarEmail(email){
        
    if(!email){
        return { erro: "Email é obrigatorio" }
    }

    if (typeof email !== 'string') {
        return { erro: "Email inválido" }
    }

    if(Buffer.byteLength(email) > 100){
        return { erro: "Email não pode ter mais de 100 caracteres" }
    }

    email = email.trim().toLowerCase();

    if(!emailValidado.test(email)){
        return { erro: "Email inválido" }
    }

    return { value: email }

}

function validarSenha(senha){
        
    if (typeof senha !== 'string') {
        return { erro: "Senha inválida" }
    }

    if (senha.length < 6) {
        return { erro: "Senha precisa ter pelo menos 6 caracteres" }
    }

    
    if (Buffer.byteLength(senha) > 72) {
        return { erro: "Senha não pode ter mais de 72 caracteres" }
    }

    return {value:senha}

}

function validarSenhaTrocar (senha,senhaValida){

    if (senha === senhaValida){
        return  {value:senha}
    }else{
        return { erro: "As senhas precisam ser iguais" }
    }

}

function validarSafraNome (safraNome){

    if (typeof safraNome !== 'string') {
        return { erro: "Nome da safra inválida" }
    }

    safraNome = safraNome.trim()

    if(!safraNome){
        return { erro: "Nome da safra inválida" }
    }



    if (Buffer.byteLength(safraNome) > 300) {
        return { erro: "O nome da safra não pode ter mais de 300 caracteres" }
    }

    return { value: safraNome }

}


function validarData(textoData){

    if(!textoData){
        return { erro: "É necessário uma data para plantio" }
    }

    if(typeof textoData !== 'string' || !formato.test(textoData)){
        return { erro: "É necessário uma data válida para plantio" }
    }

    const diaPlantacao = new Date(textoData)

    if(Number.isNaN(diaPlantacao.getTime()) || diaPlantacao.toISOString().slice(0, 10) !== textoData){
        return { erro: "É necessário uma data válida para plantio" }
    }

    // 4) janela de dias: "hoje" também em meia-noite UTC
    const agora = new Date()
    const hojeUTC = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate())

    const diferencaDias = Math.round((diaPlantacao.getTime() - hojeUTC) / 86400000)

    if(diferencaDias > diasAdiantado || diferencaDias < -diasAtraso){
        return { erro: `O dia da plantação deve estar entre ${diasAtraso} dias atrás e ${diasAdiantado} dias à frente` }
    }

    return { value: textoData }
}

function validarCadastroPlanta(formulario){

    const tipoPlanta = formulario.tipoPlanta
    const planta = formulario.planta
    const quantidade = Number(formulario.quantidade)
    const agrotoxico = formulario.agrotoxico

    if(!Object.hasOwn(tiposPorPlanta, planta)){
        return { erro: "Sua planta não é válida" }
    }

    if(!tiposPorPlanta[planta].includes(tipoPlanta)){
        return { erro: "O tipo da sua planta não é válido" }
    }

    if(agrotoxico !== "sim" && agrotoxico !== "nao"){
        return { erro: "A resposta para agrotóxico deve ser sim ou não" }

    }

    if(!Number.isInteger(quantidade) || quantidade <= 0){
        return { erro: "Quantidade de sementes inválida" }
    }

    return { value: 
        {
            quantidade:quantidade
        }
    }

}

function converterCoordenada(valor){

    if(typeof valor !== 'string' && typeof valor !== 'number'){
        return null
    }

    if(typeof valor === 'string'){
        valor = valor.trim()

        if(valor === ''){
            return null
        }
    }

    const numero = Number(valor)

    if(!Number.isFinite(numero)){
        return null
    }

    return numero
}

function validarLocalizacao(latitude, longitude){

    const latNumero = converterCoordenada(latitude)
    const lonNumero = converterCoordenada(longitude)

    if(latNumero === null || lonNumero === null){
        return { erro: "A localização é necessária" }
    }

    return { value:
        {
            latitude: latNumero,
            longitude: lonNumero
        }
    }
}

function validarAnotacao (anotacao){

    if (typeof anotacao !== 'string') {
        return { erro: "Anotação da safra inválida" }
    }
    
    anotacao = anotacao.trim()



    if (Buffer.byteLength(anotacao) > 65535) {
        return { erro: "Número de caracter disponíveis para a anotação exedido " }
    }

    return { value: anotacao }

}

function escaparHtml(texto){

    if(texto === null || texto === undefined){
        return ''
    }

    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

module.exports = {
    validarEmail,
    validarNome,
    validarSenha,
    validarSenhaTrocar,
    validarSafraNome,
    validarData,
    validarCadastroPlanta,
    validarLocalizacao,
    validarAnotacao,
    escaparHtml
}
