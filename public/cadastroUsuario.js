
const emailValidado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function camposVazios(){

    const nome = document.getElementById('nome').value.trim();
    document.getElementById('nome-obrigatorio').style.display = nome ? "none" : "block"

    const telefone = document.getElementById('telefone').value.trim();
    document.getElementById('telefone-obrigatorio').style.display = telefone ? "none" : "block"

    if (!nome || !telefone) {
        return false;
    }

    return true;
}

async function emailValido() {

    const email = document.getElementById('email').value.trim();

    if (!email) {
        document.getElementById('email-obrigatorio').style.display = "block";
        return false;
    } else {
        document.getElementById('email-obrigatorio').style.display = "none";
    }

    if (!emailValidado.test(email)) {
        document.getElementById('email-invalido-erro').style.display = "block";
        return false;
    } else {
        document.getElementById('email-invalido-erro').style.display = "none";
    }

    const bancoEmail = await fetch('/usuarios/bancoemails');
    const be = await bancoEmail.json();

    for (let i = 0; i < be.length; i++) {

        if (email === be[i].email) {
            document.getElementById('email-existe-erro').style.display = "block";
            return false;
        }
    }

    document.getElementById('email-existe-erro').style.display = "none";

    return true;
}

function senhaValida(){

    const senha = document.getElementById('senha').value.trim();

    document.getElementById('senha-obrigatoria').style.display =
        senha ? "none" : "block";

    if (!senha) {
        document.getElementById('senha-invalido-erro').style.display = "none";
        return false;
    }

    if (senha.length >= 6) {
        document.getElementById('senha-invalido-erro').style.display = "none";
        return true;
    } else {
        document.getElementById('senha-invalido-erro').style.display = "block";
        return false;
    }
}

async function nomeUsuarioValida(){

    const nome_usuario = document.getElementById('nome_usuario').value.trim();

    if (!nome_usuario) {
        document.getElementById('nome_usuario-obrigatorio').style.display = "block";
        return false;
    }

    document.getElementById('nome_usuario-obrigatorio').style.display = "none";
    document.getElementById('nome_usuario-invalido-erro').style.display = "none";

    const bancoNome = await fetch('/usuarios/buscarNomes');
    const bn = await bancoNome.json();

    for (let i = 0; i < bn.length; i++) {

        if (nome_usuario === bn[i].nome_usuario) {

            document.getElementById('nome_usuario-invalido-erro').style.display = "block";

            return false;
        }
    }

    return true;
}


async function formularioValido(){

    const campos = camposVazios();
    const email = await emailValido();
    const senha = senhaValida();
    const nomeUsuario = await nomeUsuarioValida();

    if (campos && email && senha && nomeUsuario) {

        document.getElementById('btn_cadastro').disabled = false;

    } else {

        document.getElementById('btn_cadastro').disabled = true;

    }
}