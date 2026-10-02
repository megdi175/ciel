const API_URL = 'http://127.0.0.1:5000/distance';

// Initialisation du graphique Chart.js
const ctx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Les heures des relevés
        datasets: [{
            label: 'Température (°C)',
            data: [], // Les valeurs de température
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
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            const temp = data.distance;
            const tempsActuel = new Date().toLocaleTimeString();

            // Mise à jour du texte
            document.getElementById('valeur-temp').textContent = temp;
            document.getElementById('statut').textContent = "Données reçues en temps réel";
            document.getElementById('statut').style.color = "green";

            // Ajout des données au graphique
            tempChart.data.labels.push(tempsActuel);
            tempChart.data.datasets[0].data.push(temp);

            // Conserver uniquement les 20 derniers points
            if (tempChart.data.labels.length > 20) {
                tempChart.data.labels.shift();
                tempChart.data.datasets[0].data.shift();
            }

            tempChart.update();
        })
        .catch(error => {
            console.error('Erreur :', error);
            document.getElementById('statut').textContent = "Erreur de connexion au serveur Python";
            document.getElementById('statut').style.color = "red";
        });
}

// Rafraîchissement toutes les 2 secondes
setInterval(rafraichirTemperature, 2000);
rafraichirTemperature();
