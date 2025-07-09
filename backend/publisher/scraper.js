import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeHerne() {
  console.log('🚀 Starte Browser...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  const geocodeCache = JSON.parse(fs.readFileSync('geocode-cache.json', 'utf-8'));

  try {
    const page = await browser.newPage();
    console.log('🌍 Lade Seite...');
    await page.goto('https://www.guterstart.nrw.de/herne.suche', { waitUntil: 'networkidle2' });

    console.log('🔎 Bitte manuell Suche starten & ENTER drücken...');
    await new Promise(resolve => process.stdin.once('data', resolve));

    console.log('🔍 Extrahiere Angebote...');
    let offers = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('h2').forEach(h2 => {
        const container = h2.closest('div');
        const title = h2.innerText.trim();
        const paragraphs = Array.from(container.querySelectorAll('p')).map(p => p.innerText.trim()).filter(Boolean);
        const allText = paragraphs.join(" | ");
        const date = container.querySelector('p.date-time')?.innerText.trim() ?? '';
        const location = container.querySelector('p.location')?.innerText.trim() ?? '';
        const tags = Array.from(container.querySelectorAll('ul.tags li')).map(li => li.innerText.trim());
        const extraTags = Array.from(container.querySelectorAll('ul li')).map(li => li.innerText.trim());
        results.push({ title, allText, paragraphs, date, location, tags, extraTags });
      });
      return results;
    });

    console.log(`📦 Gefundene Angebote: ${offers.length}`);

    for (let offer of offers) {
      if (offer.location && geocodeCache[offer.location]) {
        offer.latitude = geocodeCache[offer.location].latitude;
        offer.longitude = geocodeCache[offer.location].longitude;
        console.log(`✅ ${offer.location} ➔ ${offer.latitude}, ${offer.longitude}`);
      } else {
        offer.latitude = 51.5386; // Zentrum Herne
        offer.longitude = 7.2257;
        console.log(`⚠️ Keine Koordinaten für ${offer.location}, setze Default.`);
      }
    }

    fs.writeFileSync('offers.json', JSON.stringify(offers, null, 2));
    console.log('✅ offers.json gespeichert mit Koordinaten!');
  } catch (err) {
    console.error('❌ Fehler:', err.message);
  } finally {
    await browser.close();
    console.log('🛑 Browser geschlossen');
  }
}

scrapeHerne();
