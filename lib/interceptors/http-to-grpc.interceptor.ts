import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { GRPC_CODE_FROM_HTTP } from "../utils";
import { status as Status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";

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

        const statusCode =
          GRPC_CODE_FROM_HTTP[exception.statusCode] || Status.INTERNAL;

        return throwError(
          () =>
            new RpcException({
              message: exception.message,
              code: statusCode,
            }),
        );
      }),
    );
  }
}
