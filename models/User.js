//pull in dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create user schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  program: {
    type: Object,
    default: {},
  },
  semesters: {
    freshmanFall: {
      type: Object,
      default: {},
    },
    freshmanSpring: {
      type: Object,
      default: {},
    },
    sophomoreFall: {
      type: Object,
      default: {},
    },
    sophomoreSpring: {
      type: Object,
      default: {},
    },
    juniorFall: {
      type: Object,
      default: {},
    },
    juniorSpring: {
      type: Object,
      default: {},
    },
    seniorFall: {
      type: Object,
      default: {},
    },
    seniorSpring: {
      type: Object,
      default: {},
    },
  },
});
module.exports = User = mongoose.model("users", UserSchema);
