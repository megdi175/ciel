// Remplacez CHANNEL_ID et READ_API_KEY par vos valeurs ThingSpeak
const CHANNEL_ID = '3502530';
const READ_API_KEY = 'Q9P9X4S2A178OSAL';
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1.json?api_key=${READ_API_KEY}&results=20`;

function rafraichirTemperature() {
    // L'ajout de Date.now() force le navigateur à contourner le cache local
    fetch(`${API_URL}&_=${Date.now()}`, { cache: "no-store" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const feeds = data.feeds;
            if (feeds && feeds.length > 0) {
                // Récupération du dernier point
                const derniereMesure = feeds[feeds.length - 1];
                const temp = parseFloat(derniereMesure.field1).toFixed(1);
                
                // Mises à jour DOM
                document.getElementById('valeur-temp').textContent = temp;
                document.getElementById('statut').textContent = "Données Cloud synchronisées";
                document.getElementById('statut').style.color = "green";

                // Mise à jour de la courbe Chart.js
                if (typeof tempChart !== 'undefined') {
                    tempChart.data.labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString());
                    tempChart.data.datasets[0].data = feeds.map(f => parseFloat(f.field1));
                    tempChart.update();
                }
            }
        })
        .catch(error => {
            console.warn('Reconnexion au Cloud en cours...', error);
            document.getElementById('statut').textContent = "Connexion instable, nouvelle tentative...";
            document.getElementById('statut').style.color = "orange";
        });
}

// Intervalles de 15 secondes pour respecter le quota ThingSpeak
setInterval(rafraichirTemperature, 15000);

// Premier appel au chargement
rafraichirTemperature();
