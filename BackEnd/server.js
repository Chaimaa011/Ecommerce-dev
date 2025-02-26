import express from "express";
import connectDB from "./config/mongodb.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", import("./routes/auth.js"));
app.use("/api/orders", import("./routes/orders.js"));

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
