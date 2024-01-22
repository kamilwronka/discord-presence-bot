import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Once, On, Context, ContextOf } from 'necord';
import { DiscordConfig } from 'src/config/discord.config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    const config = this.configService.get<DiscordConfig>('discord');

    this.logger.log(`Bot logged in as ${client.user.username}`);

    const guild = client.guilds.cache.find(
      (guild) => guild.id === config.discordDevelopmentGuildId,
    );

    const roles = await guild.roles.fetch();
    const members = await guild.members.fetch({ withPresences: true });
    const desiredRole = roles.find(
      (role) => role.name === config.discordDesiredRoleName,
    );

    members.forEach((member) => {
      if (!member?.presence) return;
      if (member.presence.status !== 'online') return;

      member.roles.add(desiredRole);
    });

    this.logger.log('Applied desired role to online members');
  }

  @On('presenceUpdate')
  public async onPresenceUpdate(
    @Context() [oldPresence, newPresence]: ContextOf<'presenceUpdate'>,
  ) {
    if (!oldPresence?.status || !newPresence?.status) return;
    if (oldPresence?.status === newPresence?.status) return;

    if (oldPresence.status !== newPresence.status) {
      this.logger.log(
        `${oldPresence?.user?.username} is now ${newPresence?.status}`,
      );
    }

    const config = this.configService.get<DiscordConfig>('discord');

    const guildRoles = await newPresence.guild.roles.fetch();
    const desiredRole = guildRoles.find(
      (role) => role.name === config.discordDesiredRoleName,
    );

    if (newPresence.status === 'online') {
      newPresence.member.roles.add(desiredRole);

      this.logger.log(`Applied desired role to ${newPresence?.user?.username}`);
    }

    if (newPresence.status === 'offline') {
      newPresence.member.roles.remove(desiredRole);

      this.logger.log(
        `Removed desired role from ${newPresence?.user?.username}`,
      );
    }
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }
}
