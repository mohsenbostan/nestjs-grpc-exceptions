import { Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { throwError, Observable } from "rxjs";

@Catch(RpcException)
export class GrpcServerExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    return throwError(() => exception.getError());
  }
}
