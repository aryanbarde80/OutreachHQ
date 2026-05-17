import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

function transform(value: any): any {
  if (Array.isArray(value)) {
    return value.map(transform);
  }
  if (value && typeof value === 'object') {
    if (value._doc) {
      return transform({ id: value._id?.toString(), ...value._doc });
    }
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, transform(inner)]));
  }
  return value;
}

@Injectable()
export class MongoIdInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => transform(data)));
  }
}

