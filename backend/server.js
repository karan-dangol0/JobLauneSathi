import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import savedJobsRoutes from "./routes/savedJob.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();   

// middleware to handle cors

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));



// connect Database
connectDb();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// middleware

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/save-jobs", savedJobsRoutes);
app.use("/api/analytics", analyticsRoutes);
// Serve uploads folder
//


app.listen(process.env.PORT || 4000, ()=> {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
    
})