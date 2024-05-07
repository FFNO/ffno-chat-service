import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ISendMessageDto } from 'src/libs';

export class SendMessageDto implements ISendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  channelId: string;
}
