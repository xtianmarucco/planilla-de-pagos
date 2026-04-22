export const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const isInternal = status >= 500;
  const isOperational = err.isOperational === true;
  const message =
    isInternal && !isOperational
      ? "Internal Server Error"
      : err.message || "Internal Server Error";
  const code =
    isInternal && !isOperational
      ? "INTERNAL_ERROR"
      : err.code || (isInternal ? "INTERNAL_ERROR" : "ERROR");

  if (isInternal || process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${status} - ${message}`, err.stack);
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      code,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
