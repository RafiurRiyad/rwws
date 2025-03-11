import { ErrorArgument } from '../interfaces/errorArgument.interface';

export class BaseError extends Error {
  public origin: string;
  public message: string;
  public code: number;
  public statusCode: number;
  public isOperational: boolean;
  constructor(errorArg: ErrorArgument) {
    super(errorArg.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.origin = errorArg.origin;
    this.message = errorArg.message;
    this.code = errorArg.code;
    this.statusCode = errorArg.statusCode;
    this.isOperational = errorArg.isOperational;
    Error.captureStackTrace(this);
  }
}
