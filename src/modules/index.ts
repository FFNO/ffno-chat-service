import { ChatModule } from './chat/chat.module';
import { CronModule } from './cron/cron.module';
import { microServiceModules } from './services';

export const modules = [CronModule, ChatModule, ...microServiceModules];
