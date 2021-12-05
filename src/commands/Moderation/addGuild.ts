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
  }
}