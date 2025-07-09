import fs from 'fs';
import mqtt from 'mqtt';

const brokerUrl = 'mqtt://mqtt-broker:1883';
const topic = 'kinderapp/herne';

const client  = mqtt.connect(brokerUrl, {
    reconnectPeriod: 1000
});

client.on('connect', () => {
  console.log('✅ MQTT verbunden');

  setInterval(() => {
    try {
      const offers = JSON.parse(fs.readFileSync('offers.json', 'utf8'));
      client.publish(topic, JSON.stringify(offers), () => {
        console.log(`📡 Angebote gesendet an "${topic}"`);
      });
    } catch (err) {
      console.error("❌ Fehler:", err.message);
    }
  }, 10000);
});
