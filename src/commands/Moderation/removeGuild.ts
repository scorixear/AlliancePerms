import {CommandInteraction, TextChannel} from 'discord.js';
import messageHandler from '../../misc/messageHandler';
import config from '../../config';
import { CommandInteractionHandle } from '../../interactions/interactionHandles';
import { SlashCommandStringOption } from '@discordjs/builders';
import { LanguageHandler } from '../../misc/languageHandler';
import SqlHandler from '../../misc/sqlHandler';
import DiscordHandler from '../../misc/discordHandler';

declare const languageHandler: LanguageHandler;
declare const sqlHandler: SqlHandler;
declare const discordHandler: DiscordHandler;

export default class RemoveGuild extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandStringOption().setName('guild_name').setDescription(languageHandler.language.commands.addGuild.options.guild_name).setRequired(true));
    super(
      'removeguild',
      ()=>languageHandler.replaceArgs(languageHandler.language.commands.removeGuild.description, [config.botPrefix]),
      'removeguild "Kaisers Reich"',
      'Moderation',
      'removeguild <Guild Name>',
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
    if (await sqlHandler.removeGuild(guildName, false)) {
      interaction.reply({content: languageHandler.replaceArgs(languageHandler.language.commands.removeGuild.success, [guildName]), ephemeral: true});
    } else {
      interaction.reply({content: languageHandler.replaceArgs(languageHandler.language.commands.removeGuild.error, [guildName]), ephemeral: true});
    }
  }
}