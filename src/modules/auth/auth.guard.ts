import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let client = context.switchToWs().getClient();
    const cookie = client.handshake.headers.cookie;
    console.log('🚀 ~ AuthGuard ~ cookie:', cookie);

    return true;

    //     const token = request.cookies.token;

    //     if (!token) {
    //       return false;
    //     }

    //     try {
    //       const payload = this.jwtService.verify(token);
    //       request['staff'] = payload;
    //     } catch (error) {
    //       return false;
    //     }
    //     return true;
    //   }
  }
}
