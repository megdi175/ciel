// Identifiants ThingSpeak
const CHANNEL_ID = '3502530';
const READ_API_KEY = 'Q9P9X4S2A178OSAL';

// URL pour récupérer les 20 dernières mesures
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1.json?api_key=${READ_API_KEY}&results=20`;

let tempChart = null;

document.addEventListener('DOMContentLoaded', () => {
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
                    tension: 0.3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) { return value + ' °C'; }
                        }
                    }
                }
            }
        });
    }

    rafraichirTemperature();
    // ThingSpeak limite les requêtes gratuites : rafraîchissement toutes les 15 secondes
    setInterval(rafraichirTemperature, 15000);
});

function rafraichirTemperature() {
    fetch(`${API_URL}&_=${Date.now()}`)
        .then(response => {
            if (!response.ok) throw new Error(`Code HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            const feeds = data.feeds;
            if (feeds && feeds.length > 0) {
                // Filtrer les entrées pour ne garder que celles avec une valeur valide
                const mesuresValides = feeds.filter(f => f.field1 !== null && f.field1 !== undefined && f.field1 !== "");

                if (mesuresValides.length > 0) {
                    // 1. Affichage de la dernière valeur
                    const derniereMesure = mesuresValides[mesuresValides.length - 1];
                    const tempAffichee = Number(derniereMesure.field1).toFixed(1);

                    const elTemp = document.getElementById('valeur-temp');
                    if (elTemp) elTemp.textContent = tempAffichee;

                    const elStatut = document.getElementById('statut');
                    if (elStatut) {
                        elStatut.textContent = "Données Cloud ThingSpeak synchronisées";
                        elStatut.style.color = "#2ecc71";
                    }

                    // 2. Mise à jour du graphique
                    if (tempChart) {
                        const heures = mesuresValides.map(f => {
                            const d = new Date(f.created_at);
                            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        });

                        const valeurs = mesuresValides.map(f => Number(f.field1));

                        tempChart.data.labels = heures;
                        tempChart.data.datasets[0].data = valeurs;
                        tempChart.update();
                    }
                } else {
                    const elStatut = document.getElementById('statut');
                    if (elStatut) {
                        elStatut.textContent = "Canal ThingSpeak vide : en attente de données...";
                        elStatut.style.color = "#e67e22";
                    }
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
