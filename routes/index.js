const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// DB Config
const db = require('../config/keys').mongoURI;
let MongoClient = require('mongodb').MongoClient;
let UserModal = require('../models/User');
let QuestModal = require('../models/Quest')
let CourseModal = require('../models/Course')
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res) {
  //Collects Course Data
  CourseModal.find({}, function(err, courses) {
    // Collects Quest Data
    QuestModal.find({}, function(err, quests) {
      // Collects User Data
      UserModal.find({}, function(err, data) {
        res.render('dashboard', {
          user : req.user,
          members: data,
          quests: quests,
          courses: courses
        });
      });
    });
  });
});

module.exports = router;
