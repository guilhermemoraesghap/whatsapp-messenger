import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
  type: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    return {
      id: user.sub,
      type: user.type,
    };
  },
);
