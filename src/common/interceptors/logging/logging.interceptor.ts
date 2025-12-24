import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { Payload } from 'src/common/models/payload.model';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;
    const { method, url, body, query, params } = request;

    const userAgent = request.get('user-agent') || 'unknown';
    const userId = 0; //(request?.user as Payload).sub || 'unauthenticated';

    this.logger.log(`
    [${method} ${url} - User: ${userId} - User-Agent: ${userAgent}]
      `);

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.log(`
            [${method} ${url} - ${duration}ms] Response size - ${JSON.stringify(data)?.length || 0} bytes`);
        },
        error: (err) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.log(`
            [${method} ${url} - ${duration}ms] ${err.message}`);
        }
      })
    );
  }
}
