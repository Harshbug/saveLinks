const { ZodError } = require('zod')
//this will prevent STACK TRACE VULNERABILITY 
const errorHandler = (err, req, res, next) => {
  // Log the complete error on the server
  console.error(err);

  // Decide what message to send to the client
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    })
  }
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal Server Error";

  // Send a clean JSON response
  const statusCode = err.status || 500
  res.status(statusCode).json({
    success: false,
    message,
  })
};

module.exports = errorHandler;

