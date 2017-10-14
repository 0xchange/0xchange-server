try {
  module.exports = require('../config.js');
} catch (err) {
  console.error('Error using config.js - Make a config.js like this in project root:\n',
  `
  module.exports = {
    infuraURL: 'https://mainnet.infura.io/TOKEN'
  }
  `);
}
