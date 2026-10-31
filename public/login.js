const formLogin = document.getElementById("formLogin")
const inputEmail = document.getElementById("email")
const inputSenha = document.getElementById("senha")
const mensagemErro = document.getElementById("mensagemErro")
const erroEmail = document.getElementById("erro-email")
const erroSenha = document.getElementById("erro-senha")

// Mostra ou esconde a mensagem de erro de um campo
function mostrarErro(elemento, texto) {
    elemento.textContent = texto
    elemento.style.display = texto ? "block" : "none"
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Erro vindo do servidor (ex: senha errada): /pagina?erro=login
const parametros = new URLSearchParams(window.location.search)

if (parametros.get("erro") === "login") {
    mensagemErro.textContent = "⚠ Email ou senha incorretos"
    mensagemErro.hidden = false
}

// Validação antes de enviar para o servidor
formLogin.addEventListener("submit", (evento) => {
    const email = inputEmail.value.trim()
    const senha = inputSenha.value

    let valido = true

    if (!email) {
        mostrarErro(erroEmail, "Email é obrigatório")
        valido = false
    } else if (!emailValido(email)) {
        mostrarErro(erroEmail, "Digite um email válido, como joao@email.com")
        valido = false
    } else {
        mostrarErro(erroEmail, "")
    }

    if (!senha) {
        mostrarErro(erroSenha, "Senha é obrigatória")
        valido = false
    } else {
        mostrarErro(erroSenha, "")
    }

    if (!valido) {
        evento.preventDefault()
        return
    }

    inputEmail.value = email
})

// Some com a mensagem do servidor quando o usuário volta a digitar
inputEmail.addEventListener("input", () => {
    mensagemErro.hidden = true
    mostrarErro(erroEmail, "")
})

inputSenha.addEventListener("input", () => {
    mensagemErro.hidden = true
    mostrarErro(erroSenha, "")
})