const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/v2/expense", expenseRoutes);
app.use("/api/v2/auth", authRoutes);

module.exports = app;
