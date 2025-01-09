const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

require("dotenv/config");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

//connect to db and start servr
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to DB");

    // Start the server after successful DB connection
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error.message);
    process.exit(1); // Exit the application if DB connection fails
  }
};

startServer();

// routes
app.get("*", checkUser);
app.get("/", requireAuth, (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
