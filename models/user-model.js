const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //bcryptjss package for encrypt the password
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//Secure password : pre is a middleware function
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    console.log("Entering into pre method before saving in database");
    const saltRound = await bcrypt.genSalt(10);
    const hash_pasword = await bcrypt.hash(user.password, saltRound);
    user.password = hash_pasword;
    console.log("Exit and save in database");
  } catch (error) {
    next(error);
  }
});

// **Components of a JWT** //
// -Header : Contains metadata about the token, such as the type og token and the signing algorithm being   used.

// -Payload : Conatains claims or statements about an entity (typically, the user) and additional data.

//Sinature :    To verify that the sender of the JWT is who itsays it is and to ensure that the message wasn't changed along the way, a signature is included.

//json web token
userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,  
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// Check Password at the time of login with decryption
userSchema.methods.checkPassword = async function (enteredPassword, actualPassword) {
  try {
    return await bcrypt.compare(enteredPassword, actualPassword);
  } catch (error) {
    console.error(error);
  }
};

// define the model or the collection Name
const User = new mongoose.model("User", userSchema);
module.exports = User;
