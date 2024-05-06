import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('direct/:memberId')
  async getDirectMessages(
    @Param('memberId') memberId: string,
    @Req() req: Request,
  ) {
    return this.chatService.getDirectMessages(req.staff.id, memberId);
  }
}
