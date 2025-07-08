
# 🎯 Kids-App Backend

Dieses Backend stellt einen MQTT Broker & Node Publisher bereit, der Angebote für Kinder & Jugendliche an deine App überträgt.

## 📁 Projektstruktur

```
backend/
│
├── docker-compose.yml
├── .dockerignore
│
├── mqtt/
│   ├── config/
│   │   └── mosquitto.conf
│   ├── data/
│   └── log/
│
├── publisher/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── mqttPublisher.js
│
└── offers.json
```

---

## 🚀 Schnellstart

### ✅ Voraussetzungen
- Docker Desktop (Windows / Mac) oder Docker CLI + Docker Compose (Linux).

---

### ⏳ Installation & Start

1. **Repository klonen**

```bash
git clone <dein-repo>
cd backend
```

2. **Alles auf einmal starten:**

```bash
docker-compose up --build
```

- Dadurch wird automatisch
  - ein MQTT Broker (Mosquitto) auf `1883` & `9001` gestartet
  - dein Node Publisher gestartet, der `offers.json` liest und an MQTT published

---

## 🔥 Wie funktioniert das?

- `mqtt-broker` = Mosquitto  
  - Lauscht auf:
    - `1883` (klassisch MQTT)
    - `9001` (WebSockets, für z.B. React Native)
  - Nimmt Nachrichten entgegen & verteilt sie an alle Subscriber.

- `publisher` = Node.js Container  
  - Liest `offers.json` und published sie an Topic `kinderapp/herne`.

---

## 🚀 App mit verbinden

Deine React Native App (Expo) verbindet sich automatisch per:

```javascript
const client = mqtt.connect('ws://<IP_DEINES_SERVERS>:9001');
client.subscribe('kinderapp/herne');
```

Wenn du lokal auf Windows arbeitest:
- Nimm deine **lokale IP**, z.B. `192.168.***.**`.

---

## ⚙️ Manuelles Testen

Falls du ohne Docker testen willst:

1. MQTT Broker manuell starten
```bash
mosquitto -c mqtt/config/mosquitto.conf -v
```

2. Dann Node Publisher
```bash
cd publisher
npm install
node src/mqttPublisher.js
```

---

## 📂 Sonstiges

- `offers.json` enthält deine scraped oder erstellten Angebote.
- `publisher/src/mqttPublisher.js` liest diese Datei und published sie zyklisch oder einmalig.

---

## 💪 Deployment-Tipp

Auf einem Server (z.B. Linux VM):

```bash
docker-compose up --build -d
```

Dann läuft alles **im Hintergrund**.

---

## 📝 Lizenz

MIT - mach damit, was du willst 🚀
