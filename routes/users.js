// Imports libraries
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Quest = require('../models/Quest');

// Load Profanity filter
const Filter = require('bad-words');
const filter = new Filter();

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

let questsList;
// Collects Quest Data
Quest.find({}, function(err, quests) {
  questsList = quests;
});

// Show Quest page
router.get('/quests', (req, res) => res.render('quests', { quests: questsList }));

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Edit page
router.get('/edit', (req, res) => res.render('edit'));

// Create Quest
router.post('/createQuest', (req, res, next) => {
  const { title, amount, expiry, instructions, campaign} = req.body;

  let errors = [];

  // Checks if Quest with title exists
  Quest.findOne({ title: title }).then(quest => {
    if (quest) {
      errors.push({ msg: 'Quest Already Exists' });
      // Redirect to dashboard page with errors
      res.render('dashboard', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {

      try {
        // Creates new User Object
        const newQuest = new Quest({
          title: title,
          campaign: campaign,
          expiry: expiry,
          xp: amount,
          instruction: instructions
        });
        newQuest
          .save()
          .then(user => {
            req.flash(
              'success_msg'
            );
            // Takes to Dashboard on success
            let value = encodeURIComponent('createdQuest')
            res.redirect('/dashboard?successRate=' + value);
          })
          .catch(err => console.log(err));
      } catch (err) {
        if (err) throw err;
      }
    }
  });
});

// Add XP
router.post('/addXP', (req, res, next) => {
  const { _id_add, current_xp, amount } = req.body;

  if(amount > 50) {
    // Takes to Dahsboard on success
    let value = encodeURIComponent('addXP > 50')
    res.redirect('/dashboard?successRate=' + value);
  }

  if(amount < 0 || amount == 0) {
    // Takes to Dahsboard on success
    let value = encodeURIComponent('addXP <= 0')
    res.redirect('/dashboard?successRate=' + value);
  }

  if (amount < 50 && amount > 0 && current_xp < 800) {
    let newXP = parseInt(current_xp) + parseInt(amount);
    if (newXP > 800) {
      newXP = 800;
    }

    try {
      // Creates updated object
      let updated = {
        xp: newXP
      }

      // Updates user xp
      MongoClient.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true}, function(err, db) {
          if (err) throw err;
          let dbo = db.db("XPmockDB");
          dbo.collection('users').updateOne({ _id: ObjectId(_id_add) }, { $set: updated }, { upsert: true }, function(err, res) {
            if (err) throw err;
            db.close()
          });
          // Takes to Dahsboard on success
          let value = encodeURIComponent(amount.toString())
          res.redirect('/dashboard?successRate=' + value);
        }
      );
    }
    catch(err) {
      console.log(err);
    }
  }
});

// Edit
router.post('/edit', upload.single('image'), (req, res, next) => {
  // Passes image path to defaultImage Model
  imagePath = __dirname + '/uploads/default-image';
  module.exports = {
    defaultPath: imagePath
  }

  // Gets inputs
  let { _id, name, newPassword, newPassword2 } = req.body;
  let errors = [];
  let useName = true;
  let useNewPassword = true;

  if (!name) {
    useName = false;
  }

  if (filter.isProfane(name)) {
    errors.push({ msg: "Name contains profanity" });
    name = filter.clean(name);
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

  if (filter.isProfane(newPassword)) {
    errors.push({ msg: "Password contains profanity" });
    newPassword = filter.clean(newPassword);
  }

  if (filter.isProfane(newPassword2)) {
    errors.push({ msg: "Password contains profanity" });
    newPassword2 = filter.clean(newPassword2);
  }

  // Error Handling
  if (errors.length > 0) {
    // Redirects to edit page with errors
    res.render('edit', {
      errors,
      name,
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

      // Deletes File for its not needed
      fs.unlink(path.join(__dirname + '/uploads/' + req.file.filename), function (err) {
        if (err) throw err;
      });

      //Updates user and redirects to dashboard
      MongoClient.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true}, function(err, db) {
          if (err) throw err;
          let dbo = db.db("XPmockDB");
          dbo.collection('users').updateOne({ _id: ObjectId(_id) }, { $set: updated }, { upsert: true }, function(err, res) {
            if (err) throw err;
            db.close()
          });
          res.redirect('/users/login');
        }
      );
    }
    catch(err) {
      if (useName && useNewPassword) {
        // Encrypts password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
              hashPass = hash;
          });
        });

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
            db.close()
          });
          res.redirect('/users/login');
        }
      );
    }
  }
});

// Register Teacher
router.post('/registerTeacher', upload.single('image'), (req, res, next) => {
  // Passes image path to defaultImage Model
  imagePath = __dirname + '/uploads/default-image';
  module.exports = {
    defaultPath: imagePath
  }

  // Collects input
  let { name, email, password, password2 } = req.body;
  let errors = [];

  // Check for blanks
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (filter.isProfane(name)) {
    errors.push({ msg: 'Name contains profanity' });
    name = filter.clean(name);
  }

  if (filter.isProfane(password)) {
    errors.push({ msg: "Password contains profanity" })
    password = filter.clean(password);
  }

  if(filter.isProfane(password2)) {
    errors.push({ msg: "Password contains profanity" })
    password2 = filter.clean(password2);
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
        // Redirect to dashboard page with errors
        res.render('dashboard', {
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

          // Deletes File for its not needed
          fs.unlink(path.join(__dirname + '/uploads/' + req.file.filename), function (err) {
            if (err) throw err;
          });

          // Encrypts password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.role = "Teacher";
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg'
                  );
                  // Takes to Dashboard on success
                  let value = encodeURIComponent('success')
                  res.redirect('/dashboard?createTeacher=' + value);
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
              newUser.role = "Teacher";
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg'
                  );
                  // Takes to Dashboard on success
                  let value = encodeURIComponent('success')
                  res.redirect('/dashboard?createTeacher=' + value);
                })
                .catch(err => console.log(err));
            });
          });
        }
      }
    });
  }
});

// Register
router.post('/register', upload.single('image'), (req, res, next) => {
  // Passes image path to defaultImage Model
  imagePath = __dirname + '/uploads/default-image';
  module.exports = {
    defaultPath: imagePath
  }

  // Collects input
  let { name, email, password, password2 } = req.body;
  let errors = [];

  // Check for blanks
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if(filter.isProfane(name)) {
    errors.push({ msg: "Name contains profanity" });
    name = filter.clean(name);
  }

  if(filter.isProfane(password)) {
    errors.push({ msg: "Password contains profanity" });
    password = filter.clean(password);
  }

  if(filter.isProfane(password2)) {
    errors.push({ msg: "Password contains profanity" });
    password2 = filter.clean(password2);
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

          // Deletes File for its not needed
          fs.unlink(path.join(__dirname + '/uploads/' + req.file.filename), function (err) {
            if (err) throw err;
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
