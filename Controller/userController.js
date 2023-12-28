const { connection } = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

const checkController = (req, res) => {
  const { email } = req.user;
  res
    .status(200)
    .json({ status: true, message: "user succesfully checked", email });
};

// ******************* register controller starts here ******************** //


const registerController = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(500)
      .json({ status: false, message: "please provide all required fields" });
  }
  
  if(password.length < 8){
    return res
      .status(500)
      .json({
        status: false,
        message: "password must be at lest 8 charachter",
      });
  }

  

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await connection.query(
      `SELECT * FROM user WHERE email='${email}'`
    );
    console.log(existingUser);

    if (existingUser[0].length !== 0) {
      return res.status(500).json({
        status: false,
        message: "this user already registered !!",
      });
    }
    await connection.query(
      `INSERT INTO user (firstName, lastName, email, password) VALUE (?,?,?,?)`,
      [firstName, lastName, email, hashPassword]
    );
    const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json({ status: true, message: " User Registered Succesfully", token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ********************** Login controller starts here ***************** //

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(500)
      .json({ status: false, message: "Please provide all required fields" });
  }

  try {
    const foundUser = await connection.query(
      `SELECT * FROM user WHERE email='${email}'`
    );
    const user = foundUser[0][0];
    // console.log(user.email)

    if (!user) {
      return res.status(403).json({ status: false, message: "invalid Email" });
    }
    const hashPassword = await bcrypt.compare(password, user.password);
    if (!hashPassword) {
      return res
        .status(403)
        .json({ status: false, message: "invalid password" });
    }

    const token = jwt.sign(
      { email: user.email, userid: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ status: true, message: "user succesfully login", token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ******************** forgot password controller starts here ************ //

const forgotController = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await connection.query(
      `SELECT * FROM user WHERE email='${email}'`
    );

    const user = response[0][0];
    // console.log(user)

    if (!email) {
      return res
        .status(401)
        .json({ message: "Please Provide all required fields" });
    }

    if (!user) {
      return res.status(401).json({ message: "Email not existed" });
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: `${user.email}`,
      subject: "Reset Your Password",
      text: `http://localhost:3000/reset/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: "false", message: "Error sending email" });
      } else {
        res.status(200).json({ status: "true", message: "Successful reset" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "false", message: "Internal server error" });
  }
};


// ********************** reset password controller starts here ******** //

const resetController = async (req, res) => {
  const { token } = req.params;
  const {password} = req.body;
  // console.log(token)
 
  if (!password) {
    return res
      .status(500)
      .json({ status: false, message: "please provide all required fields" });
  }
  if(password.length < 8) {
    return res
      .status(500)
      .json({
        status: false,
        message: "password must be at lest 8 charachter",
      });
  }
  const {email} = jwt.verify(token, process.env.SECRET_KEY)
  if(!email){
    return res.status(403).json({message: 'invalid token'})
  }
  const hashPassword = await bcrypt.hash(password, 10)
  try {
    await connection.query(`UPDATE user SET password = ? WHERE email = ?`, [hashPassword, email])
    res.status(200).json({status: true, message: 'your password succesfully reseted'})
  } catch (error) {
    res.status(500).json(error.message)
  }



  
};

module.exports = {
  checkController,
  registerController,
  loginController,
  forgotController,
  resetController,
};
