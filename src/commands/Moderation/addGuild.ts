import {CommandInteraction, TextChannel, User} from 'discord.js';
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

export default class AddGuild extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandStringOption().setName('guild_name').setDescription(languageHandler.language.commands.addGuild.options.guild_name).setRequired(true));
    super(
      'addGuild',
      ()=>languageHandler.replaceArgs(languageHandler.language.commands.addGuild.description, [config.botPrefix]),
      'addGuild "Kaisers Reich"',
      'Moderation',
      'addGuild <Guild Name>',
      commandOptions,
      true
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    const guildName = interaction.options.getString('guild_name', true);
    const guildId = await AlbionApiHandler.getGuildId(guildName);
    if (guildId) {
      if(await sqlHandler.addGuild(guildId, guildName)) {
        interaction.reply({content: languageHandler.replaceArgs(languageHandler.language.commands.addGuild.success, [guildName]), ephemeral: true});
      } else {
        interaction.reply({content: languageHandler.replaceArgs(languageHandler.language.commands.addGuild.sql_error, [guildName]), ephemeral: true});
      }
    } else {
      interaction.reply({content: languageHandler.replaceArgs(languageHandler.language.commands.addGuild.error_desc, [guildName]), ephemeral: true});
    }
  }
}