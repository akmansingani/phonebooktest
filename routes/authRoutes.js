const express = require("express");
const routes = express.Router();

// validators
const { userSignUpValidator, userSignInValidator } = require("../validators/authValidator");

// controllers
const objAuth = require("../controllers/authController");

routes.post("/signup", userSignUpValidator, objAuth.signup);
   
routes.post("/signin", userSignInValidator, objAuth.signin);
 
routes.get("/signout", objAuth.signout);

module.exports = routes;
