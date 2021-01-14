const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  students: {
    type: [String]
  },
  campaigns: {
    type: [String]
  }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
