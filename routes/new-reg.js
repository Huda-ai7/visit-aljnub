const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User model
const User = require("../models/User");

// const { forwardAuthenticated } = require("../config/athu");

// Login page
router.get("/login", (req, res) => res.render("login"));

//Reagister page
router.get("/new-reg", (req, res, next) => res.render("new-reg"));

// Register Handle
router.post("/new-reg", (req, res) => {
  const { nameF, nameL, email, phone, password } = req.body;
  let errors = [];

  // Check required fileds
  if (!nameF || !nameL || !email || !phone || !password) {
    errors.push({ msg: "Please fill all fields" });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: "Password Should be at lest 6 characters" });
  }

  if (errors.length > 0) {
    res.render("new-reg", {
      errors,
      nameF,
      nameL,
      email,
      phone,
      password,
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // user exists
        errors.push({ msg: "User is already registered" });
        res.render("new-reg", {
          errors,
          nameF,
          nameL,
          email,
          phone,
          password,
        });
      } else {
        const newUser = new User({
          nameF,
          nameL,
          email,
          phone,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hash
            newUser.password = hash;
            // save the user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login Handel
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/homepage",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handel
router.get("/logout", (req, res) => {
  // req.logOut();
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You logged out seccessfuly");
    res.redirect("/users/login");
  });
});
module.exports = router;
