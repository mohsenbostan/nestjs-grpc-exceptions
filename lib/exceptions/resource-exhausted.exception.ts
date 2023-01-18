import { status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";
import { errorObject } from "../utils";

export class GrpcResourceExhaustedException extends RpcException {
  constructor(error: string | object) {
    super(errorObject(error, status.RESOURCE_EXHAUSTED));
  }
}
