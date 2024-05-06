import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CHAT_PATTERNS, IGetMessageListDto } from 'src/libs';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @MessagePattern(CHAT_PATTERNS.GET_LIST_MESSAGES)
  async getDirectMessages(@Body() body: IGetMessageListDto) {
    return this.chatService.getDirectMessages(body.senderId, body.receiverId);
  }
}
