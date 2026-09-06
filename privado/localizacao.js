console.log("chego")

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