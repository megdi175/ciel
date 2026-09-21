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
    const response = await fetch('http://127.0.0.1:5000/distance');
    const data = await response.json();
    
    if (data.distance !== undefined) {
      const val = parseFloat(data.distance);
      
      document.getElementById('current-val').innerText = val.toFixed(1);
      document.getElementById('status-msg').innerText = 'Dernière mise à jour : ' + new Date().toLocaleTimeString();

      calculerMinMax(val);
      mettreAJourLeds(val);
      ajouterAuGraphique(val);
    }
  } catch (error) {
    document.getElementById('status-msg').innerText = 'Erreur : Impossible de joindre le serveur Python';
  }
}

function mettreAJourLeds(val) {
  const ledMin = document.getElementById('led-min');
  const ledMid = document.getElementById('led-mid');
  const ledMax = document.getElementById('led-max');

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

function ajouterAuGraphique(val) {
  const now = new Date().toLocaleTimeString();
  
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(val);

  while (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update('none');
}

setInterval(meuresDistance, 1000);
meuresDistance();
