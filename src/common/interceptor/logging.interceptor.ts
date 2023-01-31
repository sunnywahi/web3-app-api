import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, method, headers, body } = context.switchToHttp().getRequest();
    const requestLogMessage = `Request : Method-${JSON.stringify(
      method,
    )}, Url :  ${JSON.stringify(url)}, Headers : ${JSON.stringify(
      headers,
    )}, Body : ${JSON.stringify(body)}`;
    this.logger.log(requestLogMessage);

    const requestStartTime = Date.now();
    return next.handle().pipe(
      tap((data) => {
        this.logger.debug(`Response : ${JSON.stringify(data)}`);
        this.logger.log(
          `Total Response Time ${Date.now() - requestStartTime}ms`,
        );
      }),
    );
  }
}
