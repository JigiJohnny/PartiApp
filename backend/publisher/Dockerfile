# superkleines Node Image
FROM node:20-slim

WORKDIR /usr/src/app

# nur package.json für Install
COPY package*.json ./
RUN npm install --omit=dev

# dann Quellcode
COPY src/ ./src
COPY offers.json .

# Start
CMD ["node", "src/mqttPublisher.js"]
