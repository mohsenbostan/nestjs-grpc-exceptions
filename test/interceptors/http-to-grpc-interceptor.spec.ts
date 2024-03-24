import { NotFoundException } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { HttpToGrpcInterceptor } from "../../lib";
import { RpcException } from "@nestjs/microservices";
import { status as GrpcStatusCode } from "@grpc/grpc-js";
import { GRPC_CODE_FROM_HTTP } from "../../lib/utils";

const throwMockException = (
  Exception: new (...args: any[]) => any,
): Observable<any> => {
  const exception = new Exception(Exception.name);
  return throwError(
    () =>
      new RpcException({
        message: exception.message,
        code: GRPC_CODE_FROM_HTTP[exception.status],
      }),
  );
};

describe("HttpToGrpcInterceptor", () => {
  let interceptor: HttpToGrpcInterceptor;

  beforeAll(() => {
    interceptor = new HttpToGrpcInterceptor();
  });

  it("Should be defined", () => {
    expect(interceptor).toBeDefined();
  });

  it("Should convert HTTP exceptions to gRPC exceptions", (done) => {
    const intercept$ = interceptor.intercept({} as any, {
      handle: () => throwMockException(NotFoundException),
    }) as Observable<any>;

    intercept$.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(RpcException);
        done();
      },
      complete: () => done(),
    });
  });

  it("Should convert HTTP exceptions to gRPC exceptions", (done) => {
    const intercept$ = interceptor.intercept({} as any, {
      handle: () => throwMockException(NotFoundException),
    }) as Observable<any>;

    intercept$.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(RpcException);
        expect(err.error.code).toEqual(GrpcStatusCode.NOT_FOUND);
        done();
      },
      complete: () => done(),
    });
  });

  it("Should contain the HTTP exception error message", (done) => {
    const intercept$ = interceptor.intercept({} as any, {
      handle: () => throwMockException(NotFoundException),
    }) as Observable<any>;

    intercept$.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(RpcException);
        expect(err.message).toEqual(NotFoundException.name);
        done();
      },
      complete: () => done(),
    });
  });
});
