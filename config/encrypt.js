const bcrypt = require('bcryptjs');

// Set `password` as the password you will use
// Then Run this script and copy the output as it is your encrypted password
let password = "";

// Encrypts password and returns encrypted password
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;
      console.log(hash);
  });
});
