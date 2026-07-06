import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes.js";
import { simulateLiveUpdates } from "./storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", router);

// Serve built frontend in production
const distPath = path.join(__dirname, "../dist/public");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start live data simulation
simulateLiveUpdates();

app.listen(PORT, () => {
  console.log(`🎥 CVMS server running on http://localhost:${PORT}`);
});
