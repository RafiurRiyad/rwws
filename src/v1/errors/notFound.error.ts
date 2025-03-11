import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { ErrorArgument } from '../interfaces/errorArgument.interface';
import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(origin: string, message: string, code: number) {
    const errorArg: ErrorArgument = {
      origin: origin,
      message: message,
      code: code,
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    };
    super(errorArg);
  }
}
