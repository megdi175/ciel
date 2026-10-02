// Remplacez CHANNEL_ID et READ_API_KEY par vos valeurs ThingSpeak
const CHANNEL_ID = '3502530';
const READ_API_KEY = 'Q9P9X4S2A178OSAL';

const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1.json?results=20`;

// Initialisation du graphique Chart.js
const ctx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(ctx, {
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
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

function rafraichirTemperature() {
    fetch(`${API_URL}&_=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
            const feeds = data.feeds;
            if (feeds && feeds.length > 0) {
                // 1. Récupération de la dernière valeur (ex: 58.8)
                const derniereMesure = feeds[feeds.length - 1];
                const temp = parseFloat(derniereMesure.field1).toFixed(1);

                // 2. Mise à jour de l'affichage du texte
                const elTemp = document.getElementById('valeur-temp');
                if (elTemp) elTemp.textContent = temp;

                const elStatut = document.getElementById('statut');
                if (elStatut) {
                    elStatut.textContent = "Données Cloud synchronisées";
                    elStatut.style.color = "green";
                }

                // 3. Mise à jour des courbes du graphique
                tempChart.data.labels = feeds.map(f => {
                    const d = new Date(f.created_at);
                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                });
                
                tempChart.data.datasets[0].data = feeds.map(f => parseFloat(f.field1));
                
                // Redessine le graphique
                tempChart.update();
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
            const elStatut = document.getElementById('statut');
            if (elStatut) {
                elStatut.textContent = "Erreur de chargement des données";
                elStatut.style.color = "red";
            }
        });
}

// Rafraîchissement toutes les 15 secondes
setInterval(rafraichirTemperature, 15000);

// Premier chargement immédiat
rafraichirTemperature();
