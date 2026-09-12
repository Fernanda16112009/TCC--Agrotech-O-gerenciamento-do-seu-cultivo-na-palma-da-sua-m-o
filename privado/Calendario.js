const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let dataAtual = new Date(2026, 8, 1);

let plantas = []
let plantasAdm = []
let clima = []

async function pegarPlantasCalendario() {   
    let resultado =  await fetch('/calendario/pegarPlantasCalendario') 

    plantas =  await resultado.json()
}

async function pegarPlantasAdmCalendario() { 
    let resultadoADM =  await fetch('/calendario/pegarPlantasAdmCalendario') 

    plantasAdm =  await resultadoADM.json()
}

async function pegarClima(plantas) {
    for( const p of plantas){
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&daily=rain_sum&timezone=auto`;

        let resultado = await fetch(url)
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

        console.log(c.nomeSafra, chuva);

        if (chuva === 0) {
            plantasSemChuva.push(c.nomeSafra);
        } else {
            plantasComChuva.push(c.nomeSafra);
        }

    });

    console.log("plantas com chuva:", plantasComChuva);
    console.log("plantas sem chuva:", plantasSemChuva);

    // Mensagem para plantas que tiveram chuva
    if (plantasComChuva.length > 0) {

        const tituloChuva = document.createElement('p');

        tituloChuva.textContent = '🌧️ Nessas plantas choveu, não precisa regar:';

        lista.appendChild(tituloChuva);

        plantasComChuva.forEach(nome => {

            const planta = document.createElement('div');

            planta.className = 'planta-popup';

            planta.textContent = `🌱 ${nome}`;

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

            planta.textContent = `🌱 ${nome}`;

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
                let pa = document.createElement('p')
                pa.textContent = p.safraNome
                td.appendChild(pa)
            }

            if(
                dataCalendario.getUTCDate() === dataColheita.getUTCDate() &&
                dataCalendario.getUTCMonth() === dataColheita.getUTCMonth() &&
                dataCalendario.getUTCFullYear() === dataColheita.getUTCFullYear()
            ){
                let pc = document.createElement('p')
                pc.textContent = `${p.safraNome} dia da colheita`
                td.appendChild(pc)
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