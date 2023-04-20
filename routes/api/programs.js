const express = require("express");
const router = express.Router();

const Program = require("../../models/Program");

// @route   POST api/programs/getAll
// @desc    Return all classes
// @access  Public
router.post("/getAll", (req, res) => {
  console.log("meep");
  Program.find({})
    .limit(100)
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json({ error: err.message }));
});
module.exports = router;
