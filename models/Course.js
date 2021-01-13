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
  }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
