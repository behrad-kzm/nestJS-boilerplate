import { HttpException, HttpStatus } from "@nestjs/common";

export function AppError(
  {status, messages}: { status: HttpStatus, messages: { message: string, identifier: string }[] }
) {
  return new HttpException(
    {
      status,
      messages,
    },
    status,
  );
}