# backend/Dockerfile
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose the port your Express server listens on
EXPOSE 8000

# Command to start the server
CMD ["node", "index.js"]