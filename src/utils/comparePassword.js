const bcryptJs = require("bcryptjs");

async function comparePassword(password, hashedPassword) {
  return bcryptJs.compare(password, hashedPassword);
}

module.exports = comparePassword;
