const dotenv = require('dotenv');
// Load environment variables into process
dotenv.config()

let dbPassword = process.env.DB_URI;

module.exports = {
    mongoURI: dbPassword
};
