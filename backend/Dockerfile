# Use Node 20 (or 18+) as base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose port (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
