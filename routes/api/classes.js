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
// @desc    Login user and return JWT token
// @access  Public
router.post("/getAll", (req, res) => {
  Class.find({})
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
