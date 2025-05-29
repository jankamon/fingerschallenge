# WELCOME TO THE COLONY

## Requrements

1. PostgreSQL DB
2. Client and server .env.development or .env.production

## Getting Started

For development build && run

```bash
docker compose up --build
```

```bash
docker compose up
```

For production build && run

```bash
docker compose -f docker-compose.yml up --build
```

```bash
docker compose -f docker-compose.yml up
```

For database migration (outside docker container)

```bash
npm run migration:generate ./src/config/migrations/migration
```
