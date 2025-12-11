# 1. Use Node.js image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the frontend code
COPY . .

# 6. Expose Next.js default port
EXPOSE 3000

# 7. Start the Next.js development server
CMD ["npm", "run", "dev"]