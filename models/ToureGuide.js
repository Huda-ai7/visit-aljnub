// models/tourGuide.js
const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "/img/user.webp",
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  location: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  availability: [
    {
      date: Date,
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("TourGuide", tourGuideSchema);
