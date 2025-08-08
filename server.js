// all pckages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();

// Passport config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").mongoURI;

// connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mangodb connected.."))
  .catch((err) => console.log(err));

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Middleware to track "first page" or "last home base"
app.use((req, res, next) => {
  if (!req.session.homeBase) {
    if (req.path === "/wellcome" || req.path === "/homepage") {
      req.session.homeBase = req.path; // Set it on first visit
    }
  }
  res.locals.homeLink = req.session.homeBase || "/wellcome"; // Set for EJS
  next();
});

// adding the css file
app.use(express.static(path.join(__dirname, "public")));

// adding the image file
app.use(express.static(path.join(__dirname, "images")));

// adding the script file
app.use(express.static(path.join(__dirname, "jsFiles")));

// Routes
app.use("/", require("./routes/chatbot"));
app.use("/tour-guides", require("./routes/guides"));
app.use("/", require("./routes/subscribe"));
app.use("/", require("./routes/login"));
app.use("/users", require("./routes/new-reg"));

// setting the page port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on this ${port}`);
});
