const express = require('express');
const routes = express.Router();

// controllers
const objContact = require("../controllers/contactController");
const objAuth = require("../controllers/authController");

routes.post(
  "/contact/create/:userId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objContact.create  
);

routes.post(
  "/contact/update/:userId/:contactId",
  objAuth.requireSign,
  objAuth.requireSignError,
  objAuth.isUserAuthenicate,
  objContact.update
);

routes.get(
  "/contact/list/",
  objContact.list
);


routes.param("contactId", objContact.getContactbyId);
routes.param("userId", objAuth.getUserbyId);

module.exports = routes;