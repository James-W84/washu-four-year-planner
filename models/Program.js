const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProgramSchema = new Schema({
  _id: {
    type: mongoose.Types.ObjectId,
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
  degree: {
    type: String,
    required: true,
  },
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
  core_reqs: {
    type: [[String]],
    default: [],
  },
  elective_reqs: {
    type: [Object],
    default: [],
  },
  attributes: {
    type: [Object],
    default: [],
  },
});

module.exports = Program = mongoose.model("programs", ProgramSchema);
