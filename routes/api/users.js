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
const Degree = require("../../models/Degree");
const Class = require("../../models/Class");
const login = require("../../validation/login");

//Helper functions
function check_elective(elective, course) {
  let regex = elective.replace(/\*/g, "[\\w\\d]");

  regex = new RegExp("^" + regex + "$");

  return regex.test(course);
}

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
              return res.status(201).json({
                success: true,
                name: user.name,

                user_id: user._id,
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
        const usert = {
          name: user.name,
          user_id: user._id,
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
              user: usert,
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
  User.findOne({ _id: req.body.user_id })
    .then((user) => {
      console.log(user);
      console.log(req);

      res.json(user);
    })
    .catch((err) => console.error(err));
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
      user.program = {};
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

//@route   POST api/users/validateRequirements
//@desc   Send information about user requirement completion
//@access  Public
router.post("/validateRequirements", async (req, res) => {
  console.log(req);
  User.findOne({ _id: req.body.user_id }).then((user) => {
    let program = user.program ? user.program : null;
    let degree_code = program.degree;
    let courses = Object.values(user.semesters).flatMap((arr) => arr);

    let incomplete_core = [];
    let incomplete_elective = [];
    let incomplete_distribution = [];

    let classes = courses.map(function (c) {
      return c.dept_code + " " + c.class_num;
    });
    let credits = courses.map(function (c) {
      return parseInt(c.credit_units);
    });
    let attributes = courses.map(function (c) {
      return c.distributions;
    });

    Degree.findOne({ code: degree_code }).then((degree) => {
      //Add program requirements to degree requirements
      let core_reqs = program.core_reqs.concat(degree.core_reqs);
      let elective_reqs = program.elective_reqs.concat(degree.elective_reqs);
      let distribution_reqs = program.attributes.concat(degree.attributes);

      //Core requirements
      core_reqs.forEach((req) => {
        if (typeof req == "string") {
          //Single core class
          let idx = classes.indexOf(req);
          if (idx > -1) {
            classes.splice(idx, 1);
            credits.splice(idx, 1);
            attributes.splice(idx, 1);
          } else {
            incomplete_core.push(req);
          }
        } else {
          //Options for core class
          let validated = false;
          req.every((opt) => {
            if (typeof opt == "string") {
              let idx = classes.indexOf(opt);
              if (idx > -1) {
                classes.splice(idx, 1);
                credits.splice(idx, 1);
                attributes.splice(idx, 1);
                validated = true;
                return false;
              }
            } else {
              //One option for core requirement is a sequence of classes
              if (opt.sequence) {
                let validate_sequence = true;
                opt.sequence.forEach((crs) => {
                  let idx = classes.indexOf(crs);
                  if (idx < 0) {
                    validate_sequence = false;
                  } else {
                    classes.splice(idx, 1);
                    credits.splice(idx, 1);
                    attributes.splice(idx, 1);
                  }
                });
                if (validate_sequence) {
                  validated = true;
                  return false;
                }
              }
            }
            return true;
          });
          if (!validated) {
            incomplete_core.push(req);
          }
        }
      });

      //Elective requirements
      elective_reqs.sort((a, b) => {
        if (a.validator === b.validator) {
          return b.credits - a.credits;
        } else if (a.validator) {
          return 1;
        } else {
          return -1;
        }
      });
      let classes_validator = []; //Checking validator requirements
      let classes_validator_creds = [];
      elective_reqs.forEach((req) => {
        let req_credits = req.credits;
        let opts = req.code;
        if (!req.validator) {
          if (typeof opts == "string") {
            classes.forEach((crs, index) => {
              if (check_elective(opts, crs)) {
                req_credits -= credits[index];
                classes_validator.push(crs);
                classes_validator_creds.push(credits[index]);
              }
            });
          } else {
            opts.forEach((opt) => {
              classes.forEach((crs, index) => {
                if (check_elective(opt, crs)) {
                  req_credits -= credits[index];
                  classes_validator.push(crs);
                  classes_validator_creds.push(credits[index]);
                }
              });
            });
          }
        } else {
          if (typeof opts == "string") {
            classes_validator.forEach((crs, index) => {
              if (check_elective(opts, crs)) {
                if (req.min_level) {
                  let level = crs.match(/\d+/g)[0];
                  if (level >= req.min_level) {
                    req_credits -= classes_validator_creds[index];
                  }
                } else {
                  req_credits -= classes_validator_creds[index];
                }
              }
            });
          } else {
            opts.forEach((opt) => {
              classes_validator.forEach((crs, index) => {
                if (check_elective(opt, crs)) {
                  if (req.min_level) {
                    let level = crs.match(/\d+/g)[0];
                    if (level >= req.min_level) {
                      req_credits -= classes_validator_creds[index];
                    }
                  } else {
                    req_credits -= classes_validator_creds[index];
                  }
                }
              });
            });
          }
        }
        if (req_credits > 0) {
          req.credits = req_credits;
          incomplete_elective.push(req);
        }
      });

      //Attributes/distribution requirements
      distribution_reqs.sort((a, b) => {
        if (a.validator === b.validator) {
          return b.credits - a.credits;
        } else if (a.validator) {
          return 1;
        } else {
          return -1;
        }
      });
      let attribute_class_validator = [];
      let attributes_validator = [];
      let attributes_validator_creds = [];
      distribution_reqs.forEach((req) => {
        let req_credits = req.credits;
        let opts = req.attr;
        if (!req.validator) {
          if (typeof opts == "string") {
            let [type, attr] = opts.split(": ");
            attributes.forEach((att, index) => {
              if (att && att[type] && att[type].indexOf(attr) > -1) {
                attribute_class_validator.push(classes[index]);
                attributes_validator.push(att);
                attributes_validator_creds.push(credits[index]);
                req_credits -= credits[index];
              }
            });
          } else {
            opts.forEach((opt) => {
              let [type, attr] = opt.split(": ");
              attributes.forEach((att, index) => {
                if (att && att[type] && att[type].indexOf(attr) > -1) {
                  attribute_class_validator.push(classes[index]);
                  attributes_validator.push(att);
                  attributes_validator_creds.push(credits[index]);
                  req_credits -= credits[index];
                }
              });
            });
          }
        } else {
          if (typeof opts == "string") {
            let [type, attr] = opts.split(": ");
            attributes_validator.forEach((att, index) => {
              if (att && att[type] && att[type].indexOf(attr) > -1) {
                if (req.min_level) {
                  let level = attribute_class_validator[index].match(/\d+/g)[0];
                  if (level >= req.min_level) {
                    req_credits -= classes_validator_creds[index];
                  }
                } else {
                  req_credits -= classes_validator_creds[index];
                }
              }
            });
          } else {
            opts.forEach((opt) => {
              let [type, attr] = opt.split(": ");
              attributes_validator.forEach((att, index) => {
                if (att && att[type] && att[type].indexOf(attr) > -1) {
                  if (req.min_level) {
                    let level =
                      attribute_class_validator[index].match(/\d+/g)[0];
                    if (level >= req.min_level) {
                      req_credits -= classes_validator_creds[index];
                    }
                  } else {
                    req_credits -= classes_validator_creds[index];
                  }
                }
              });
            });
          }
        }
        if (req_credits > 0) {
          req.credits = req_credits;
          incomplete_distribution.push(req);
        }
      });
      res.json({
        incomplete_core: incomplete_core,
        incomplete_elective: incomplete_elective,
        incomplete_distribution: incomplete_distribution,
      });
    });
  });
});

module.exports = router;
