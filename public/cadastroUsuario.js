const emailValidado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function camposVazios() {

    const nome = document.getElementById('nome').value.trim();
    document.getElementById('nome-obrigatorio').style.display = nome ? "none" : "block";

    if (!nome) {
        return false;
    }

    return true;
}

function emailValido() {

    const email = document.getElementById('email').value.trim();

    // Esconde as mensagens de formato; cada execução parte do zero
    document.getElementById('email-obrigatorio').style.display = "none";
    document.getElementById('email-invalido-erro').style.display = "none";

    if (!email) {
        document.getElementById('email-obrigatorio').style.display = "block";
        return false;
    }

    if (!emailValidado.test(email)) {
        document.getElementById('email-invalido-erro').style.display = "block";
        return false;
    }

    // Se o e-mail já existe, quem avisa é o servidor (?erro=email)
    return true;
}

function senhaValida() {

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


function formularioValido() {

    const campos = camposVazios();
    const email = emailValido();
    const senha = senhaValida();

    document.getElementById('btn_cadastro').disabled =
        !(campos && email && senha);
}

// Erros de duplicidade vindos do servidor
const params = new URLSearchParams(window.location.search);

if (params.get('erro') === 'email') {
    document.getElementById('email-existe-erro').style.display = "block";
}

// A mensagem do servidor some quando a pessoa mexe no campo em questão
document.getElementById('email').addEventListener('input', () => {
    document.getElementById('email-existe-erro').style.display = "none";
});
