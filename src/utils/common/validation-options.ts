import {
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { AppError } from './app-error';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
  AppError({
    status: HttpStatus.BAD_REQUEST,
    messages: errors.map( error => {
      return {
        message: Object.values(error.constraints).join(', '),
        identifier: `validation.invalidParameter.${error.property}`,
      };
    }),
  }),
};

export default validationOptions;
