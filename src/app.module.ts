import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntentsBitField } from 'discord.js';
import { NecordModule } from 'necord';
import { AppService } from 'src/app.service';
import { APP_CONFIG } from 'src/config/app.config';
import { DiscordConfig } from 'src/config/discord.config';
import { ServiceConfig } from 'src/config/service.config';
import { RuntimeEnvironment } from 'src/types/common.types';

@Module({
  imports: [
    ConfigModule.forRoot(APP_CONFIG),
    ConfigModule,
    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { discordBotToken, discordDevelopmentGuildId } =
          configService.get<DiscordConfig>('discord');
        const { env } = configService.get<ServiceConfig>('service');

        return {
          token: discordBotToken,
          development:
            discordDevelopmentGuildId && env === RuntimeEnvironment.LOCAL
              ? [discordDevelopmentGuildId]
              : undefined,
          intents: [
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildMembers,
          ],
        };
      },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
