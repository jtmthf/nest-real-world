import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/common/drizzle.service';

export class AppRequestContext extends RequestContext {
  requestId: string;
  correlationId: string;
  transaction?: Parameters<
    Parameters<DrizzleService['db']['transaction']>[0]
  >[0];
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx = RequestContext.currentContext.req as AppRequestContext;
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static setCorrelationId(id: string): void {
    const ctx = this.getContext();
    ctx.correlationId = id;
  }

  static getCorrelationId(): string {
    return this.getContext().correlationId;
  }

  static getTransaction(): AppRequestContext['transaction'] {
    return this.getContext().transaction;
  }

  static setTransaction(transaction: AppRequestContext['transaction']): void {
    const ctx = this.getContext();
    ctx.transaction = transaction;
  }

  static clearTransaction(): void {
    this.setTransaction(undefined);
  }
}
