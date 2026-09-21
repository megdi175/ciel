// Votre numéro de Channel ThingSpeak
const CHANNEL_ID = '3502530'; 

let minDistance = Infinity;
let maxDistance = -Infinity;

const ctx = document.getElementById('distanceChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Distance (cm)',
      data: [],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      fill: true,
      tension: 0.3,
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true }
    },
    plugins: {
      legend: { labels: { color: '#f8fafc' } }
    }
  }
});

async function meuresDistance() {
  try {
    // Interrogation de l'API ThingSpeak en HTTPS
    const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.json`);
    const data = await response.json();
    
    // Traitement de la donnée reçue
    if (data && data.field1 !== undefined) {
      const val = parseFloat(data.field1);
      
      document.getElementById('current-val').innerText = val.toFixed(1);
      
      const dateMesure = new Date(data.created_at).toLocaleTimeString();
      document.getElementById('status-msg').innerText = 'Dernière mise à jour : ' + dateMesure;

      calculerMinMax(val);
      mettreAJourLeds(val);
      ajouterAuGraphique(val, dateMesure);
    }
  } catch (error) {
    document.getElementById('status-msg').innerText = 'Erreur : Impossible de joindre ThingSpeak';
  }
}

function mettreAJourLeds(val) {
  const ledMin = document.getElementById('led-min');
  const ledMid = document.getElementById('led-mid');
  const ledMax = document.getElementById('led-max');

  if (ledMin && ledMid && ledMax) {
    ledMin.className = 'led blue';
    ledMid.className = 'led green';
    ledMax.className = 'led red';

    if (val < 20) {
      ledMin.classList.add('active');
    } else if (val >= 20 && val <= 50) {
      ledMid.classList.add('active');
    } else {
      ledMax.classList.add('active');
    }
  }
}

function calculerMinMax(val) {
  if (val < minDistance) {
    minDistance = val;
    document.getElementById('min-val').innerText = minDistance.toFixed(1);
  }
  if (val > maxDistance) {
    maxDistance = val;
    document.getElementById('max-val').innerText = maxDistance.toFixed(1);
  }
}

function resetStats() {
  minDistance = Infinity;
  maxDistance = -Infinity;
  document.getElementById('min-val').innerText = '--';
  document.getElementById('max-val').innerText = '--';
}

function ajouterAuGraphique(val, heure) {
  chart.data.labels.push(heure);
  chart.data.datasets[0].data.push(val);

  while (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update('none');
}

// Rafraîchissement toutes les 15 secondes (limite gratuite de ThingSpeak)
setInterval(meuresDistance, 15000);

// Premier appel immédiat au chargement de la page
meuresDistance();  try {
    // 1. Requête vers ThingSpeak au lieu de 127.0.0.1
    const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.json`);
    const data = await response.json();
    
    // 2. Traitement de la donnée reçue depuis le Cloud
    if (data && data.field1 !== undefined) {
      const val = parseFloat(data.field1);
      
      document.getElementById('current-val').innerText = val.toFixed(1);
      
      const dateMesure = new Date(data.created_at).toLocaleTimeString();
      document.getElementById('status-msg').innerText = 'Dernière mise à jour : ' + dateMesure;

      calculerMinMax(val);
      mettreAJourLeds(val);
      ajouterAuGraphique(val, dateMesure);
    }
  } catch (error) {
    document.getElementById('status-msg').innerText = 'Erreur : Impossible de joindre ThingSpeak';
  }
}

function mettreAJourLeds(val) {
  const ledMin = document.getElementById('led-min');
  const ledMid = document.getElementById('led-mid');
  const ledMax = document.getElementById('led-max');

  if (ledMin && ledMid && ledMax) {
    ledMin.className = 'led blue';
    ledMid.className = 'led green';
    ledMax.className = 'led red';

    if (val < 20) {
      ledMin.classList.add('active');
    } else if (val >= 20 && val <= 50) {
      ledMid.classList.add('active');
    } else {
      ledMax.classList.add('active');
    }
  }
}

function calculerMinMax(val) {
  if (val < minDistance) {
    minDistance = val;
    document.getElementById('min-val').innerText = minDistance.toFixed(1);
  }
  if (val > maxDistance) {
    maxDistance = val;
    document.getElementById('max-val').innerText = maxDistance.toFixed(1);
  }
}

function resetStats() {
  minDistance = Infinity;
  maxDistance = -Infinity;
  document.getElementById('min-val').innerText = '--';
  document.getElementById('max-val').innerText = '--';
}

function ajouterAuGraphique(val, heure) {
  chart.data.labels.push(heure);
  chart.data.datasets[0].data.push(val);

  while (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update('none');
}

// ⚠️ N'oubliez pas : ThingSpeak accepte un appel toutes les 15s sur le compte gratuit
setInterval(meuresDistance, 15000);
meuresDistance();
