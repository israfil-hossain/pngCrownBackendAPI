FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to /app
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the Node.js application
CMD ["npm", "start"]
