const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let dataAtual = new Date(2026, 8, 1);

let plantas = []
let plantasAdm = []
let clima = []

const imagensPorTipo = {
    morangoAlbino: 'morangoAlb.png',
    morangoCaminoReal: 'morangoCam.png',
    morangoSanAndreas: 'morangoSan.png',
    cenouraTradicional: 'cenouraTrad.png',
    pepinoCaipira: 'pepinoCai.png',
    pepinoConserva: 'pepinoCon.png',
    pepinoJapones: 'pepinoJap.png',
    tomateCereja: 'tomateCer.png',
    tomateLongaVida: 'tomateLon.png',
    tomateSaladete: 'tomateSal.png'
};

function formatarNomePlanta(texto) {
    const comEspacos = texto.replace(/([A-Z])/g, ' $1').trim();
    return comEspacos.charAt(0).toUpperCase() + comEspacos.slice(1);
}

function criarIconePlanta(p, colheita) {
    const item = document.createElement('div');
    item.className = 'dia-planta';
    item.title = colheita ? `${formatarNomePlanta(p.safraNome)} - dia da colheita` : formatarNomePlanta(p.safraNome);

    const img = document.createElement('img');
    img.src = `/privado/img/${imagensPorTipo[p.tipoPlanta] || ''}`;
    img.alt = p.safraNome;
    item.appendChild(img);

    if (colheita) {
        const selo = document.createElement('span');
        selo.className = 'colheita-badge';
        selo.textContent = '🧺';
        item.appendChild(selo);
    }

    return item;
}

async function pegarPlantasCalendario() {   
    const resposta = await fetch('/calendario/pegarPlantasCalendario')

    if (!resposta.ok) {
        console.error('Erro ao buscar plantas do calendário:', resposta.status, await resposta.text())
        plantas = []
        return
    }

    plantas = await resposta.json()
}

async function pegarPlantasAdmCalendario() { 
    const respostaADM = await fetch('/calendario/pegarPlantasAdmCalendario')

    if (!respostaADM.ok) {
        console.error('Erro ao buscar plantas ADM do calendário:', respostaADM.status, await respostaADM.text())
        plantasAdm = []
        return
    }

    plantasAdm = await respostaADM.json()
}

async function pegarClima(plantas) {
    for( const p of plantas){
        if (p.latitude == null || p.longitude == null) {
            console.warn(`Planta "${p.safraNome}" ainda não tem localização definida, pulando busca de clima.`)
            continue
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&daily=rain_sum&timezone=auto`;

        const resultado = await fetch(url)

        if (!resultado.ok) {
            console.error(`Erro ao buscar clima de "${p.safraNome}":`, resultado.status, await resultado.text())
            continue
        }

        clima.push( { nomeSafra:p.safraNome , resultado: await resultado.json()})

    }
}

async function iniciar() {
    await pegarPlantasCalendario();
    await pegarPlantasAdmCalendario();
    await pegarClima(plantas)
    Choveu()
    renderizar();
}


function Choveu() {

    const popup = document.getElementById('popup-regas');
    const mensagem = document.getElementById('mensagem-popup');
    const lista = document.getElementById('lista-plantas-popup');

    lista.innerHTML = '';

    let plantasComChuva = [];
    let plantasSemChuva = [];

    clima.forEach(c => {

        const chuva = c.resultado.daily.rain_sum[0];

        if (chuva === 0) {
            plantasSemChuva.push(c.nomeSafra);
        } else {
            plantasComChuva.push(c.nomeSafra);
        }

    });


    // Mensagem para plantas que tiveram chuva
    if (plantasComChuva.length > 0) {

        const tituloChuva = document.createElement('p');

        tituloChuva.textContent = '🌧️ Nessas plantas choveu, não precisa regar:';

        lista.appendChild(tituloChuva);

        plantasComChuva.forEach(nome => {

            const planta = document.createElement('div');

            planta.className = 'planta-popup';

            planta.textContent = `🌱 ${formatarNomePlanta(nome)}`;

            lista.appendChild(planta);

        });
    }

    // Mensagem para plantas que não tiveram chuva
    if (plantasSemChuva.length > 0) {

        const tituloRega = document.createElement('p');

        tituloRega.textContent = '💧 Nessas plantas não choveu, lembre de regar:';

        tituloRega.style.marginTop = '20px';

        lista.appendChild(tituloRega);

        plantasSemChuva.forEach(nome => {

            const planta = document.createElement('div');

            planta.className = 'planta-popup';

            planta.textContent = `🌱 ${formatarNomePlanta(nome)}`;

            lista.appendChild(planta);

        });
    }

    // O popup aparece sempre que houver plantas
    if (clima.length > 0) {
        popup.style.display = 'flex';
    }
}

document.getElementById('fechar-popup').addEventListener('click', () => {

    document.getElementById('popup-regas').style.display = 'none';

});

document.getElementById('btn-abrir-popup-regas').addEventListener('click', () => {

    document.getElementById('popup-regas').style.display = 'flex';

});



async function renderizar() {

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

        const iconesContainer = document.createElement('div');
        iconesContainer.className = 'dia-icones';
        td.appendChild(iconesContainer);

        const dataCalendario = new Date(ano, mes, dia);

        plantas.forEach(async p  => {
            const dataPlanta = new Date(p.data_plantacao);
            const plantaAdm = plantasAdm.find(adm => adm.tipoPlanta === p.tipoPlanta);
            const diasPassados = (dataCalendario - dataPlanta) / (1000 * 60 * 60 * 24);
            const dataColheita = new Date(dataPlanta)
            dataColheita.setDate(dataColheita.getDate()+ plantaAdm.tempoDeColheita)

            if (
                dataPlanta.getUTCDate() === dia &&
                dataPlanta.getUTCMonth() === mes &&
                dataPlanta.getUTCFullYear() === ano
            ) {
                iconesContainer.appendChild(criarIconePlanta(p, false))
            }

            if(
                dataCalendario.getUTCDate() === dataColheita.getUTCDate() &&
                dataCalendario.getUTCMonth() === dataColheita.getUTCMonth() &&
                dataCalendario.getUTCFullYear() === dataColheita.getUTCFullYear()
            ){
                iconesContainer.appendChild(criarIconePlanta(p, true))
            }

            
        })

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

iniciar();