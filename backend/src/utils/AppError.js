export class AppError extends Error {
  constructor(message, status = 500, code = null) {
    super(message);
    this.status = status;
    this.code = code || AppError.codeFromStatus(status);
    this.isOperational = true;
    this.name = "AppError";
  }

  static codeFromStatus(status) {
    if (status === 400) return "VALIDATION_ERROR";
    if (status === 401) return "UNAUTHORIZED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "NOT_FOUND";
    return "INTERNAL_ERROR";
  }
}
