import { HttpStatusCode } from '../enums/httpStatusCode.enum';

export interface ErrorArgument {
  origin: string;
  message: string;
  code: number;
  statusCode: HttpStatusCode;
  isOperational: boolean;
}
