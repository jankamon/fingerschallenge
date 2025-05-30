# BUILD STAGE
FROM node:22-alpine AS builder

# Copy source files
WORKDIR /app
COPY client/ ./client/
COPY shared/ ./shared/

# Install dependencies and build the application
WORKDIR /app/client
RUN npm ci
RUN npm run build

# PRODUCTION STAGE
FROM node:22-alpine AS production

# Copy built files from the builder stage
WORKDIR /app
COPY --from=builder /app/client .

# Create non-root user
RUN adduser -S appuser

# Create the cache directory and set permissions
RUN mkdir -p /app/.next/cache && \
    chown -R appuser /app/.next/cache

USER appuser

# Expose the client port
EXPOSE 3000

# Run the application
WORKDIR /app/client

CMD ["npm", "run", "start"]