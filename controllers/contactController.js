const _ = require("lodash");
const { errorHandler } = require("../handlers/dbErrorHandler");
const Contact = require("../models/contactModel");

exports.create = async (req, res) => {

  const contact = new Contact(req.body);

  await contact.save((err, contact) => {
    if (err) {
      let customError = errorHandler(err);

      if (customError) {
        customError = customError.substring(
          customError.lastIndexOf(":") + 2,
          customError.length - 1
        );
        customError =
          customError.charAt(0).toUpperCase() + customError.slice(1);
      }

      return res.status(400).json({
        message: customError,
        status: "error"
      });
    }

    return res.status(200).json({
      name: contact.name,
      phone: contact.phone,
      status: "success"
    });
  });
};

exports.getContactbyId = async (req, res, next, contactId) => {
  await Contact.findById(contactId).exec((err, contact) => {
    if (err || !contact) {
      return res.status(400).json({
        message: "Contact not found",
        status: "error"
      });
    }

    req.contact = contact;
    next();
  });
};

exports.list = (req, res) => {
  let order = req.query.order == "desc" ? -1 : 1;
  let sortby = req.query.sortby ? req.query.sortby : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;

  if (sortby == "nm") {
    sortby = { name: order };
  } 

  Contact.find()
    .sort(sortby)
    .limit(limit)
    .skip(skip)
    .exec((err, result) => {

      if (err) {
        return res.status(400).json({
          message: "Contacts not found",
          status : "error"
        });
      }

      res.json({
        size: result.length,
        result,
        status: "success"
      });
    });
};


exports.update = (req, res) => {
  let objContact = req.contact;
  objContact = _.extend(objContact, req.body);

  objContact.save((err, contact) => {
    if (err && !result) {
      return res.status(400).json({
        message: errorHandler(err),
        status: "error"
      });
    }
    req.contact = contact;

    return res.status(200).json({
      name: contact.name,
      phone: contact.phone,
      status: "success"
    });
  });
};



