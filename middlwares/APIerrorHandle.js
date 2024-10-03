const ApiError = require("../src/utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      data: err.data,
      errors: err.errors,
    });
  } else {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
      errors: [err],
    });
  }
};

module.exports = errorHandler;
