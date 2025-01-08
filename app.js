const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

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
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
app.use(authRoutes);

app.get("/set-cookies", (req, res) => {
  //res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.send("You got the cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);

  res.json(cookies);
});
