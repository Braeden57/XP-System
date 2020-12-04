// Imports libraries
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// DB Config
const db = require('../config/keys').mongoURI;

// Loads libraries for uploading img functions
let fs = require('fs');
let path = require('path');
let multer = require('multer');

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
  // Passes image path to defaultImage Model
  imagePath = __dirname + '/uploads/image-1606947471396';
  module.exports = {
    path: imagePath
  }

  // Gets inputs
  const { _id, name, newPassword, newPassword2 } = req.body;
  let errors = [];
  let useName = true;
  let useNewPassword = true;

  if (!name) {
    useName = false;
  }

  if (!newPassword) {
    if (newPassword2.length > 0) {
      errors.push({ msg: 'You need to enter your new password' })
    }

    if (!newPassword2) {
      useNewPassword = false;
    }
  }

  if (newPassword.length > 0) {
    if (!newPassword2) {
      errors.push({ msg: 'Confirm new Password' })
    }

    // Checks if new password & new password confirm match
    if (newPassword != newPassword2) {
      errors.push({ msg: 'New Passwords do not match' });
    }

    // Validates new password is required lenght
    if (newPassword.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
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
    let hashPass;
    let updated;
    let defaultImage = require('../models/defaultImage').defaultImage;

    try {
      if (useName && useNewPassword) {
        // Encrypts password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
              hashPass = hash;
          });
        });

        console.log(newPassword);
        console.log(hashPass);

        //creates updated image object
        updated = {
          name: name,
          image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
          },
          password: hashPass
        }
      }

      if (useName) {
        //creates updated image object
        updated = {
          name: name,
          image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
          }
        }
      }

      if (useNewPassword) {
        //creates updated image object
        updated = {
          image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
          },
          password: hashPass
        }
      }

      if (!useName && !useNewPassword) {
        //creates updated image object
        updated = {
          image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
          }
        }
      }
      //Updates user and redirects to dashboard
      MongoClient.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true}, function(err, db) {
          if (err) throw err;
          let dbo = db.db("XPmockDB");
          dbo.collection('users').updateOne({ _id: ObjectId(_id) }, { $set: updated }, { upsert: true }, function(err, res) {
            if (err) throw err;
            console.log('1 Document Updated');
            console.log('With customImage');
            db.close()
          });
          res.redirect('/users/login');
        }
      );
    }
    catch(err) {
      console.log(err);
      if (useName && useNewPassword) {
        // Encrypts password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
              hashPass = hash;
          });
        });

        console.log(newPassword);
        console.log(hashPass);

        //creates updated image object
        updated = {
          name: name,
          image: defaultImage,
          password: hashPass
        }
      }

      if (useName) {
        //creates updated image object
        updated = {
          name: name,
          image: defaultImage
        }
      }

      if (useNewPassword) {
        //creates updated image object
        updated = {
          image: defaultImage,
          password: hashPass
        }
      }

      if (!useName && !useNewPassword) {
        //creates updated image object
        updated = {
          image: defaultImage
        }
      }
      //Updates user and redirects to dashboard
      MongoClient.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true}, function(err, db) {
          if (err) throw err;
          let dbo = db.db("XPmockDB");
          dbo.collection('users').updateOne({ _id: ObjectId(_id) }, { $set: updated }, { upsert: true }, function(err, res) {
            if (err) throw err;
            console.log('1 Document Updated');
            console.log('With defaultImage');
            db.close()
          });
          res.flash('Success')
          res.redirect('/users/login');
        }
      );
    }
  }
});

// Register
router.post('/register', upload.single('image'), (req, res, next) => {
  // Passes image path to defaultImage Model
  path = __dirname + '/uploads/image-1606947471396';
  module.exports = {
    path: path
  }

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

        try {
          // Creates new User Object
          const newUser = new User({
            name,
            email,
            password,
            image: {
              data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
              contentType: 'image/png'
            }
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
        catch(err) {
          const defaultImage = require('../models/defaultImage').defaultImage;
          // Creates new User Object
          const newUser = new User({
            name,
            email,
            password,
            image: defaultImage
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
