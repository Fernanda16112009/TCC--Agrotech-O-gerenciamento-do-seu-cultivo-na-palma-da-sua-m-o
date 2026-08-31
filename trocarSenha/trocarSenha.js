console.log("JS conectado");
const parametros = new URLSearchParams(window.location.search);

const id = parametros.get('id');
document.getElementById('idUsuario').value = id;


function validarSenha(){
    
    const senha = document.getElementById('senha').value.trim();
    const senhaValida = document.getElementById('senhaValida').value.trim();
    let verifica = false

    if(!senha){
        document.getElementById('senha-obrigatoria').style.display = "block";
        verifica = false
    }else{
        document.getElementById('senha-obrigatoria').style.display = "none";
        verifica = true
    }

    if(!senhaValida){
        document.getElementById('senha-valida-obrigatoria').style.display = "block";
        verifica = false
    }else{
        document.getElementById('senha-valida-obrigatoria').style.display = "none";
        verifica = true
    }
 
    if (senha.length >=6 ){
        document.getElementById('senha-invalido-erro').style.display = "none"
        verifica = true
    }else{
        document.getElementById('senha-invalido-erro').style.display = "block"    }
        verifica = false
    if(senhaValida.length >=6){
        document.getElementById('senha-valida-invalido-erro').style.display = "none"
        verifica = true
    }else{
        document.getElementById('senha-valida-invalido-erro').style.display = "block"
        verifica = false
    }

    if(senhaValida !== senha){
        document.getElementById('senha-igual').style.display= "block"
        verifica = false
    }else{
        document.getElementById('senha-igual').style.display= "none"
        verifica = true
    }

    if (verifica === true){
        document.getElementById('btn-atualizar').disabled = false
    }else{
        document.getElementById('btn-atualizar').disabled = true
    }
}