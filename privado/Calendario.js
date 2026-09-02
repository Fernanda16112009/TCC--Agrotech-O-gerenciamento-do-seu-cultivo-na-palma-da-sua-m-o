/*async function buscarDados(lat, lon) {

    const climaInfo = document.getElementById('clima-info');

    climaInfo.innerHTML = `<span class="clima-temp">📡 Conectando...</span>`;

    try {
        const respostaLocal = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt-BR`);
        const dadosLocal = await respostaLocal.json();
        const cidade = dadosLocal.city || dadosLocal.locality || "Localidade Desconhecida";
        const respostaClima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const dadosClima = await respostaClima.json();
        const temperatura = dadosClima.current_weather.temperature;
        const horaAtual = new Date().toLocaleTimeString('pt-BR');

        climaInfo.innerHTML = `
            <div class="clima-cidade">📍 ${cidade}</div>
            <div class="clima-temp">🌡️ ${temperatura}°C</div>
            <div class="clima-hora">⏱️ Atualizado às ${horaAtual}</div>
            <button id="btn-salvar-local" class="btn-salvar">📌 Fixar esta localização</button>
        `;

        configurarBotaoSalvar();

    } catch (erro) {
        climaInfo.innerHTML = `<span class="clima-temp" style="color: #d32f2f;">❌ Erro de conexão com a API.</span>`;
    }
}

function configurarBotaoSalvar() {

    document.getElementById('btn-salvar-local').addEventListener('click', () => {

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (posicao) => {
                    const lat = posicao.coords.latitude;
                    const lon = posicao.coords.longitude;
                    
                    localStorage.setItem('tcc_latitude', lat);
                    localStorage.setItem('tcc_longitude', lon);
                    
                    alert("✅ Localização salva com sucesso! O clima sempre será puxado daqui agora.");
                    buscarDados(lat, lon); // Atualiza os dados
                },
                (erro) => {
                    alert("❌ GPS bloqueado. Permita a localização no navegador para poder salvar.");
                }
            );
        }
    });
}

function iniciarClima() {

    const latSalva = localStorage.getItem('tcc_latitude');
    const lonSalva = localStorage.getItem('tcc_longitude');

    if (latSalva && lonSalva) {
        console.log("💾 [INFO] Puxando localização da memória.");
        buscarDados(latSalva, lonSalva);
    } 

    else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                buscarDados(posicao.coords.latitude, posicao.coords.longitude);
            },
            (erro) => {
                buscarDados(-23.5505, -46.6333); // Fallback SP
            }
        );
    }
}

iniciarClima();*/

const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let dataAtual = new Date(2026, 4, 1);

function renderizar() {

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    document.getElementById('texto-mes').textContent = `${nomesMeses[mes]}/${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    const tbody = document.getElementById('corpo-calendario');
    
    tbody.innerHTML = '';

    let tr = document.createElement('tr');
    let celulas = 0;

    for (let i = primeiroDia - 1; i >= 0; i--) {
        let td = document.createElement('td');
        td.textContent = diasMesAnterior - i;
        td.className = 'inativo';
        tr.appendChild(td);
        celulas++;
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        let td = document.createElement('td');
        td.textContent = dia;
        tr.appendChild(td);
        celulas++;
        if (celulas % 7 === 0) {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    let diaProximoMes = 1;
    while (celulas % 7 !== 0) {
        let td = document.createElement('td');
        td.textContent = diaProximoMes++;
        td.className = 'inativo';
        tr.appendChild(td);
        celulas++;
    }

    if (tr.children.length > 0) {
        tbody.appendChild(tr);
    }
}

document.getElementById('btn-prev').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizar();
});
document.getElementById('btn-next').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizar();
});

renderizar();