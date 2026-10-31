const btnMapa = document.getElementById('btn_mapa');

if (btnMapa) {
    const campoLatitude = document.getElementById('latitude');
    const campoLongitude = document.getElementById('longitude');
    const mensagemLocalizacao = document.getElementById('mensagemLocalizacao');

    btnMapa.addEventListener('click', () => {
        if (!navigator.geolocation) {
            mensagemLocalizacao.textContent = 'Geolocalização não funciona no seu navegador';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                campoLatitude.value = posicao.coords.latitude;
                campoLongitude.value = posicao.coords.longitude;
                mensagemLocalizacao.textContent = 'Localização definida com sucesso';
            },
            () => {
                mensagemLocalizacao.textContent = 'Erro ao definir localização';
            }
        );
    });
}