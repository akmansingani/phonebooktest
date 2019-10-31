exports.formatErrorsList = errorList => {
  var message = {};
  var error = [];
  errorList.forEach(obj => {
    if (!message[obj.param]) {
      message[obj.param] = obj.msg;

      var tmp = {
        parameter: obj.param,
        message: obj.msg
      };
      error.push(tmp);
    }
  });

  return error;
};


