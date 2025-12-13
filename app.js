import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders:["Content-Type", "Authorization"],
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("welcome to backend");
});

export default app;
