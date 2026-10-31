const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_SENHA = 6

const formCadastro = document.getElementById("formCadastro")
const inputNome = document.getElementById("nome")
const inputEmail = document.getElementById("email")
const inputSenha = document.getElementById("senha")
const btnCadastro = document.getElementById("btn_cadastro")

const erros = {
    nomeObrigatorio: document.getElementById("nome-obrigatorio"),
    emailObrigatorio: document.getElementById("email-obrigatorio"),
    emailInvalido: document.getElementById("email-invalido-erro"),
    emailExiste: document.getElementById("email-existe-erro"),
    senhaObrigatoria: document.getElementById("senha-obrigatoria"),
    senhaInvalida: document.getElementById("senha-invalido-erro")
}

// Um campo só mostra erro depois que o usuário sai dele (ou tenta enviar)
const tocado = { nome: false, email: false, senha: false }

function exibir(elemento, mostrar) {
    elemento.style.display = mostrar ? "block" : "none"
}

function validarNome() {
    const vazio = inputNome.value.trim() === ""

    if (tocado.nome) exibir(erros.nomeObrigatorio, vazio)

    return !vazio
}

function validarEmail() {
    const email = inputEmail.value.trim()
    const vazio = email === ""
    const invalido = !vazio && !REGEX_EMAIL.test(email)

    if (tocado.email) {
        exibir(erros.emailObrigatorio, vazio)
        exibir(erros.emailInvalido, invalido)
    }

    return !vazio && !invalido
}

function validarSenha() {
    // A senha não é "trimada": espaços também fazem parte dela
    const senha = inputSenha.value
    const vazia = senha === ""
    const curta = !vazia && senha.length < MIN_SENHA

    if (tocado.senha) {
        exibir(erros.senhaObrigatoria, vazia)
        exibir(erros.senhaInvalida, curta)
    }

    return !vazia && !curta
}

// Habilita o botão só quando os três campos estão válidos
function atualizarBotao() {
    const nomeOk = validarNome()
    const emailOk = validarEmail()
    const senhaOk = validarSenha()

    btnCadastro.disabled = !(nomeOk && emailOk && senhaOk)
}

inputNome.addEventListener("blur", () => {
    tocado.nome = true
    atualizarBotao()
})

inputEmail.addEventListener("blur", () => {
    tocado.email = true
    atualizarBotao()
})

inputSenha.addEventListener("blur", () => {
    tocado.senha = true
    atualizarBotao()
})

// Enquanto digita, só atualiza o botão (sem mostrar erro antes da hora)
inputNome.addEventListener("input", atualizarBotao)
inputSenha.addEventListener("input", atualizarBotao)

inputEmail.addEventListener("input", () => {
    // Some com o aviso de e-mail já cadastrado assim que a pessoa mexe no campo
    exibir(erros.emailExiste, false)
    atualizarBotao()
})

// Segurança extra no envio: marca tudo como tocado e bloqueia se houver erro
formCadastro.addEventListener("submit", (evento) => {
    tocado.nome = tocado.email = tocado.senha = true
    atualizarBotao()

    if (btnCadastro.disabled) {
        evento.preventDefault()
        return
    }

    inputNome.value = inputNome.value.trim()
    inputEmail.value = inputEmail.value.trim()
})

// Erro de e-mail já cadastrado vem do servidor: /cadastroUsuario.html?erro=email
const parametros = new URLSearchParams(window.location.search)

if (parametros.get("erro") === "email") {
    exibir(erros.emailExiste, true)
}

atualizarBotao()