import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({
    [err.path]: err.msg,
  }));

  return next(
    new ApiError(
      422,
      "Received data is not valid",
      extractedErrors
    )
  );
};
