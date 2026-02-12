const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors()); // ✅ simple CORS
app.use(express.json());

app.use("/api/v2/expense", expenseRoutes);
app.use("/api/v2/auth", authRoutes);

module.exports = app;
