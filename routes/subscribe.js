const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

// Subscriber model
const Subscriber = require("../models/Subscriber");

// mailer config
const transporter = require("../config/mailer");

// router.get("/", (req, res) => {
//   res.redirect("/wellcome");
// });
router.post("/subscribe", async (req, res, next) => {
  const { email } = req.body;
  console.log(email);

  if (!email) {
    req.flash("error_msg", "Email is required!");
    return res.redirect("/wellcome");
  }

  try {
    // Save email to database
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send Welcome Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Newsletter!",
      html: `
        <h1>Welcome!</h1>
        <p>Thank you for subscribing to our newsletter. 🎉</p>
        <p>Stay tuned for exciting news and updates!</p>
      `,
    });

    req.flash("success_msg", "Subscription successful! Check your email.");
    res.redirect("/wellcome");
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      req.flash("error_msg", "You are already subscribed!");
    } else {
      req.flash("error_msg", "An error occurred. Please try again.");
    }

    res.redirect("/wellcome");
  }
});
module.exports = router;
