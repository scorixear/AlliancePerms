import { CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import messageHandler from '../../misc/messageHandler';
import config from '../../config';
import { CommandInteractionHandle } from '../../interactions/interactionHandles';
import { SlashCommandStringOption } from '@discordjs/builders';
import { LanguageHandler } from '../../misc/languageHandler';
import SqlHandler from '../../misc/sqlHandler';
import DiscordHandler from '../../misc/discordHandler';
import AlbionApiHandler from '../../misc/albionApiHandler';

declare const languageHandler: LanguageHandler;
declare const sqlHandler: SqlHandler;
declare const discordHandler: DiscordHandler;

export default class Register extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandStringOption().setName('ingame_name').setDescription(languageHandler.language.commands.register.options.ingame_name).setRequired(true));
    super(
      'register',
      () => languageHandler.replaceArgs(languageHandler.language.commands.register.description, [config.botPrefix]),
      'register "Scorix"',
      'Moderation',
      'register <Ingame Name>',
      commandOptions,
      false
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    interaction.deferReply();

    const ingameName = interaction.options.getString("ingame_name", true);
    const guildId = await AlbionApiHandler.getPlayerGuildId(ingameName);
    if (guildId) {
      if (await sqlHandler.getGuild(guildId)) {
        if (await sqlHandler.registerUser(interaction.member.user.id, ingameName, guildId)) {
          (interaction.member as GuildMember).roles.add(config.allianceRole, "Register with ingame name " + ingameName);
          interaction.followUp(
            { content: languageHandler.replaceArgs(languageHandler.language.commands.register.success, [ingameName]), ephemeral: true }
            );
        } else {
          interaction.followUp({ content: languageHandler.replaceArgs(languageHandler.language.commands.register.user_registered, [ingameName]), ephemeral: true })
        }
      } else {
        interaction.followUp({ content: languageHandler.replaceArgs(languageHandler.language.commands.register.guild_notfound, [ingameName]), ephemeral: true });
      }
    } else {
      interaction.followUp({ content: languageHandler.replaceArgs(languageHandler.language.commands.register.albion_notfound, [ingameName]), ephemeral: true });
    }
  }
}