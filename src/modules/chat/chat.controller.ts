import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CHAT_PATTERNS, IGetListMessageDto } from 'src/libs';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @MessagePattern(CHAT_PATTERNS.GET_LIST_MESSAGES)
  async getDirectMessages(@Body() body: IGetListMessageDto) {
    return this.chatService.getChannelMessages(body);
  }

  @MessagePattern(CHAT_PATTERNS.GET_LIST_CHANNEL)
  async getListChannel(@Body() memberId: string) {
    return this.chatService.getListChannel(memberId);
  }
}
