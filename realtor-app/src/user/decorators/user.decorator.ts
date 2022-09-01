import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from "jsonwebtoken";

export interface UserInfo {
    name: string;
    id: number;
    iat: number;
    exp: number;
}

export const User = createParamDecorator(async (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    request.user = await jwt.decode(token);
    return request.user;
});
