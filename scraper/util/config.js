try {
  module.exports = require('../config.js');
} catch (err) {
  console.error('Error using config.js - Make a scraper/config.js like this:\n',
  `
  module.exports = {
    host: '',
    user: '',
    password: '',
    database: ''
  }
  `);
}
