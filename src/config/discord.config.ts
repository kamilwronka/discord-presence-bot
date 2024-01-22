import { registerAs } from '@nestjs/config';

export interface DiscordConfig {
  discordBotToken: string;
  discordDevelopmentGuildId?: string;
  discordDesiredRoleName: string;
}

export default registerAs('discord', (): DiscordConfig => {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_DEVELOPMENT_GUILD_ID,
    DISCORD_DESIRED_ROLE_NAME,
  } = process.env;

  return {
    discordBotToken: DISCORD_BOT_TOKEN,
    discordDevelopmentGuildId: DISCORD_DEVELOPMENT_GUILD_ID,
    discordDesiredRoleName: DISCORD_DESIRED_ROLE_NAME,
  };
});
