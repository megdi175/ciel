// ⚠️ CETTE LIGNE EST OBLIGATOIRE EN HAUT DU FICHIER :
const CHANNEL_ID = '2893891'; // <--- Remplacez par VOTRE numéro de canal ThingSpeak
const READ_API_KEY = 'Q9P9X4S2A178OSAL';

async function meuresDistance() {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.json?api_key=${READ_API_KEY}`;
    const reponse = await fetch(url);
    const data = await reponse.json();

    if (data && data.field1 !== null) {
      console.log("Mesure :", data.field1);
      const elem = document.getElementById('distance');
      if (elem) {
        elem.innerText = data.field1 + " cm";
      }
    }
  } catch (erreur) {
    console.error("Erreur :", erreur);
  }
}

// Exécution immédiate puis toutes les 15 secondes
meuresDistance();
setInterval(meuresDistance, 15000);
