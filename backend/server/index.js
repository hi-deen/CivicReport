import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db.js";
import reportsRouter from "./routes/reports.js";
import reportTypesRouter from "./routes/reportTypes.js";
import authRouter from "./routes/auth.js";
import rateLimit from "./middlewares/rateLimit.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

// Attach io to app so controllers can emit
app.set("io", io);

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);

// Routes
app.use("/api/reports", reportsRouter);
app.use("/api/report-types", reportTypesRouter);
app.use("/api/auth", authRouter);

// health
app.get("/_health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
