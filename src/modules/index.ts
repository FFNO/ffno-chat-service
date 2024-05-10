import { ChatModule } from './chat/chat.module';
import { microServiceModules } from './services';

export const modules = [ChatModule, ...microServiceModules];
