/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  let message = "Duplicate key error";

  const key = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
  const value = err?.keyValue ? Object.values(err.keyValue)[0] : null;

  if (key && value) {
    message = `${key} (${value}) already exists!`;
  }

  return {
    statusCode: 400,
    message,
  };
};
