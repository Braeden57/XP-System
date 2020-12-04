const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var UserModel = require('../models/User.js');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res) {
    UserModel.find({}, function(err, data) {
        res.render('dashboard', {
            user : req.user,
            members: data
        });
    });
});

module.exports = router;
