const userModel = require("../models/user.model");
const sendRegistrationEmail = require("../services/email.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require('../models/blackList.model')

/**
* - User register controller
* - route: POST /api/auth/register
 */

async function userRegisterController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and passsword!!!",
      });
    }

    const isExists = await userModel.findOne({
      email: email,
    });

    if (isExists) {
      return res.status(422).json({
        message: "Email is already registered",
        status: "Failed",
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });

    return await sendRegistrationEmail(user.email, user.username);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // tells you WHICH field is duplicate
      return res.status(422).json({
        errors: [`${field} is already taken`],
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      console.log(messages);
      return res.status(403).json({ error: messages });
    }
  }
}

/**
* - User login controller
* - route: POST /api/auth/login
 */

async function userLoginController(req, res) {
  const { email, username, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");

  if (!user) {
    if (!email) {
      return res.status(401).json({
        message: "Username or Password is invalid",
        // status: "failed"
      });
    } else {
      return res.status(401).json({
        message: "Email or Password is invalid",
        // status: "failed"
      });
    }
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Password or Email" });
  }

  const token = await jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token);

  return res
    .status(200)
    .json({ message: "User logged In successfully!", user });
}

/**
* - User logout controller
* - route: POST /api/auth/logout
 */

async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token) {
    return res.status(400).json({
      message: "User logged out successfully"
    })
  }

  res.clearCookie("token")

  await tokenBlackListModel.create({
    token: token
  })

  res.status(200).json({
    message: "User logged out successfully"
  })
}


module.exports = { userRegisterController, userLoginController, userLogoutController };
