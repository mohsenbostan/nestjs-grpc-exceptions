import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
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

const GRPC_EXCEPTION_FROM_HTTP: Record<number, any> = {
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

@Injectable()
export class HttpToGrpcInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (
          !(
            typeof err === "object" &&
            "response" in err &&
            err.response &&
            "status" in err
          )
        )
          return throwError(() => err);

        const exception = err.response as {
          error: string | object;
          statusCode: number;
          message: string;
        };

        if (!(exception.statusCode in GRPC_EXCEPTION_FROM_HTTP))
          return throwError(() => err);

        const Exception = GRPC_EXCEPTION_FROM_HTTP[exception.statusCode];
        return throwError(() => new Exception(exception.message));
      }),
    );
  }
}
