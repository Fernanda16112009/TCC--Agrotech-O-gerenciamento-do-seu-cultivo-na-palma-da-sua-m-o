const DIAS_ATRASO = 60;
const DIAS_ADIANTADO = 30;

const parametros = new URLSearchParams(window.location.search);
const formCadastroPlanta = document.getElementById('formCadastroPlanta');

// Data local no formato YYYY-MM-DD, igual ao valor do input type="date".
function formatarDataIso(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function dataComDeslocamento(dias) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return formatarDataIso(data);
}

if (formCadastroPlanta) {
    document.getElementById('planta').value = parametros.get('planta') || '';
    document.getElementById('tipoPlanta').value = parametros.get('tipo') || '';

    /* ===== Localização ===== */
    const campoLatitude = document.getElementById('latitude');
    const campoLongitude = document.getElementById('longitude');
    const mensagemLocalizacao = document.getElementById('mensagemLocalizacao');

    function localizacaoSucesso(posicao) {
        campoLatitude.value = posicao.coords.latitude;
        campoLongitude.value = posicao.coords.longitude;
        mensagemLocalizacao.textContent = 'Localização definida com sucesso';
        revalidarSeInvalido(regras.localizacao);
    }

    function localizacaoErro() {
        mensagemLocalizacao.textContent = 'Erro ao definir localização';
    }

    document.getElementById('btn_mapa').addEventListener('click', () => {
        if (!navigator.geolocation) {
            mensagemLocalizacao.textContent = 'Geolocalização não funciona no seu navegador';
            return;
        }
        navigator.geolocation.getCurrentPosition(localizacaoSucesso, localizacaoErro);
    });

    /* ===== Data: limites do seletor ===== */
    const campoData = document.getElementById('data_plantacao');
    const dataMinima = dataComDeslocamento(-DIAS_ATRASO);
    const dataMaxima = dataComDeslocamento(DIAS_ADIANTADO);

    // Limita o calendário nativo; a validação abaixo continua valendo.
    campoData.min = dataMinima;
    campoData.max = dataMaxima;

    /* ===== Regras de validação ===== */
    const regras = {
        quantidade: {
            campo: 'campo-quantidade',
            erro: 'erro-quantidade',
            input: 'quantidade',
            validar() {
                const valor = document.getElementById('quantidade').value.trim();
                if (valor === '') return 'Informe a quantidade de sementes.';
                if (!/^\d+$/.test(valor) || Number(valor) <= 0) return 'Informe um número inteiro maior que zero.';
                return null;
            }
        },
        localizacao: {
            campo: 'campo-localizacao',
            erro: 'erro-localizacao',
            input: null,
            validar() {
                if (!campoLatitude.value || !campoLongitude.value) return 'Selecione a localização da plantação.';
                return null;
            }
        },
        data_plantacao: {
            campo: 'campo-data_plantacao',
            erro: 'erro-data_plantacao',
            input: 'data_plantacao',
            validar() {
                const valor = campoData.value;
                if (valor === '') return 'Informe a data em que a planta foi plantada.';
                // Texto no formato YYYY-MM-DD compara certo como string.
                if (valor < dataMinima || valor > dataMaxima) {
                    return `O dia da plantação deve estar entre ${DIAS_ATRASO} dias atrás e ${DIAS_ADIANTADO} dias à frente.`;
                }
                return null;
            }
        },
        agrotoxico: {
            campo: 'campo-agrotoxico',
            erro: 'erro-agrotoxico',
            input: 'agrotoxico',
            validar() {
                if (document.getElementById('agrotoxico').value === '') return 'Selecione uma opção.';
                return null;
            }
        }
    };

    function mostrarErro(regra, mensagem) {
        document.getElementById(regra.campo).classList.add('campo-invalido');
        document.getElementById(regra.erro).textContent = mensagem;
    }

    function limparErro(regra) {
        document.getElementById(regra.campo).classList.remove('campo-invalido');
        document.getElementById(regra.erro).textContent = '';
    }

    // Só atualiza um campo que já foi marcado como inválido,
    // para não mostrar erro antes da primeira tentativa de envio.
    function revalidarSeInvalido(regra) {
        if (!document.getElementById(regra.campo).classList.contains('campo-invalido')) return;
        const mensagem = regra.validar();
        mensagem ? mostrarErro(regra, mensagem) : limparErro(regra);
    }

    function validarFormulario() {
        let primeiroInvalido = null;

        Object.values(regras).forEach((regra) => {
            const mensagem = regra.validar();
            if (mensagem) {
                mostrarErro(regra, mensagem);
                primeiroInvalido = primeiroInvalido || regra.campo;
            } else {
                limparErro(regra);
            }
        });

        if (primeiroInvalido) {
            document.getElementById(primeiroInvalido).scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    }

    formCadastroPlanta.addEventListener('submit', (evento) => {
        if (!validarFormulario()) evento.preventDefault();
    });

    Object.values(regras).forEach((regra) => {
        if (!regra.input) return;
        const campo = document.getElementById(regra.input);
        campo.addEventListener('input', () => revalidarSeInvalido(regra));
        campo.addEventListener('change', () => revalidarSeInvalido(regra));
    });
}