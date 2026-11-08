# Production-ready Node.js Dockerfile for Express Backend
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies based on lockfile
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose backend API port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "src/server.js"]
