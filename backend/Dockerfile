# 1. Use an official Node.js runtime as a parent image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Fix permissions for node_modules binaries
RUN chmod -R +x node_modules/.bin

# 6. Copy the rest of the backend code
COPY . .

# 7. Expose the port the app runs on
EXPOSE 5001

# 8. Command to run the app
CMD ["npm", "run", "dev"]