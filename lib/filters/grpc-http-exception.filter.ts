import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { HTTP_CODE_FROM_GRPC } from "../utils";

@Catch(RpcException)
export class GrpcHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const details = JSON.parse(exception.details);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpCode: number = HTTP_CODE_FROM_GRPC[Number(exception.code)] || 500;
    const error = HttpStatus[httpCode];

    response.json({
      message: details.error,
      statusCode: httpCode,
      error,
    });
  }
}
