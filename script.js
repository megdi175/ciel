// Identifiants ThingSpeak
const CHANNEL_ID = '3502530';
const READ_API_KEY = 'Q9P9X4S2A178OSAL';

const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1.json?api_key=${READ_API_KEY}&results=20`;

let tempChart = null;

// Attente du chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation de Chart.js
    const canvas = document.getElementById('tempChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        tempChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Température (°C)',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // 2. Lancement immédiat de la récupération de données
    rafraichirTemperature();

    // 3. Rafraîchissement automatique toutes les 15 secondes
    setInterval(rafraichirTemperature, 15000);
});

function rafraichirTemperature() {
    fetch(`${API_URL}&_=${Date.now()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Code HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const feeds = data.feeds;
            if (feeds && feeds.length > 0) {
                // Récupération de la toute dernière mesure
                const derniereMesure = feeds[feeds.length - 1];
                const temp = parseFloat(derniereMesure.field1).toFixed(1);

                // Mise à jour de la valeur affichée
                const elTemp = document.getElementById('valeur-temp');
                if (elTemp) elTemp.textContent = temp;

                // Mise à jour de l'indicateur de statut
                const elStatut = document.getElementById('statut');
                if (elStatut) {
                    elStatut.textContent = "Données Cloud synchronisées";
                    elStatut.style.color = "#2ecc71";
                }

                // Mise à jour du graphique
                if (tempChart) {
                    tempChart.data.labels = feeds.map(f => {
                        const d = new Date(f.created_at);
                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    });
                    
                    tempChart.data.datasets[0].data = feeds.map(f => parseFloat(f.field1));
                    tempChart.update();
                }
            }
        })
        .catch(error => {
            const elStatut = document.getElementById('statut');
            if (elStatut) {
                elStatut.textContent = "Erreur : " + error.message;
                elStatut.style.color = "#e74c3c";
            }
        });
}
