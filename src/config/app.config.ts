import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import discordConfig from 'src/config/discord.config';
import serviceConfig from 'src/config/service.config';
import { RuntimeEnvironment } from 'src/types/common.types';

export const APP_CONFIG: ConfigModuleOptions = {
  isGlobal: true,
  load: [serviceConfig, discordConfig],
  cache: true,
  validationSchema: Joi.object({
    ENV: Joi.string()
      .valid(
        RuntimeEnvironment.LOCAL,
        RuntimeEnvironment.DEV,
        RuntimeEnvironment.PROD,
      )
      .default(RuntimeEnvironment.LOCAL),
    DISCORD_BOT_TOKEN: Joi.string().required(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
};
