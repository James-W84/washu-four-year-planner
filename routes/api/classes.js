//load in dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load User model
const Class = require("../../models/Class");

// @route   POST api/classes/getAll
// @desc    Return all classes
// @access  Public
router.post("/getAll", (req, res) => {
  Class.find({})
    .limit(100)
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json({ error: err.message }));
});
// @route   POST api/classes/search
// @desc    Return all classes matching the search
// @access  Public
router.post("/search", (req, res) => {
  let searchParams = {};

  // Filter out attributes with empty values
  Object.keys(req.body).forEach((key) => {
    if (req.body[key]) {
      searchParams[key] = req.body[key];
    }
  });
  // Use the searchParams object to filter the collection
  Class.find(searchParams)
    .limit(100)
    .then((items) => {
      res.json(items);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});



module.exports = router;
