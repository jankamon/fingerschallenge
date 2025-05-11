import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

import express from "express";

const app = express();
const PORT = process.env.PORT || 4001;

app.get("/", (_, res) => {
  res.send("Welcome in colony!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
