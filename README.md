# NestJS gRPC Exceptions

This library provides `RpcException` wrappers for gRPC status codes.

### Install

```bash
pnpm add nestjs-grpc-exceptions
```

or

```bash
npm install nestjs-grpc-exceptions
```

or

```bash
yarn add nestjs-grpc-exceptions
```

### Usage:

First add the **GrpcServerExceptionFilter** to your gRPC server:

```ts
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class UserModule {}
```

Add the client interceptor to your client:

```ts
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';

@Get(':id')
@UseInterceptors(GrpcToHttpInterceptor)
function findUser(@Param('id') id: number): void;
```

Now you can use the exception classes in your servers:

```ts
import {
  GrpcNotFoundException,
  GrpcInvalidArgumentException,
} from "nestjs-grpc-exceptions";

throw new GrpcNotFoundException("User Not Found.");
throw new GrpcInvalidArgumentException("input 'name' is not valid.");
```

If you use Http Exceptions in your microservice clients, you can use the **HttpToGrpcInterceptor** interceptor to convert them

```ts
import { HttpToGrpcInterceptor } from 'nestjs-grpc-exceptions';

@UseInterceptors(HttpToGrpcInterceptor)
@GrpcMethod()
function getAllUsers(): void;
```

list of supported http status codes: 401 - 403 - 502 - 404 - 405 - 409 - 422 - 429 - 500
