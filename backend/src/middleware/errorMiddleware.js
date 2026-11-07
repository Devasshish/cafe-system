/**
 * 404 Not Found Middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Sanitize message to strip any inadvertent credential leaks
  let safeMessage = err.message || 'Internal Server Error';
  if (typeof safeMessage === 'string') {
    safeMessage = safeMessage.replace(/:([^:@]{1,})@/g, ':****@');
  }

  res.status(statusCode).json({
    success: false,
    message: safeMessage,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

