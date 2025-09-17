FROM node:14

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Copy .env into the image
COPY .env .env

# Expose backend port
EXPOSE 5003

# Start app
CMD ["node", "server.js"]