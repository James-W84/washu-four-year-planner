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
const User = require("../../models/User");
const Program = require("../../models/Program");
const login = require("../../validation/login");

let csrf_token;

router.get("/isAuth", async (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json("unauthorize");
  }
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              return res.json({
                success: true,
                user: user,
              });
            })
            .catch((err) => console.error(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user_id: user._id,
            });
            csrf_token = token;
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

//@route   POST api/users/getUser
//@desc   Retrieve user information
//@access  Public
router.post("/getUser", (req, res) => {
  // if (req.body.token != csrf_token) {
  //   return res.status(404).json({ message: "Invalid CSRF token" });
  // }
  User.findOne({ _id: req.body.user_id }).then((user) => {
    res.json(user);
  });
});

//@route   POST api/users/update
//@desc   Update user classes
//@access  Public
router.post("/update", async (req, res) => {
  try {
    const { email, semester, classes } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.semesters) {
      user.semesters = {}; // Initialize semesters if it's undefined
    }
    if (!user.semesters[semester]) {
      user.semesters[semester] = []; // Initialize semester if it's undefined
    }
    console.log(req.body.classes);
    user.semesters[semester] = req.body.classes;
    await user.save();
    res.json({
      user: user,
    });
    return res;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//@route   POST api/users/update
//@desc   Update user classes
//@access  Public
router.post("/updateProgram", async (req, res) => {
  try {
    const { email, programId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.program) {
      user.program = {}; // Initialize semesters if it's undefined
    }
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    user.program = program;
    await user.save();

    res.json({
      user: user,
    });
    return res;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
