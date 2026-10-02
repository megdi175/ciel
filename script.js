// Remplacez CHANNEL_ID et READ_API_KEY par vos valeurs ThingSpeak
const CHANNEL_ID = 'VOTRE_CHANNEL_ID';
const READ_API_KEY = 'VOTRE_READ_API_KEY';
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1.json?api_key=${READ_API_KEY}&results=20`;

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
                beginAtZero: false,
                suggestedMin: 20,
                suggestedMax: 60
            }
        }
    }
});

function rafraichirTemperature() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const feeds = data.feeds;
            if (feeds.length > 0) {
                // Récupération de la dernière mesure
                const derniereMesure = feeds[feeds.length - 1];
                const temp = parseFloat(derniereMesure.field1).toFixed(1);
                
                document.getElementById('valeur-temp').textContent = temp;
                document.getElementById('statut').textContent = "Données récupérées du Cloud";
                document.getElementById('statut').style.color = "green";

                // Reconstitution du graphique avec les 20 derniers points du Cloud
                tempChart.data.labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString());
                tempChart.data.datasets[0].data = feeds.map(f => parseFloat(f.field1));
                tempChart.update();
            }
        })
        .catch(error => {
            console.error('Erreur Cloud :', error);
            document.getElementById('statut').textContent = "Erreur de connexion au Cloud";
            document.getElementById('statut').style.color = "red";
        });
}

// Rafraîchissement toutes les 15 secondes
setInterval(rafraichirTemperature, 15000);
rafraichirTemperature();
