const bcrypt = require('bcryptjs');

// Set `password` as the password you will use
// Then Run this script and copy the output as it is your encrypted password
// To run; open your CMD or Terminal in this directory, and use command 'node encrypt.js'

let password = "";

// Encrypts password and returns encrypted password
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;
      console.log(hash);
  });
});
