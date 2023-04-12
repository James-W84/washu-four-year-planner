//pull in dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  school_code: {
    type: String,
    required: true,
  },
  dept_num: {
    type: String,
    required: true,
  },
  dept_code: {
    type: String,
    required: true,
  },
  class_num: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  credit_units: {
    type: Number,
    required: true,
  },
  distributions: {
    type: Object,
    required: false,
  },
});
module.exports = mongoose.model("Class", ClassSchema);
