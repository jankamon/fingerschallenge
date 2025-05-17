import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

import express from "express";
import { createServer } from "http";
import cors from "cors";
import { configureSocket } from "./config/socketConfig";

// Express setup
const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Socket.IO setup
const io = configureSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
