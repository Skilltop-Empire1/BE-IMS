const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./customError");


const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later.",
  };
  if (err instanceof CustomApiError) {
    res.status(customError.statusCode).json({ msg: customError.msg });
  } else {
    res.status(customError.statusCode).json({ 
      msg: customError.msg,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })  
    });
  }
};

module.exports = errorHandler;
