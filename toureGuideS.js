// scripts/seedTourGuides.js
const mongoose = require("mongoose");
const TourGuide = require("./models/ToureGuide");
// DB Config
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

const tourGuides = [
  {
    name: "Ahmed",
    profileImage: "/img/user.webp",
    languages: ["English", "Arabic"],
    location: "Jazan",
    categories: ["History", "Architecture"],
    description:
      "Experienced guide with over 10 years of experience showing the historical",
    rate: 120,
  },
  {
    name: "Huda",
    profileImage: "/img/user.webp",
    languages: ["Arabic"],
    location: "Najran",
    categories: ["Art", "Food"],
    description:
      "Food enthusiast and art lover. I will show you the best hidden gems of Barcelona.",
    rate: 95,
  },
  // Add more tour guides as needed
];

const seedDB = async () => {
  try {
    await TourGuide.deleteMany({});
    await TourGuide.insertMany(tourGuides);
    console.log("Tour guides seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
