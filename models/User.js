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
      type: Array,
      default: [],
    },
    freshmanSpring: {
      type: Array,
      default: [],
    },
    sophomoreFall: {
      type: Array,
      default: [],
    },
    sophomoreSpring: {
      type: Array,
      default: [],
    },
    juniorFall: {
      type: Array,
      default: [],
    },
    juniorSpring: {
      type: Array,
      default: [],
    },
    seniorFall: {
      type: Array,
      default: [],
    },
    seniorSpring: {
      type: Array,
      default: [],
    },
  },
});
module.exports = User = mongoose.model("users", UserSchema);
