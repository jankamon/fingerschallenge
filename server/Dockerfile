# BUILD STAGE
FROM node:22-alpine AS builder

# Copy source files
WORKDIR /app
COPY server/ ./server/
COPY shared/ ./shared/

# Install dependencies and build the application
WORKDIR /app/server
RUN npm ci
RUN npm run build

# PRODUCTION STAGE
FROM node:22-alpine AS production

# Copy built files from the builder stage
WORKDIR /app
COPY --from=builder /app/server .

# Create non-root user
RUN adduser -S appuser

USER appuser

# Expose the server port
EXPOSE 4000

#Run the application
WORKDIR /app/server

CMD ["npm", "run", "start:prod"]