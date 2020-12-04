const fs = require('fs');
const path = require('../routes/users.js').path;

let image = {
  data: fs.readFileSync(path),
  contentType: "image/png"
}

module.exports = {
  defaultImage: image
}
