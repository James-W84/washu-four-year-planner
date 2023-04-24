const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DegreeSchema = new Schema({
  school_code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  core_reqs: {
    type: Array,
    default: [],
  },
  elective_reqs: {
    type: Array,
    default: [],
  },
  attributes: {
    type: Array,
    default: [],
  },
});

module.exports = Degree = mongoose.model("degrees", DegreeSchema);
