// Votre numéro de Channel ThingSpeak
const CHANNEL_ID = '3502530'; 

let minDistance = Infinity;
let maxDistance = -Infinity;

// Initialisation du graphique
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
    // Interrogation de l'API publique de ThingSpeak
    const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.json`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Vérification que field1 existe et n'est pas null
    if (data && data.field1 !== null && data.field1 !== undefined) {
      const val = parseFloat(data.field1);

      if (!isNaN(val)) {
        // Affichage de la valeur principale
        document.getElementById('current-val').innerText = val.toFixed(1);
        
        // Date de mise à jour
        const dateMesure = data.created_at ? new Date(data.created_at).toLocaleTimeString() : new Date().toLocaleTimeString();
        document.getElementById('status-msg').innerText = 'Dernière mise à jour : ' + dateMesure;

        calculerMinMax(val);
        mettreAJourLeds(val);
        ajouterAuGraphique(val, dateMesure);
      }
    } else {
      document.getElementById('status-msg').innerText = 'Donnée ThingSpeak vide ou indisponible';
    }
  } catch (error) {
    console.error("Erreur de récupération :", error);
    document.getElementById('status-msg').innerText = 'Erreur : Canal privé ou inaccessible';
  }
}

function mettreAJourLeds(val) {
  const ledMin = document.getElementById('led-min');
  const ledMid = document.getElementById('led-mid');
  const ledMax = document.getElementById('led-max');

  if (ledMin && ledMid && ledMax) {
    ledMin.className = 'led';
    ledMid.className = 'led';
    ledMax.className = 'led';

    if (val < 20) {
      ledMin.classList.add('blue');
    } else if (val >= 20 && val <= 50) {
      ledMid.classList.add('green');
    } else {
      ledMax.classList.add('red');
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

// Rafraîchissement toutes les 15 secondes
setInterval(meuresDistance, 15000);

// Premier appel immédiat au chargement de la page
meuresDistance();
