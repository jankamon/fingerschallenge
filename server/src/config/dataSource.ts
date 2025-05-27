import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "localhost",
  port: parseInt(DB_PORT || "5432"),
  username: DB_USER || "postgres",
  password: DB_PASS || "postgres",
  database: DB_NAME || "fingerschallenge",
  synchronize: NODE_ENV !== "production", // Keep false in production!
  entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
  migrations: [path.join(__dirname, "./migrations/**/*.{ts,js}")],
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});
