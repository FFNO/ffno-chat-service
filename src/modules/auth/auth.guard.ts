import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const request = context.switchToHttp().getRequest<Request>();

      const token = client.handshake.headers.cookie.substring(6);
      const payload = this.jwtService.verify(token);
      request['staff'] = payload;

      return Boolean(payload);
    } catch (err) {
      console.log('🚀 ~ AuthGuard ~ err:', err);
      throw new WsException(err.message);
    }
  }
}
