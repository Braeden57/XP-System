const fs = require('fs');
const imagePath = require('../routes/users.js').defaultPath;

let image = {
  data: fs.readFileSync(imagePath),
  contentType: "image/png"
};

module.exports = {
  defaultImage: image
};
