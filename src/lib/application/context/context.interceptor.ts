import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { RequestContextService } from './app-request-context';

export class ContextInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const requestId = request.id;
    const correlationId =
      (request.headers['x-correlation-id'] as string) ?? crypto.randomUUID();

    RequestContextService.setRequestId(requestId);
    RequestContextService.setCorrelationId(correlationId);

    return next.handle();
  }
}
