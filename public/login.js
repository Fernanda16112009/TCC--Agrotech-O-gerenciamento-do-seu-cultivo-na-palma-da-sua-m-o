const parametros = new URLSearchParams(window.location.search)

const erro = parametros.get("erro")

if (erro === "login") {

    const mensagemErro = document.getElementById("mensagemErro")

    mensagemErro.textContent = "Email ou senha incorretos"

    mensagemErro.style.display = "block"
}