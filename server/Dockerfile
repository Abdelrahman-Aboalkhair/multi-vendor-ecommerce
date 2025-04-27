# Use the official Node.js image
FROM node:23

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the backend port (5000)
EXPOSE 5000

# Run the app
CMD ["npm", "run", "dev"]
