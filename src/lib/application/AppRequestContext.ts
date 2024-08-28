import { Transaction } from 'kysely';
import { RequestContext } from 'nestjs-request-context';
import { Database } from 'src/boot/db';

export class AppRequestContext extends RequestContext {
  requestId: string;
  transactionConnection?: Transaction<Database>; // For global transactions
}

export class AppRequestContextService {
  static _ctx: AppRequestContext = RequestContext.currentContext?.req || {}
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext?.req || this._ctx;
    return ctx;
  }

  static setRequestId(requestId: string) {
    const ctx = this.getContext();
    ctx.requestId = requestId;
  }

  static getRequestId(): string {
    const ctx = this.getContext();
    return ctx.requestId;
  }

  static getTransactionConnection(): Transaction<Database> | undefined {
    const ctx = this.getContext();
    return ctx.transactionConnection;
  }

  static setTransactionConnection(
    transactionConnection?: Transaction<Database>,
  ): void {
    const ctx = this.getContext();
    ctx.transactionConnection = transactionConnection;
  }

  static cleanTransactionConnection(): void {
    const ctx = this.getContext();
    ctx.transactionConnection = undefined;
  }
}