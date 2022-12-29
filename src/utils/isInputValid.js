function isInputValid(...args) {
  return args.every((arg) => Boolean(arg));
}

module.exports = isInputValid;
