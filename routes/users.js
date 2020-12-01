// Imports libraries
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Loads libraries for uploading img functions
const fs = require('fs');
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'routes/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

let upload = multer({ storage: storage });

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Edit page
router.get('/edit', (req, res) => res.render('edit'));

// Edit
router.post('/edit', upload.single('image'), (req, res, next) => {
  // Gets inputs
  const { _id, name, currPassword, newPassword, newPassword2 } = req.body;
  let errors = [];

  // Get specified user from db
  let currUser = User.findOne({ _id });

  // Checks if blank
  // if (!name || !email || !currPassword || !newPassword || !newPassword2) {
  //   errors.push({ msg: 'Please enter all fields' });
  // }

  // Checks if new password & new password confirm match
  if (newPassword != newPassword2) {
    errors.push({ msg: 'New Passwords do not match' });
  }

  // Validates new password is required lenght
  if (newPassword.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  // Error Handling
  if (errors.length > 0) {
    // Redirects to edit page with errors
    res.render('edit', {
      errors,
      name,
      currPassword,
      newPassword,
      newPassword2
    });
  } else {
      //creates updated user object
      let obj = {
        name: name,
        image: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
        },
        password: newPassword
      }
      //Updates user and redirects to dashboard
      User.updateOne({ _id }, { $set: obj});
      res.redirect('/dashboard');
  }
});

// Register
router.post('/register', upload.single('image'), (req, res, next) => {
  // Collects input
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check for blanks
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  // Check if password is confirmed
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Validates password is to required length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  // Error handling
  if (errors.length > 0) {
    // Redirects to register page with errors
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Verifies Email isnt taken
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        // Redirect to register page with errors
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // Creates new User Object
        const newUser = new User({
          name,
          image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
          },
          email,
          password,
        });

        // Encrypts password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                // Takes to login page on success
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
