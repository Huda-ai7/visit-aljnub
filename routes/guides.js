const express = require("express");
const router = express.Router();
const TourGuide = require("../models/ToureGuide");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const dotenv = require("dotenv").config();
const { ensureAuthenticated } = require("../config/athu");

// mailer config
const transporter = require("../config/mailer");

// Get all tour guides with optional filtering
router.get("/", async (req, res) => {
  try {
    const { language, location, category } = req.query;
    let query = {};

    if (language) query.languages = language;
    if (location) query.location = location;
    if (category) query.categories = category;

    const tourGuides = await TourGuide.find(query);

    // Get unique values for filter dropdowns
    const languages = await TourGuide.distinct("languages");
    const locations = await TourGuide.distinct("location");
    const categories = await TourGuide.distinct("categories");

    res.render("tour-guide", {
      tourGuides,
      filters: { languages, locations, categories },
      selectedFilters: { language, location, category },
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Server Error");
  }
});

// Get single tour guide details
router.get("/:id", async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) {
      return req.flash("error_msg", "Tour guide not found");
    }

    // Get reviews for this tour guide
    const reviews = await Review.find({ tourGuide: req.params.id }).populate(
      "user",
      "nameF"
    );

    res.render("tour-guide-card", {
      tourGuide,
      reviews,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Server Error");
  }
});

// Check tour guide availability for a specific date
router.post("/:id/check-availability", async (req, res) => {
  try {
    const { date } = req.body;
    const tourGuide = await TourGuide.findById(req.params.id);

    if (!tourGuide) {
      return res
        .status(404)
        .json({ available: false, message: "Tour guide not found" });
    }

    // Check if there's already a booking on this date
    const existingBooking = await Booking.findOne({
      tourGuide: req.params.id,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] },
    });

    // Check tourGuide's availability array
    const availabilityEntry = tourGuide.availability.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    const isAvailable =
      !existingBooking && (!availabilityEntry || availabilityEntry.isAvailable);

    res.json({ available: isAvailable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ available: false, message: "Server Error" });
  }
});

// Book a tour guide
router.post("/:id/book", ensureAuthenticated, async (req, res) => {
  try {
    const { date } = req.body;
    const tourGuide = await TourGuide.findById(req.params.id);

    if (!tourGuide) {
      return req.flash("error_msg", "Tour guide not found");
    }

    // Check if the date is available
    const existingBooking = await Booking.findOne({
      tourGuide: req.params.id,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return req.flash("error_msg", "This date is already booked");
    }

    // Create new booking
    const booking = new Booking({
      user: req.user._id,
      tourGuide: req.params.id,
      date: new Date(date),
    });

    await booking.save();

    // Update tour guide availability
    const availabilityIndex = tourGuide.availability.findIndex(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (availabilityIndex >= 0) {
      tourGuide.availability[availabilityIndex].isAvailable = false;
    } else {
      tourGuide.availability.push({
        date: new Date(date),
        isAvailable: false,
      });
    }

    await tourGuide.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: "Tour Guide Booking Confirmation",
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for booking a tour with ${tourGuide.name}!</p>
        <p>Date: ${new Date(date).toLocaleDateString()}</p>
        <p>Please be ready at the specified time and location.</p>
        <p>Enjoy your tour!</p>
      `,
    };
    req.flash("success_msg", "booking is confirmed! Check your email.");

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
      }
    });

    res.redirect(`/tour-guides/${req.params.id}?booked=true`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Server Error");
  }
});

// Add a review
router.post("/:id/review", ensureAuthenticated, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Create the review
    const review = new Review({
      user: req.user._id,
      tourGuide: req.params.id,
      rating: parseInt(rating),
      comment,
    });

    await review.save();

    req.flash("success_msg", "Thank you for your review");
    res.redirect(`/tour-guides/${req.params.id}?reviewed=true`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Server Error");
  }
});

module.exports = router;
