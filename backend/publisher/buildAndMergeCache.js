import fs from 'fs';

const offersFile = 'offers.json';
const cacheFile = 'geocode-cache.json';
const templateFile = 'geocode-cache-template.json';

// Lade bestehende Dateien
const offers = JSON.parse(fs.readFileSync(offersFile, 'utf-8'));
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf-8')) : {};
let template = {};

// 1️⃣ Baue eine Liste der fehlenden Adressen
for (let offer of offers) {
  const addr = offer.location;
  if (addr && !cache[addr]) {
    template[addr] = { latitude: null, longitude: null };
  }
}

// 2️⃣ Erstelle Template-Datei
if (Object.keys(template).length > 0) {
  fs.writeFileSync(templateFile, JSON.stringify(template, null, 2));
  console.log(`⚠️ ${Object.keys(template).length} Adressen fehlen im Cache.`);
  console.log(`➡️ Bitte trage sie in "${templateFile}" ein.`);
} else {
  console.log('✅ Alle Adressen sind bereits im Cache.');
}

// 3️⃣ Falls templateFile gefüllt ist, automatisch mergen
if (fs.existsSync(templateFile)) {
  const filledTemplate = JSON.parse(fs.readFileSync(templateFile, 'utf-8'));
  let merged = false;

  for (let addr in filledTemplate) {
    const data = filledTemplate[addr];
    if (data.latitude !== null && data.longitude !== null && !cache[addr]) {
      cache[addr] = data;
      merged = true;
      console.log(`✅ Übernommen: ${addr} ➔ ${data.latitude}, ${data.longitude}`);
    }
  }

  if (merged) {
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    console.log(`✅ Cache ("${cacheFile}") aktualisiert!`);
  } else {
    console.log('ℹ️ Keine neuen Einträge zum Mergen gefunden.');
  }
}
