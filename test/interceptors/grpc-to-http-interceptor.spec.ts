import { HttpException, HttpStatus } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { GrpcNotFoundException, GrpcToHttpInterceptor } from "../../lib";

const throwMockException = (
  Exception: new (...args: any[]) => any,
): Observable<any> => {
  const exception = new Exception(Exception.name).getError() as Record<
    string,
    unknown
  >;
  return throwError(() => ({
    ...exception,
    details: exception.message,
  }));
};

describe("GrpcToHttpInterceptor", () => {
  let interceptor: GrpcToHttpInterceptor;

  beforeAll(() => {
    interceptor = new GrpcToHttpInterceptor();
  });

  it("Should be defined", () => {
    expect(interceptor).toBeDefined();
  });

  it("Should convert gRPC exceptions to Http exceptions", (done) => {
    const intercept$ = interceptor.intercept({} as any, {
      handle: () => throwMockException(GrpcNotFoundException),
    }) as Observable<any>;

    intercept$.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(HttpException);
        done();
      },
      complete: () => done(),
    });
  });

  it("Should convert gRPC status code to Http status code", (done) => {
    const intercept$ = interceptor.intercept({} as any, {
      handle: () => throwMockException(GrpcNotFoundException),
    }) as Observable<any>;

    intercept$.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toEqual(HttpStatus.NOT_FOUND);
        done();
      },
      complete: () => done(),
    });
  });

  it("Should contain the gRPC exception error message", (done) => {
    const intercept$ = interceptor.intercept({} as any, {
      handle: () => throwMockException(GrpcNotFoundException),
    }) as Observable<any>;

    intercept$.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toEqual(GrpcNotFoundException.name);
        done();
      },
      complete: () => done(),
    });
  });
});
