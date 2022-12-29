const prisma = require("../utils/prisma");
const isInputValid = require("../utils/isInputValid");
const hashPassword = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");
const comparePassword = require("../utils/comparePassword");

async function handleSignup(req, res) {
  const { fullName, email, number, password, confirmPassword } = req.body;
  if (!isInputValid(fullName, email, number, password, confirmPassword)) {
    return res.status(400).json({ message: "Field's cannot be empty" });
  }
  if (password !== confirmPassword) {
    return res
      .status(401)
      .json({ message: "Password and ConfirmPassword doesn't match" });
  }
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  console.log(userExists);
  if (userExists) {
    return res.status(400).json({ message: "Email Already Exists" });
  }
  const hashedPwd = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        number,
        password: hashedPwd,
      },
    });

    const token = generateToken({ fullName, email });

    return res.status(200).json({
      message: "Signup SuccessFul",
      data: { fullName, email: email, token: token },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Something went wrong" });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  if (!isInputValid(email, password)) {
    return res.status(400).json({ message: "Missing Required Fields" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Register first" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password doesnot match" });
    }
    const token = generateToken({ fullName: user.fullName, email });
    return res.status(200).json({
      message: "Logged In SucessFull",
      data: { fullName: user.fullName, email, token },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { handleSignup, handleLogin };
