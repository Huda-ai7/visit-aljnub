const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/athu");
const { render } = require("ejs");

router.get("/wellcome", (req, res, next) => {
  const currentpage = req.originalUrl;
  res.render("index", { path: currentpage });
});

// Home page
router.get("/homepage", ensureAuthenticated, (req, res) => {
  const currentpage = req.originalUrl;
  res.render("index", { name: req.user.nameF, path: currentpage });
});

// access all the pages
router.get("/dest-1", (req, res, next) => res.render("dest-1"));
router.get("/dest-2", (req, res, next) => res.render("dest-2"));
router.get("/dest-3", (req, res, next) => res.render("dest-3"));
router.get("/dest-4", (req, res, next) => res.render("dest-4"));

router.get("/events", (req, res, next) => res.render("events"));

module.exports = router;
