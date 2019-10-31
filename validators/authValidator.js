const eregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const objError = require('../validators/errorFormator');

exports.userSignUpValidator = (req,res,next) => {

    req.check("name","Please enter name").notEmpty();
    
    req.check("email","Please enter email").notEmpty()
        .matches(eregex)
        .withMessage("Please enter valid email");
    
    req.check("password","Please enter password").notEmpty()
        .isLength({ min : 6 })
        .withMessage("Password must be more than 6 characters long")
        .matches(/\d/)
        .withMessage("Password must contain number");
    
    const errorList = req.validationErrors();

    if (errorList)
    {
         const err = errorList.map(errorList => errorList.msg)[0];
         return res.status(400).json({ message: err,status:"error" });
    }

    next();

}

exports.userSignInValidator = (req, res, next) => {

    req.check("email", "Please provide email").notEmpty();
    req.check("password", "Please provide password").notEmpty();
 
    const errorList = req.validationErrors();

    if (errorList) {
        const err = objError.formatErrorsList(errorList);
        return res.status(400).json({ message: err, status: "error" });
    }

    next();

}
