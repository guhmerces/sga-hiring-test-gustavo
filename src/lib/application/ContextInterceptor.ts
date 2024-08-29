import { ExecutionContext, NestInterceptor } from "@nestjs/common";
import { nanoid } from 'nanoid';
import { AppRequestContextService } from "./AppRequestContext";

export class ContextInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: any) {
    const request = context.switchToHttp().getRequest();

    const requestId = request?.body?.requestId ?? nanoid(6)

    AppRequestContextService.setRequestId(requestId);

    return next.handle();
  }
}