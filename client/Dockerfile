# Use official Node.js image with version 23
FROM node:23

# Set the working directory
WORKDIR /app

ENV NEXT_PRIVATE_DISABLE_ESLINT=true

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the production bundle
RUN npm run build

# Install and serve the production app
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the client port (3000)
EXPOSE 3000
