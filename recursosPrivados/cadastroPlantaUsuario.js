if(document.getElementById('planta')){
    const parametros = new URLSearchParams(window.location.search);

    const planta = parametros.get('planta');
    document.getElementById('planta').value = planta;

    const tipoPlanta = parametros.get('tipo');
    document.getElementById('tipoPlanta').value = tipoPlanta;
}



function pegarLocalizacao() {

    let longitudeReq = document.querySelector("#longitude");
    let latitudeReq =  document.querySelector("#latitude");
    
    let mensagem= document.querySelector("#mensagemLocalizacao");

    function localizaçãoSucesso(position) {

        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude; 

        longitudeReq.value = longitude;
        latitudeReq.value = latitude;

        mensagem.textContent = "Localização definida com sucesso";

    }

    function localizaçãoErro(){
       mensagem.textContent = "Erro ao definir localização";
    }

    if (!navigator.geolocation) {
    mensagem.textContent = "Geolocation não funciona no seu navegador";
    } else {
    navigator.geolocation.getCurrentPosition(localizaçãoSucesso, localizaçãoErro);
    }
}

document.querySelector("#btn_mapa").addEventListener("click", pegarLocalizacao);


/* ===== Validação do formulário de cadastro ===== */
const formCadastroPlanta = document.getElementById('formCadastroPlanta');

if (formCadastroPlanta) {

    const regrasValidacao = {
        quantidade: {
            elementoErro: 'erro-quantidade',
            elementoCampo: 'campo-quantidade',
            validar() {
                const valor = document.getElementById('quantidade').value.trim();
                if (valor === '') return 'Informe a quantidade de sementes.';
                if (!/^\d+$/.test(valor) || Number(valor) <= 0) return 'Informe um número inteiro maior que zero.';
                return null;
            }
        },
        localizacao: {
            elementoErro: 'erro-localizacao',
            elementoCampo: 'campo-localizacao',
            validar() {
                const latitude = document.getElementById('latitude').value.trim();
                const longitude = document.getElementById('longitude').value.trim();
                if (latitude === '' || longitude === '') return 'Selecione a localização da plantação.';
                return null;
            }
        },
        data_plantacao: {
            elementoErro: 'erro-data_plantacao',
            elementoCampo: 'campo-data_plantacao',
            validar() {
                const valor = document.getElementById('data_plantacao').value.trim();
                if (valor === '') return 'Informe a data em que a planta foi plantada.';
                return null;
            }
        },
        agrotoxico: {
            elementoErro: 'erro-agrotoxico',
            elementoCampo: 'campo-agrotoxico',
            validar() {
                const valor = document.getElementById('agrotoxico').value;
                if (valor === '') return 'Selecione uma opção.';
                return null;
            }
        }
    };

    function mostrarErroCampo(regra, mensagem) {
        document.getElementById(regra.elementoCampo).classList.add('campo-invalido');
        document.getElementById(regra.elementoErro).textContent = mensagem;
    }

    function limparErroCampo(regra) {
        document.getElementById(regra.elementoCampo).classList.remove('campo-invalido');
        document.getElementById(regra.elementoErro).textContent = '';
    }

    function validarFormularioCadastro() {
        let formularioValido = true;
        let primeiroCampoInvalido = null;

        Object.values(regrasValidacao).forEach((regra) => {
            const mensagemErro = regra.validar();

            if (mensagemErro) {
                mostrarErroCampo(regra, mensagemErro);
                formularioValido = false;
                if (!primeiroCampoInvalido) {
                    primeiroCampoInvalido = regra.elementoCampo;
                }
            } else {
                limparErroCampo(regra);
            }
        });

        if (primeiroCampoInvalido) {
            document.getElementById(primeiroCampoInvalido)
                .scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return formularioValido;
    }

    formCadastroPlanta.addEventListener('submit', function (evento) {
        if (!validarFormularioCadastro()) {
            evento.preventDefault();
        }
    });

    // Limpa a mensagem de erro de cada campo assim que ele fica válido,
    // sem esperar uma nova tentativa de envio.
    ['quantidade', 'data_plantacao', 'agrotoxico'].forEach((idCampo) => {
        document.getElementById(idCampo).addEventListener('input', function () {
            const regra = regrasValidacao[idCampo];
            if (!regra.validar()) {
                limparErroCampo(regra);
            }
        });
    });
}