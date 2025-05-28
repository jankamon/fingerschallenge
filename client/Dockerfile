# BUILD STAGE
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files for client
COPY client/package.json client/package-lock.json ./client/
WORKDIR /app/client
RUN npm install

# Return to root and copy source files
WORKDIR /app
COPY client/ ./client/
COPY shared/ ./shared/

# Build the application
WORKDIR /app/client
RUN npm run build

# PRODUCTION STAGE
FROM node:22-alpine AS production

# Copy built files from the builder stage
WORKDIR /app
COPY --from=builder /app/client .

WORKDIR /app/client

# Create non-root user
RUN adduser -S appuser

USER appuser

# Expose the client port
EXPOSE 3000

CMD ["npm", "run", "start"]