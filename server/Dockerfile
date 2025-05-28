# BUILD STAGE
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files for server
COPY server/package.json server/package-lock.json ./server/
WORKDIR /app/server
RUN npm install

# Return to root and copy source files
WORKDIR /app
COPY server/ ./server/
COPY shared/ ./shared/

# Build the application
WORKDIR /app/server
RUN npm run build

# PRODUCTION STAGE
FROM node:22-alpine AS production

# Copy built files from the builder stage
WORKDIR /app
COPY --from=builder /app/server .

WORKDIR /app/server

# Create non-root user
RUN adduser -S appuser

USER appuser

# Expose the server port
EXPOSE 4000

CMD ["npm", "run", "start"]