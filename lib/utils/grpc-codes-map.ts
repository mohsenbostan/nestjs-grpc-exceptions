import { status as Status } from "@grpc/grpc-js";
import { HttpStatus } from "@nestjs/common";

// https://github.com/nestjs/nest/blob/master/packages/common/enums/http-status.enum.ts
export const GRPC_CODE_FROM_HTTP: Record<number, number> = {
  [HttpStatus.OK]: Status.OK,
  [HttpStatus.BAD_GATEWAY]: Status.UNKNOWN,
  [HttpStatus.UNPROCESSABLE_ENTITY]: Status.INVALID_ARGUMENT,
  [HttpStatus.REQUEST_TIMEOUT]: Status.DEADLINE_EXCEEDED,
  [HttpStatus.NOT_FOUND]: Status.NOT_FOUND,
  [HttpStatus.CONFLICT]: Status.ALREADY_EXISTS,
  [HttpStatus.FORBIDDEN]: Status.PERMISSION_DENIED,
  [HttpStatus.TOO_MANY_REQUESTS]: Status.RESOURCE_EXHAUSTED,
  [HttpStatus.PRECONDITION_REQUIRED]: Status.FAILED_PRECONDITION,
  [HttpStatus.METHOD_NOT_ALLOWED]: Status.ABORTED,
  [HttpStatus.PAYLOAD_TOO_LARGE]: Status.OUT_OF_RANGE,
  [HttpStatus.NOT_IMPLEMENTED]: Status.UNIMPLEMENTED,
  [HttpStatus.INTERNAL_SERVER_ERROR]: Status.INTERNAL,
  [HttpStatus.UNAUTHORIZED]: Status.UNAUTHENTICATED,
};
