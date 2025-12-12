const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI.replace(
        "<PASSWORD>",
        process.env.DATABASE_PASSWORD
      )
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection Error", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
