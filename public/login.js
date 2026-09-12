const parametros = new URLSearchParams(window.location.search)

const erro = parametros.get("erro")

if (erro === "login") {
    document.getElementById("mensagemErro").textContent =
        "Email ou senha incorretos"
}