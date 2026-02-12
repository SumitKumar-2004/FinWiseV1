const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
