// 1. Toute utilisation de await DOIT être à l'intérieur d'une fonction async
async function meuresDistance() {
  try {
    const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/fields/1/last.json`);
    const data = await response.json();
    
    // ... reste du code ...
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// 2. Pour le lancement initial, on appelle la fonction sans await
meuresDistance();

// 3. Et pour le rafraîchissement automatique
setInterval(meuresDistance, 15000);
