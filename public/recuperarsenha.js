const emailValidado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function emailValido() {

    const email = document.getElementById('email').value.trim();
    const botao = document.getElementById('btn_cadastro')

    botao.disabled = true

    if (!email) {
        document.getElementById('email-obrigatorio').style.display = "block";
        return;
    } else {
        document.getElementById('email-obrigatorio').style.display = "none";
    }

    if (!emailValidado.test(email)) {
        document.getElementById('email-invalido-erro').style.display = "block";
        return;
    } else {
        document.getElementById('email-invalido-erro').style.display = "none";
    }

    const bancoEmail = await fetch('/usuarios/bancoemails');
    const be = await bancoEmail.json();

    let existeEmail = false

    for (let i = 0; i < be.length; i++) {

        if (email === be[i].email) {      
                existeEmail = true
                break
        }
    }

    if(existeEmail === false){
        document.getElementById('email-existe-erro').style.display = "block";
        botao.disabled = true;
        return
    }else{
        document.getElementById('email-existe-erro').style.display = "none";
        botao.disabled = false;
    }
}
