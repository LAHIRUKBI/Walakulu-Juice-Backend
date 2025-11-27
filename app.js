// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const swaggerSpec = require("./src/config/swagger");
const swaggerUi = require("swagger-ui-express");
const { PORT } = require("./src/config");

const app = express();

// CORS Configuration - Allow Frontend to Access Backend
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Next.js default ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Walakulu Juice Backend API", 
    documentation: "/api-docs",
    frontend: process.env.FRONTEND_URL || "http://localhost:3000"
  });
});

// API Routes
app.use("/api", require("./src/routes/subscriptionRoutes"));
app.use("/api", require("./src/routes/contactRoutes"));

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔗 walakulu juice Frontend URL: http://localhost:3000`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;