import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { AppRequestContextService } from "../AppRequestContext";
import { nanoid } from 'nanoid';

export class ContextInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: any) {
    const request = context.switchToHttp().getRequest();

    const requestId = request?.body?.requestId ?? nanoid(6)

    AppRequestContextService.setRequestId(requestId);

    return next.handle();
  }
}