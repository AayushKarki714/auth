const bcyptJs = require("bcryptjs");

const hashPassword = async function (password) {
  return await bcyptJs.hash(password, 10);
};

module.exports = hashPassword;
