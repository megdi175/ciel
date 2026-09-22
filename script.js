// 1. Déclaration des identifiants ThingSpeak
const CHANNEL_ID = '2893891'; // Remplacez 2893891 par VOTRE numéro de canal (visible sur ThingSpeak)
const READ_API_KEY = 'Q9P9X4S2A178OSAL';

// 2. URL de l'API ThingSpeak pour lire la dernière donnée du Field 1
const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.json?api_key=${READ_API_KEY}`;

// 3. Fonction de récupération des données
async function mesuresDistance() {
  try {
    const reponse = await fetch(url);
    const data = await reponse.json();

    // Vérification si une donnée est bien présente
    if (data && data.field1 !== null) {
      console.log("Nouvelle mesure reçue :", data.field1);
      
      // Mise à jour de l'affichage dans le fichier HTML
      const elementDistance = document.getElementById('distance');
      if (elementDistance) {
        elementDistance.innerText = data.field1 + " cm";
      }
    }
  } catch (erreur) {
    console.error("Erreur lors de la récupération des données :", erreur);
  }
}

// 4. Lancement automatique au chargement et répétition toutes les 15 secondes
mesuresDistance();
setInterval(mesuresDistance, 15000);
