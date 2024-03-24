import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { GRPC_EXCEPTION_FROM_HTTP } from "../utils";

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
