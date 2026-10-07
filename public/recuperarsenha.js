const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailValido() {
    const email = document.getElementById('email').value.trim();
    const botao = document.getElementById('btn_cadastro');

    // Cada execução parte do zero: esconde tudo e desabilita o botão
    document.getElementById('email-obrigatorio').style.display = "none";
    document.getElementById('email-invalido-erro').style.display = "none";
    document.getElementById('email-enviado').style.display = "none";
    botao.disabled = true;

    if (!email) {
        document.getElementById('email-obrigatorio').style.display = "block";
        return;
    }

    if (!formatoEmail.test(email)) {
        document.getElementById('email-invalido-erro').style.display = "block";
        return;
    }

    // Passou nas duas verificações
    botao.disabled = false;
}

// Mensagem de resultado vinda do servidor (?enviado=1)
const params = new URLSearchParams(window.location.search);

if (params.get('enviado') === '1') {
    document.getElementById('email-enviado').style.display = "block";
}