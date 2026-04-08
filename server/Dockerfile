FROM node:20-alpine

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
