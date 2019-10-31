const User = require("../models/userModel");
const { errorHandler } = require("../handlers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup =  async (req, res) => {
  
  const user = new User(req.body);

  await user.save((err, user) => {
    if (err) {

      let customError = errorHandler(err);

      if(customError)
      {
         customError = customError.substring(customError.lastIndexOf(":")+2,customError.length-1);
         customError = customError.charAt(0).toUpperCase() + customError.slice(1);
      }

      return res.status(400).json({
        message: customError,
        status: "error"
      });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      status: "success"
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

 

  User.findOne({ email }, (err, user) => {
    if (!user || err) {
      return res.status(400).json({
        message: "User does not exists!",
        status: "error"
      });
    }

     console.log("login : " + user);

    // check password
    if (!user.authenticateUser(password)) {
      return res.status(400).json({
        message: "Email and password does not match!",
        status: "error"
      });
    }

    // on success generate login token and set cookie
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWTKEY
    );

    res.cookie("uToken", token, { maxAge: 5 * 60 * 60 * 1000 });

    const { _id, name, email } = user;

    return res.json({
      status : "success",
      token,
      user: { _id, name, email }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("uToken");
  res.json({
    message: "User has been successfully sign out!",
    status: "success"
  });
};

exports.getUserbyId = async (req, res, next, userId) => {
  await User.findById(userId)
    .select({
      en_password: false,
      saltKey: false
    })
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Invalid user request",
          status: "error"
        });
      }

      req.user = user;
      next();
    });
};


// ********************** Middle ware *******************************

exports.requireSign =  expressJwt({
  secret: process.env.JWTKEY,
  userProperty:"auth"
});

exports.requireSignError = (err, req, res, next) => {
  
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Invalid User Token!",
      status: "error"
    });
  }
};

exports.isUserAuthenicate = (req, res, next) => {
 
  let user = req.user && req.auth && req.user._id == req.auth._id;

  if(!user)
  {
     return res.status(401).json({
       message: "User does not exists!",
       status: "error"
     });
  }
   
  next();
};


// ********************** Middle ware *******************************