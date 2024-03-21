import { HttpStatus } from "@nestjs/common";
import {
  GrpcAbortedException,
  GrpcAlreadyExistsException,
  GrpcInternalException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcPermissionDeniedException,
  GrpcResourceExhaustedException,
  GrpcUnauthenticatedException,
  GrpcUnknownException,
} from "../exceptions";

export const GRPC_EXCEPTION_FROM_HTTP: Record<number, any> = {
  [HttpStatus.NOT_FOUND]: GrpcNotFoundException,
  [HttpStatus.FORBIDDEN]: GrpcPermissionDeniedException,
  [HttpStatus.METHOD_NOT_ALLOWED]: GrpcAbortedException,
  [HttpStatus.INTERNAL_SERVER_ERROR]: GrpcInternalException,
  [HttpStatus.TOO_MANY_REQUESTS]: GrpcResourceExhaustedException,
  [HttpStatus.BAD_GATEWAY]: GrpcUnknownException,
  [HttpStatus.CONFLICT]: GrpcAlreadyExistsException,
  [HttpStatus.UNPROCESSABLE_ENTITY]: GrpcInvalidArgumentException,
  [HttpStatus.UNAUTHORIZED]: GrpcUnauthenticatedException,
};
