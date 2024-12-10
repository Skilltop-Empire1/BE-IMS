const crypto = require('crypto');

function generateCode() {
  return crypto.randomBytes(8).toString('hex'); 
}

module.exports = generateCode