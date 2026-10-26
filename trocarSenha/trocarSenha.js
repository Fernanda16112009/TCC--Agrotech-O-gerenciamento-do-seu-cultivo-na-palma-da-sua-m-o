const parametros = new URLSearchParams(window.location.search);

document.getElementById('idUsuario').value = parametros.get('id') || '';
document.getElementById('token').value = parametros.get('token') || '';

function alternarErro(idElemento, mostrar) {
    document.getElementById(idElemento).style.display = mostrar ? 'block' : 'none';
}

function validarSenha() {
    const senha = document.getElementById('senha').value;
    const senhaValida = document.getElementById('senhaValida').value;

    const senhaPreenchida = senha.length > 0;
    const senhaValidaPreenchida = senhaValida.length > 0;
    const senhaTamanhoOk = senha.length >= 6;
    const senhaValidaTamanhoOk = senhaValida.length >= 6;
    const senhasIguais = senha === senhaValida;

    alternarErro('senha-obrigatoria', !senhaPreenchida);
    alternarErro('senha-invalido-erro', senhaPreenchida && !senhaTamanhoOk);
    alternarErro('senha-valida-obrigatoria', !senhaValidaPreenchida);
    alternarErro('senha-valida-invalido-erro', senhaValidaPreenchida && !senhaValidaTamanhoOk);
    alternarErro('senha-igual', senhaPreenchida && senhaValidaPreenchida && !senhasIguais);

    const formularioValido =
        senhaPreenchida &&
        senhaValidaPreenchida &&
        senhaTamanhoOk &&
        senhaValidaTamanhoOk &&
        senhasIguais;

    document.getElementById('btn-atualizar').disabled = !formularioValido;
}