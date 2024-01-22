import { RuntimeEnvironment } from 'src/types/common.types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: RuntimeEnvironment;

      DISCORD_BOT_TOKEN: string;
      DISCORD_DEVELOPMENT_GUILD_ID: string;
      DISCORD_DESIRED_ROLE_NAME: string;
    }
  }
}

export {};
