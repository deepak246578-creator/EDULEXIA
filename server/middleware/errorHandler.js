/**
 * CENTRALIZED ERROR HANDLER
 * Ensures friendly, non-technical error messages for users
 * and prevents stack trace leakage.
 */

const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err);

  const statusCode = err.status || 500;
  const message = err.isPublic
    ? err.message
    : 'An unexpected issue occurred while processing your request. Please try again.';

  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR'
  });
};

module.exports = errorHandler;
