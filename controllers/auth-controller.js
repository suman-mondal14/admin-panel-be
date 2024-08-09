const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

//GET : http://localhost:8080/api/auth/getAllUser
const home = async (req, res) => {
  try {
    const userList = await User.find();
    res.status(200).json(userList);
  } catch (error) {
    console.log(error);
  }
};

// POST : http://localhost:8080/api/auth/register
const postHandler = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body; // Assuming you're sending JSON data in the body
    // Do something with the data

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }
    //Encryption of password : This can be done in user schema
    // const salt = 10;
    // const hash_password = await bcrypt.hash(password, salt);
    //Store in Database
    const userCreated = await User.create({ username, email, phone, password });
    res.status(201).json({
      message: "User Register Succesfully",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//PUT : User Login Logic > http://localhost:8080/api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User Not Found!" });
    }
    // const user = await bcrypt.compare(password, userExists.password);
    // if (user) {
    //   res.status(200).json({
    //     message: "Login Succesfull",
    //     token: await userExists.generateToken(),
    //     userId: userExists._id.toString(),
    //   });
    // } else {
    //   res.status(401).json({
    //     message: "Invalid Credentials !",
    //   });
    // }
    const isAuthenticated = await userExists.checkPassword(
      password,
      userExists.password
    );
    console.log(isAuthenticated); // For debugging

    if (isAuthenticated) {
      return res.status(200).json({
        message: "Login Successful",
        token: await userExists.generateToken(),
        userId: userExists._id.toString(),
      });
    } else {
      return res.status(401).json({
        message: "Invalid Credentials!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { home, postHandler, login };
