# backend/app/Dockerfile
FROM node:20

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere package.json + install dependencies
COPY package*.json ./
RUN npm install --omit=dev


# Kopiere source
COPY src/ ./src

# Starte dein Script
CMD ["node", "src/mqttPublisher.js"]
